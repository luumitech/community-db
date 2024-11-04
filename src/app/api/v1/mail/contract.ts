import { initContract } from '@ts-rest/core';
import { sendContract } from './send/contract';

const c = initContract();

export const mailContract = c.router(
  {
    ...sendContract,
  },
  {
    pathPrefix: '/mail',
  }
);
