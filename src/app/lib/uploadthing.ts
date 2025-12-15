import { UTApi } from 'uploadthing/server';
import { env } from '~/lib/env/server-env';

/**
 * Access UploadThing API on server side
 *
 * See: https://docs.uploadthing.com/api-reference/ut-api
 */
export const utapi = new UTApi({
  token: env('UPLOADTHING_TOKEN'),
});
