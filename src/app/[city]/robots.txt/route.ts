import { cityFromParams, type CityParams } from '@/config/city';

/** robots.txt города — отдаётся по адресу /robots.txt своего домена. */
/** Кэшируется как страница: пересчитывается при деплое и сохранении в админке. */
export const dynamic = 'force-static';

export async function GET(_request: Request, { params }: { params: CityParams }) {
  const city = await cityFromParams(params);

  const body = [
    'User-Agent: *',
    'Allow: /',
    'Disallow: /politika-konfidencialnosti/',
    'Disallow: /soglasie/',
    'Disallow: /admin',
    '',
    `Host: ${city.origin}`,
    `Sitemap: ${city.origin}/sitemap.xml`,
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
