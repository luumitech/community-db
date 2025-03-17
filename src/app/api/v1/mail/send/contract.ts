import {
  initContract,
  ServerInferRequest,
  ServerInferResponses,
} from '@ts-rest/core';
import { z, zz } from '~/lib/zod';

export type SInput = ServerInferRequest<typeof sendContract.send>;
export type SOutput = ServerInferResponses<typeof sendContract.send>;

const c = initContract();

export const sendContract = c.router({
  send: {
    method: 'POST',
    path: '/send',
    summary: 'Send email to webserver owner',
    query: z.object({
      subject: zz.string.nonEmpty('Please enter a subject'),
      /** Include server log in sent mail */
      log: zz.coerce.toBoolean().optional(),
    }),
    body: z.object({
      /** Google recaptcha token */
      recaptchaToken: z.string(),
      /**
       * Email recipients, if not specified, email will be sent to
       * EMAIL_CONTACT_INFO
       */
      to: z
        .array(
          z.object({
            email: zz.string.nonEmpty('Please enter an email'),
            name: z.string(),
          })
        )
        .optional(),
      message: zz.string.nonEmpty('Please enter a subject'),
    }),
    responses: {
      200: z.boolean(),
    },
  },
});
