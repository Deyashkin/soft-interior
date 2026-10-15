import type { MetadataRoute } from 'next';
import { site } from '@/config/site';

/** Отдаётся по адресу /robots.txt. */
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/oferta/', '/politika-konfidencialnosti/', '/soglasie/'],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
