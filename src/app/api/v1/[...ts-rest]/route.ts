import { createNextHandler } from '@ts-rest/serverless/next';
import { errorHandler } from '~/lib/ts-rest/error-handler';
import { mail } from '../mail';
import { v1Contract } from './contract';

const handler = createNextHandler(
  v1Contract,
  {
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
