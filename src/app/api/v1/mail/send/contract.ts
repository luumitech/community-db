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
      /** Google recaptcha token */
      recaptchaToken: z.string(),
      /** Contact email, sender email address */
      contactEmail: zz.string.nonEmpty().email('Must be a valid email'),
      /** Contact name, sender contact name */
      contactName: z.string(),
      subject: zz.string.nonEmpty('Please enter a subject'),
    }),
    body: z.object({
      message: zz.string.nonEmpty('Please enter a subject'),
    }),
    responses: {
      200: z.boolean(),
    },
  },
});
