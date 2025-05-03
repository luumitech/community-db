import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { getServerSession } from '~/api/auth/[...better]/auth';

const f = createUploadthing();

/**
 * Defining routes for uploading files to uploadthing service
 *
 * See:
 * https://docs.uploadthing.com/getting-started/appdir#create-a-next-js-api-route-using-the-file-router
 */
export const uploadRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  xlsx: f({
    blob: {
      /**
       * For full list of options and defaults, see the File Route API reference
       *
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: '64MB',
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      const session = await getServerSession(req.headers);
      const user = session?.user;

      // If you throw, the user will not be able to upload
      if (!user) {
        throw new UploadThingError('Unauthorized upload');
      }

      // Return additional information to metadata in the next step
      return {};
    })
    .onUploadComplete(async ({ metadata, file }) => {
      /**
       * Return content to client side
       *
       * To access this value, call `uploadFiles` and check via 'serverData'
       * property in the response data
       */
      return;
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
