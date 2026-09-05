import type { MetadataRoute } from 'next';
import { site } from '@/config/site';

/** Отдаётся по адресу /robots.txt. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/politika-konfidencialnosti/', '/soglasie/'],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
