import MailjetApi, { SendEmailV3_1 } from 'node-mailjet';
import { env } from '~/lib/env-cfg';
import { Logger } from '~/lib/logger';

export { type SendEmailV3_1 } from 'node-mailjet';

const logger = Logger('mailjet');

interface MailjetOpt {
  /** Mailjet verified sender */
  fromEmail: string;
  sandboxMode?: boolean;
}

type SendEmailT = Omit<SendEmailV3_1.Message, 'From'>;

export class Mailjet {
  private mailjet: MailjetApi;

  constructor(
    apiKey: string,
    apiSecret: string,
    private opt: MailjetOpt
  ) {
    this.mailjet = new MailjetApi({ apiKey, apiSecret });
  }

  /** Instantiate a mailjet instance from env configuration */
  static async fromConfig() {
    const api = new Mailjet(
      env.EMAIL_MAILJET_API_KEY,
      env.EMAIL_MAILJET_API_SECRET,
      {
        fromEmail: env.EMAIL_MAILJET_SENDER,
        sandboxMode: env.EMAIL_MAILJET_SANDBOX_MODE,
      }
    );
    return api;
  }

  /**
   * Send emails via mailjet
   *
   * @example
   *
   * ```js
   * const count = await sendEmails([
   *   {
   *     To: [
   *       {
   *         Email: 'kendrickw@luumitech.com',
   *         Name: 'Kendrick Wong',
   *       },
   *     ],
   *     Subject: 'Mail from LuumiTech Webpage',
   *     TextPart: [`From: ${email}`, description].join('\n'),
   *   },
   * ]);
   * ```
   */
  async sendEmails(messages: SendEmailT[]) {
    // Chunk messages into 50 message block
    // https://github.com/mailjet/mailjet-apiv3-nodejs/issues/67
    const chunk = 50;
    for (let i = 0, j = messages.length; i < j; i += chunk) {
      const msgBlock = messages.slice(i, i + chunk).map((msg) => ({
        From: { Email: this.opt.fromEmail },
        ...msg,
      }));

      // Mailjet payload
      const request = {
        Messages: msgBlock,
        SandBoxMode: this.opt?.sandboxMode,
      };
      logger.debug(request);

      // Mailjet API Overview
      // https:// dev.mailjet.com/email/guides/
      const result = await this.mailjet
        .post('send', { version: 'v3.1' })
        .request(request);
      logger.debug(result.response.data);
    }
    return messages.length;
  }
}
