import {
  initContract,
  ServerInferRequest,
  ServerInferResponses,
} from '@ts-rest/core';
import { nextPublicSchema } from '~/lib/env/env-schema';

export type SInput = ServerInferRequest<typeof envContract.env>;
export type SOutput = ServerInferResponses<typeof envContract.env>;

const c = initContract();

export const envContract = c.router({
  env: {
    method: 'GET',
    path: '/env',
    summary: 'Return all NEXT_PUBLIC env var variables',
    responses: {
      200: nextPublicSchema,
    },
  },
});
