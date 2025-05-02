import { createRouteHandler } from 'uploadthing/next';
import { uploadRouter } from './uploadthing';

/**
 * Setting up uploadthing API
 *
 * See:
 * https://docs.uploadthing.com/getting-started/appdir#create-a-next-js-api-route-using-the-file-router
 */
export const { GET, POST } = createRouteHandler({
  router: uploadRouter,
});
