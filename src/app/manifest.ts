import type { MetadataRoute } from 'next';
import { appDescription, appTitle } from '~/lib/env-var';

/**
 * See NextJS PWA for further guidance
 *
 * See:
 * https://nextjs.org/docs/app/building-your-application/configuring/progressive-web-apps
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: appTitle,
    short_name: 'communityDB',
    description: appDescription,
    start_url: '/',
    display: 'standalone',
    // background_color: '#ffffff',
    // theme_color: '#000000',
    // icons: [
    //   {
    //     src: '/icon-192x192.png',
    //     sizes: '192x192',
    //     type: 'image/png',
    //   },
    //   {
    //     src: '/icon-512x512.png',
    //     sizes: '512x512',
    //     type: 'image/png',
    //   },
    // ],
  };
}
