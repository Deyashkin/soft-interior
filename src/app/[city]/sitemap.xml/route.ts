import { posts } from '@/content/posts';
import { getPublishedProjects } from '@/lib/projects';
import { cityFromParams, type CityParams } from '@/config/city';

/**
 * Карта сайта города — отдаётся по адресу /sitemap.xml своего домена.
 *
 * Добавили новую страницу в src/app/[city] — добавьте её и сюда,
 * иначе поисковик найдёт её позже и только по ссылкам.
 */
/** Кэшируется как страница: пересчитывается при деплое и сохранении в админке. */
export const dynamic = 'force-static';

export async function GET(_request: Request, { params }: { params: CityParams }) {
  const city = await cityFromParams(params);
  const now = new Date();

  const pages = [
    { path: '/', priority: 1 },
    { path: '/dizayn-interyera/', priority: 0.9 },
    { path: '/remont/', priority: 0.9 },
    { path: '/komplektaciya/', priority: 0.8 },
    { path: '/ceny/', priority: 0.8 },
    { path: '/projects/', priority: 0.8 },
    { path: '/o-studii/', priority: 0.6 },
    { path: '/blog/', priority: 0.5 },
    { path: '/kontakty/', priority: 0.6 },
  ].map((page) => ({ ...page, lastModified: now }));

  const projects = await getPublishedProjects();
  const projectPages = projects.map((project) => ({
    path: `/projects/${project.slug}/`,
    priority: 0.7,
    lastModified: now,
  }));

  // У статей отдаём реальную дату публикации, а не дату запроса.
  const postPages = posts.map((post) => ({
    path: `/blog/${post.slug}/`,
    priority: 0.6,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
  }));

  const urls = [...pages, ...projectPages, ...postPages]
    .map(
      (page) =>
        `<url><loc>${city.origin}${page.path}</loc>` +
        `<lastmod>${page.lastModified.toISOString()}</lastmod>` +
        `<changefreq>monthly</changefreq><priority>${page.priority}</priority></url>`,
    )
    .join('\n');

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    `${urls}\n</urlset>\n`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
