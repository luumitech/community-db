import { StatusCodes } from 'http-status-codes';
import * as R from 'remeda';
import { env } from '~/lib/env-cfg';
import { Logger, recentServerLog } from '~/lib/logger';
import { Nodemailer } from '~/lib/nodemailer';
import { verifyRecaptchaV3 } from '~/lib/recaptcha';
import type { SInput, SOutput } from './contract';

const logger = Logger('/mail/send');

/**
 * Pull new sales orders from Odoo and push them to OnFleet
 *
 * This API is meant to be call by a scheduler on a daily basis to synchronize
 * new Odoo sales orders to OnFleet system
 */
export async function send(req: SInput): Promise<SOutput> {
  const { html, recaptchaToken, to } = req.body;
  const { subject, log } = req.query;
  let { message } = req.body;

  // verify recaptcha token
  await verifyRecaptchaV3(recaptchaToken);

  // Construct email recipient list
  const To = R.isEmpty(to ?? [])
    ? env.EMAIL_FROM
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
