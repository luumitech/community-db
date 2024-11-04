import {
  initContract,
  ServerInferRequest,
  ServerInferResponses,
} from '@ts-rest/core';
import { z } from 'zod';

export type SInput = ServerInferRequest<typeof sendContract.send>;
export type SOutput = ServerInferResponses<typeof sendContract.send>;

const c = initContract();

export const sendContract = c.router({
  send: {
    method: 'POST',
    path: '/send',
    summary: 'Send email to webserver owner',
    query: z.object({
      /** Contact email, sender email address */
      contactEmail: z.string(),
      /** Contact name, sender contact name */
      contactName: z.string().optional(),
      subject: z.string(),
    }),
    body: z.object({
      message: z.string(),
    }),
    responses: {
      200: z.boolean(),
    },
  },
});
