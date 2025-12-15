import { createNextHandler } from '@ts-rest/serverless/next';
import { errorHandler } from '~/lib/ts-rest/error-handler';
import { env } from '../env';
import { mail } from '../mail';
import { sample } from '../sample';
import { v1Contract } from './contract';

const handler = createNextHandler(
  v1Contract,
  {
    env,
    sample,
    mail,
  },
  {
    basePath: '/api',
    responseValidation: false,
    handlerType: 'app-router',
    errorHandler,
  }
);

export {
  handler as DELETE,
  handler as GET,
  handler as PATCH,
  handler as POST,
  handler as PUT,
};
