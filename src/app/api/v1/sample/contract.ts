import {
  initContract,
  ServerInferRequest,
  ServerInferResponses,
} from '@ts-rest/core';
import { z, zz } from '~/lib/zod';

export type SInput = ServerInferRequest<typeof sampleContract.sample>;
export type SOutput = ServerInferResponses<typeof sampleContract.sample>;

const c = initContract();

export const sampleContract = c.router({
  sample: {
    method: 'GET',
    path: '/sample',
    summary: 'Sample API for testing purpose',
    query: z.object({
      input: z.string().optional(),
    }),
    // body: z.object({
    //   input: z.string().optional(),
    // }),
    responses: {
      200: z.string(),
    },
  },
});
