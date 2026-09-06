import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { ImageSlot } from '@/components/ui/ImageSlot';
import { PageHero } from '@/components/sections/PageHero';
import { InstagramFeed } from '@/components/sections/InstagramFeed';
import { BlogListJsonLd } from '@/components/seo/JsonLd';
import { formatPostDate, sortedPosts } from '@/content/posts';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Блог о дизайне и ремонте интерьеров — Soft Interior',
  description:
    'Разбираем сметы, сроки и типичные ошибки на реальных объектах: сколько стоит дизайн-проект, что входит в смету на ремонт, как выбрать студию и не переплатить.',
  alternates: { canonical: '/blog/' },
  openGraph: {
    type: 'website',
    title: 'Блог о дизайне и ремонте интерьеров',
    description:
      'Статьи студии Soft Interior о том, как устроены дизайн-проект, ремонт под ключ и комплектация.',
    url: '/blog/',
  },
};

/** Строка «рубрика · дата · время чтения». */
function PostMeta({
  category,
  publishedAt,
  readingMinutes,
}: {
  category: string;
  publishedAt: string;
  readingMinutes: number;
}) {
  return (
    <div className={styles.meta}>
      <span className={styles.category}>{category}</span>
      <span className={styles.dot} aria-hidden="true">
        ·
      </span>
      <time dateTime={publishedAt}>{formatPostDate(publishedAt)}</time>
      <span className={styles.dot} aria-hidden="true">
        ·
      </span>
      <span>{readingMinutes} мин</span>
    </div>
  );
}

export default function BlogPage() {
  const [lead, ...rest] = sortedPosts;

  return (
    <>
      <BlogListJsonLd />

      <Breadcrumbs items={[{ name: 'Блог', href: '/blog/' }]} />

      <PageHero
        eyebrow="Блог"
        title="Как устроены дизайн и ремонт изнутри"
        lead="Разбираем сметы, сроки и типичные ошибки на реальных объектах — без рекламы материалов и советов «сделайте акцентную стену»."
      />

      <Section bg="raised">
        <article className={styles.featured}>
          <Link href={`/blog/${lead.slug}/`} className={styles.featuredMedia}>
            <ImageSlot
              alt={lead.coverAlt}
              label={lead.coverLabel}
              priority
              sizes="(max-width: 800px) 100vw, 55vw"
            />
          </Link>

          <div className={styles.featuredBody}>
            <PostMeta
              category={lead.category}
              publishedAt={lead.publishedAt}
              readingMinutes={lead.readingMinutes}
            />
            <h2 className={styles.featuredTitle}>
              <Link href={`/blog/${lead.slug}/`}>{lead.title}</Link>
            </h2>
            <p className={styles.featuredExcerpt}>{lead.excerpt}</p>
            <Button href={`/blog/${lead.slug}/`} variant="link">
              Читать статью <span aria-hidden="true">→</span>
            </Button>
          </div>
        </article>

        <div className={styles.grid}>
          {rest.map((post) => (
            <article key={post.slug} className={styles.card}>
              <Link href={`/blog/${post.slug}/`} className={styles.media}>
                <ImageSlot
                  alt={post.coverAlt}
                  label={post.coverLabel}
                  sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw"
                />
              </Link>

              <PostMeta
                category={post.category}
                publishedAt={post.publishedAt}
                readingMinutes={post.readingMinutes}
              />

              <h2 className={styles.title}>
                <Link href={`/blog/${post.slug}/`}>{post.title}</Link>
              </h2>

              <p className={styles.excerpt}>{post.excerpt}</p>

              <div className={styles.more}>
                <Button href={`/blog/${post.slug}/`} variant="link">
                  Читать <span aria-hidden="true">→</span>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <InstagramFeed />
    </>
  );
}
