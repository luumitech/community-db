import { MetadataRoute } from 'next';
import { env } from '~/lib/env/server-env';

export default function robots(): MetadataRoute.Robots {
  const hostname = env('NEXT_PUBLIC_HOSTNAME');

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: ['_next/', '/terms', '/privacy', '/community/', '/api/'],
      },
    ],
    sitemap: [new URL('/sitemap.xml', hostname).toString()],
  };
}
