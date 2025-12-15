import {
  initContract,
  ServerInferRequest,
  ServerInferResponses,
} from '@ts-rest/core';
import { clientSchema } from '~/lib/env/env-schema';
import { z, zz } from '~/lib/zod';

export type SInput = ServerInferRequest<typeof envContract.env>;
export type SOutput = ServerInferResponses<typeof envContract.env>;

const c = initContract();

export const envContract = c.router({
  env: {
    method: 'GET',
    path: '/env',
    summary: 'Read NEXT_PUBLIC env var runtime value',
    query: z.object({
      /**
       * NEXT_PUBLIC env var name
       *
       * For example, to get NEXT_PUBLIC_PLAN_FREE_NAME, specify
       * name="NEXT_PUBLIC_PLAN_FREE_NAME"
       */
      name: clientSchema.keyof(),
    }),
    responses: {
      200: z.string(),
    },
  },
});
