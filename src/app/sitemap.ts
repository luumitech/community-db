import { MetadataRoute } from 'next';
import { env } from 'next-runtime-env';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const hostname = env('NEXT_PUBLIC_HOSTNAME');
  const landingPage = [
    {
      url: hostname!,
      lastModified: new Date(),
      priority: 1,
    },
  ];

  const siteMap = [...landingPage];

  return siteMap;
}
