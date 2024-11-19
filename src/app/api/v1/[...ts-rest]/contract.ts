import { initContract } from '@ts-rest/core';
import { mailContract } from '../mail/contract';

const c = initContract();

export const v1Contract = c.router(
  {
    mail: mailContract,
  },
  {
    pathPrefix: '/v1',
  }
);
