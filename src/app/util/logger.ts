import pino from 'pino';
import pretty from 'pino-pretty';
import { isProduction } from '~/util/env-var';

// Standard set of serializers
// https://github.com/pinojs/pino-std-serializers
export const serializers = pino.stdSerializers;

function errorSerializer(err: Error) {
  const json = serializers.err(err);
  const { stack, ...other } = json;
  if (stack) {
    // If stack is available, show the stack first
    console.error(stack);
  }
  // Show the rest of the error object
  return other;
}

/**
 * Any logger from 'debug' level or below is controlled by the
 * 'LOG_DEBUG' environment variable.
 *
 * @param flag debug flag to check
 * @example
 *   // if the LOG_DEBUG env var contains the string:
 *   //   'mail, passport-.*'
 *   debugEnabled('mail');  // true
 *   debugEnabled('passport-init');  // true
 *   debugEnabled('flow');  // false
 */
function debugEnabled(flag: string) {
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

/**
 * Logger for server component
 */
function logger(src: string, opts: pino.LoggerOptions = {}) {
  //   Prettier stream, only used in development
  const prettyStream: pino.DestinationStream = pretty({
    // Options: https://github.com/pinojs/pino-pretty#options
    translateTime: true,
    colorize: true,
  });

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

  return isProduction() ? pino(pinoOpts) : pino(pinoOpts, prettyStream);
}

export const Logger = (src: string, opts?: pino.LoggerOptions) =>
  logger(src, opts).child({ src });
