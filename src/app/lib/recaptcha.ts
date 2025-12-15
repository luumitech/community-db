import queryString from 'query-string';
import { env } from '~/lib/env/server-env';
import { Logger } from '~/lib/logger';

const logger = Logger('/lib/recaptcha');

/**
 * Verify Google Recaptcha v3 token
 *
 * https://developers.google.com/recaptcha/docs/verify
 */
export async function verifyRecaptchaV3(recaptchaToken: string) {
  const url = queryString.stringifyUrl({
    url: 'https://www.google.com/recaptcha/api/siteverify',
    query: {
      secret: env('GOOGLE_RECAPTCHA_SECRET_KEY'),
      response: recaptchaToken,
    },
  });
  const resp = await fetch(url, { method: 'POST' });
  const result = await resp.json();
  if (!result.success) {
    logger.error(result, 'Recaptcha failed');
    /**
     * To decipher error codes, see:
     *
     * https://developers.google.com/recaptcha/docs/verify#error_code_reference
     */
    throw new Error('Recaptcha Failed');
  }

  return result;
}
