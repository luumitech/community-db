import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/'],
      disallow: ['/community/', '/api/'],
    },
    sitemap: ['https://community-db.azurewebsites.net/sitemap.xml'],
  };
}
