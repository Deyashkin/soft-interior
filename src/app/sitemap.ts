import type { MetadataRoute } from 'next';
import { posts } from '@/content/posts';
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
    lastModified: new Date(),
  }));

  // У статей отдаём реальную дату публикации, а не дату сборки.
  const postPages = posts.map((post) => ({
    path: `/blog/${post.slug}/`,
    priority: 0.6,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
  }));

  return [
    ...pages.map((page) => ({ ...page, lastModified: new Date() })),
    ...projectPages,
    ...postPages,
  ].map((page) => ({
    url: `${site.url}${page.path}`,
    lastModified: page.lastModified,
    changeFrequency: 'monthly' as const,
    priority: page.priority,
  }));
}
