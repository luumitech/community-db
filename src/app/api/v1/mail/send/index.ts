import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { env } from '~/lib/env-cfg';
import { HttpError } from '~/lib/http-error';
import { Logger } from '~/lib/logger';
import { Mailjet } from '~/lib/mailjet';
import type { SInput, SOutput } from './contract';

const logger = Logger('/mail/send');

/**
 * Pull new sales orders from Odoo and push them to OnFleet
 *
 * This API is meant to be call by a scheduler on a daily basis to synchronize
 * new Odoo sales orders to OnFleet system
 */
export async function send(req: SInput): Promise<SOutput> {
  const { message } = req.body;
  const { contactEmail, contactName, subject } = req.query;

  const mailjet = await Mailjet.fromConfig();
  mailjet.sendEmails([
    {
      To: [{ Email: env().EMAIL_CONTACT_INFO }],
      Subject: subject,
      TextPart: [
        'Contact Info:',
        `Name: ${contactName}`,
        `Email: ${contactEmail}`,
        '',
        message,
      ].join('\n'),
    },
  ]);

  // If needed to communicate error
  // throw new HttpError('Error message', StatusCodes.BAD_REQUEST);

  return {
    status: StatusCodes.OK,
    body: true,
  };
}
