import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPConnection from 'nodemailer/lib/smtp-connection';
import { env } from '~/lib/env-cfg';
import { Logger } from '~/lib/logger';

const logger = Logger('nodemailer');

interface NodemailerOptions {
  /**
   * Sender address
   *
   * I.e. `"community-noreply <noreply@mail.community.com>"`
   */
  from: string;
}

export class Nodemailer {
  private transporter: nodemailer.Transporter;

  constructor(
    private config: SMTPConnection.Options,
    private opt: NodemailerOptions
  ) {
    this.transporter = nodemailer.createTransport(config);
  }

  /** Instantiate a mailjet instance from env configuration */
  static async fromConfig() {
    const api = new Nodemailer(
      {
        host: env.EMAIL_SERVER_HOST,
        port: env.EMAIL_SERVER_PORT,
        secure: env.EMAIL_SERVER_SECURE,
        auth: {
          user: env.EMAIL_SERVER_USER,
          pass: env.EMAIL_SERVER_PASSWORD,
        },
      },
      {
        from: env.EMAIL_FROM,
      }
    );
    return api;
  }

  /**
   * Send email
   *
   * @example
   *
   * ```js
   * const count = await sendMail({
   *   to: 'bar@example.com, baz@example.com', // list of receivers
   *   subject: 'Hello ✔', // Subject line
   *   text: 'Hello world?', // plain text body
   *   html: '<b>Hello world?</b>', // html body
   * });
   * ```
   */
  async sendMail(message: Mail.Options) {
    const result = await this.transporter.sendMail({
      from: this.opt.from,
      ...message,
    });

    if (this.config.host === 'smtp.ethereal.email') {
      logger.debug({ previewURL: nodemailer.getTestMessageUrl(result) });
    }

    const { envelope } = result;
    logger.debug({ envelope });
  }
}
