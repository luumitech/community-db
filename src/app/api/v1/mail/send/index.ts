import { StatusCodes } from 'http-status-codes';
import * as R from 'remeda';
import { env } from '~/lib/env-cfg';
import { Logger } from '~/lib/logger';
import { Mailjet, type SendEmailV3_1 } from '~/lib/mailjet';
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
  const { recaptchaToken, to, message } = req.body;
  const { subject } = req.query;

  // verify recaptcha token
  await verifyRecaptchaV3(recaptchaToken);

  // Construct email recipient list
  const To: SendEmailV3_1.EmailAddressTo[] = R.isEmpty(to ?? [])
    ? [{ Email: env.EMAIL_CONTACT_INFO }]
    : to!.map(({ email, name }) => ({ Email: email, Name: name }));

  const mailjet = await Mailjet.fromConfig();
  await mailjet.sendEmails([
    {
      To,
      Subject: subject,
      TextPart: message,
    },
  ]);

  // If needed to communicate error
  // throw new HttpError('Error message', StatusCodes.BAD_REQUEST);

  return {
    status: StatusCodes.OK,
    body: true,
  };
}
