import { StatusCodes } from 'http-status-codes';
import * as R from 'remeda';
import { env } from '~/lib/env/server-env';
import { Logger, recentServerLog } from '~/lib/logger';
import { Nodemailer } from '~/lib/nodemailer';
import { verifyRecaptchaV3 } from '~/lib/recaptcha';
import type { SInput, SOutput } from './contract';

const logger = Logger('/mail/send');

/**
 * Send email via nodemailer
 *
 * See contract for input/output configuration
 */
export async function send(req: SInput): Promise<SOutput> {
  const { html, recaptchaToken, to } = req.body;
  const { subject, log } = req.query;
  let { message } = req.body;

  // verify recaptcha token
  await verifyRecaptchaV3(recaptchaToken);

  // Construct email recipient list
  const To = R.isEmpty(to ?? [])
    ? env('EMAIL_FROM')
    : to!.map(({ email, name }) => `${name} <${email}>`).join(', ');

  if (log) {
    logger.info('logging output');
    const serverLog = recentServerLog.contentAsString();
    message += ['', 'Server Log:', serverLog].join('\n');
  }

  const mailer = await Nodemailer.fromConfig();
  await mailer.sendMail({
    to: To,
    subject,
    text: message,
    html: html,
  });

  // If needed to communicate error
  // throw new HttpError('Error message', StatusCodes.BAD_REQUEST);

  return {
    status: StatusCodes.OK,
    body: true,
  };
}
