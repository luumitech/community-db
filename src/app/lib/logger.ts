'server-only';
import pino from 'pino';
import pretty from 'pino-pretty';
import stream from 'stream';
import { isProduction } from '~/lib/env';
import { FixedSizeBuffer } from '~/lib/fixed-size-buffer';
import { insertIf } from '~/lib/insert-if';

// Standard set of serializers
// https://github.com/pinojs/pino-std-serializers
export const serializers = pino.stdSerializers;

function errorSerializer(err: Error) {
  const json = serializers.err(err);
  // In production, we want to include the entire error object in the logger output
  // But in development mode, we want to show the stack trace first
  if (isProduction()) {
    return json;
  } else {
    const { stack, ...other } = json;
    if (stack) {
      // If stack is available, show the stack first
      console.error(stack);
    }
    return other;
  }
}

/**
 * Any logger from 'debug' level or below is controlled by the 'LOG_DEBUG'
 * environment variable.
 *
 * @example
 *
 * ```js
 * // if the LOG_DEBUG env var contains the string:
 * //   'mail, passport-.*'
 * debugEnabled('mail'); // true
 * debugEnabled('passport-init'); // true
 * debugEnabled('flow'); // false
 * ```
 *
 * @param flag Debug flag to check
 */
function debugEnabled(flag: string) {
  // Not using ~/lib/env/server-env because it also reference this file
  const flagEnv = process.env.LOG_DEBUG;

  if (!flagEnv) {
    return false;
  }
  const flagList = flagEnv.split(',').map((flg) => {
    const exp = flg.trim();
    const matchExp = new RegExp(`^${exp}$`); // must match whole word
    return !!flag.match(matchExp);
  });
  return flagList.includes(true);
}

const STREAM_STDOUT: pino.StreamEntry = {
  level: 'trace',
  stream: pino.destination(1),
};

/** Pino-pretty streamer for development build */
const STREAM_PRETTY: pino.StreamEntry = {
  level: 'trace',
  stream: pretty({
    // Options: https://github.com/pinojs/pino-pretty#options
    translateTime: 'SYS:standard',
    sync: true,
  }),
};

/**
 * Fixed size buffer for storing log data
 *
 * This is primary created for generation of support data. 10K should be large
 * enough to capture the last few log entries so they can be sent to support
 * team to diagnose the problem
 */
export const recentServerLog = new FixedSizeBuffer(10000);
export const recentServerLogStream = new stream.Writable({
  write(chunk, encoding, next) {
    try {
      recentServerLog.add(chunk);
    } catch (err) {
      // ignore err
    } finally {
      next();
    }
  },
});

const STREAM_MEMORY: pino.StreamEntry = {
  level: 'trace',
  stream: recentServerLogStream,
};

/** Logger for server component */
function logger(src: string, opts: pino.LoggerOptions = {}) {
  // Options: https://github.com/pinojs/pino/blob/master/docs/api.md#options
  const pinoOpts = {
    serializers: {
      err: errorSerializer,
    },
    // If debug is enabled, then the everything above 'trace' is show
    // Otherwise, only 'info' or above is shown
    level: debugEnabled(src) ? 'trace' : 'info',
    ...opts,
  };

  return pino(
    pinoOpts,
    pino.multistream([
      ...insertIf(isProduction(), STREAM_STDOUT),
      ...insertIf(!isProduction(), STREAM_PRETTY),
      STREAM_MEMORY,
    ])
  );
}

export const Logger = (src: string, opts?: pino.LoggerOptions) =>
  logger(src, opts).child({ src });
