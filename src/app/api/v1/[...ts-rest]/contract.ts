import { initContract } from '@ts-rest/core';
import { mailContract } from '../mail/contract';
import { sampleContract } from '../sample/contract';

const c = initContract();

export const v1Contract = c.router(
  {
    ...sampleContract,
    mail: mailContract,
  },
  {
    pathPrefix: '/v1',
  }
);
