import { initContract } from '@ts-rest/core';
import { envContract } from '../env/contract';
import { mailContract } from '../mail/contract';
import { sampleContract } from '../sample/contract';

const c = initContract();

export const v1Contract = c.router(
  {
    ...sampleContract,
    ...envContract,
    mail: mailContract,
  },
  {
    pathPrefix: '/v1',
  }
);
