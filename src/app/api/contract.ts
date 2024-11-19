import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { v1Contract } from './v1/[...ts-rest]/contract';

const c = initContract();

export const contract = c.router(
  {
    ...v1Contract,
  },
  {
    pathPrefix: '/api',
    strictStatusCodes: true,
    commonResponses: {
      401: z.object({
        message: z.string(),
      }),
      400: z.object({
        message: z.string(),
        error: z.unknown().optional(),
      }),
      500: z.object({
        message: z.string(),
        error: z.unknown().optional(),
      }),
    },
  }
);
