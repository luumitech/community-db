import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const landingPage = [
    {
      url: 'https://community-db.azurewebsites.net/',
      lastModified: new Date(),
      priority: 1,
    },
  ];

  const siteMap = [...landingPage];

  return siteMap;
}
