import { MetadataRoute } from 'next';
import { env } from '~/lib/env/server-env';

export default function sitemap(): MetadataRoute.Sitemap {
  const hostname = env('NEXT_PUBLIC_HOSTNAME');
  const landingPage = [
    {
      url: hostname,
      lastModified: new Date(),
      priority: 1,
    },
  ];

  const siteMap = [...landingPage];

  return siteMap;
}
