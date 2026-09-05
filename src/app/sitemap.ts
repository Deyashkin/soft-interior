import type { MetadataRoute } from 'next';
import { projects } from '@/content/projects';
import { site } from '@/config/site';

/**
 * Карта сайта — отдаётся по адресу /sitemap.xml.
 *
 * Добавили новую страницу в src/app — добавьте её и сюда,
 * иначе поисковик найдёт её позже и только по ссылкам.
 */
export default function sitemap(): MetadataRoute.Sitemap {
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
  ];

  const projectPages = projects.map((project) => ({
    path: `/projects/${project.slug}/`,
    priority: 0.7,
  }));

  return [...pages, ...projectPages].map((page) => ({
    url: `${site.url}${page.path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: page.priority,
  }));
}
