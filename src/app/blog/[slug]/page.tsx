import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ImageSlot } from '@/components/ui/ImageSlot';
import { ArticleJsonLd } from '@/components/seo/JsonLd';
import { formatPostDate, posts, relatedPosts } from '@/content/posts';
import styles from './page.module.css';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Все статьи собираются статикой на этапе сборки. */
export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);

  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}/` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}/`,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);

  if (!post) notFound();

  const related = relatedPosts(post);

  return (
    <>
      <ArticleJsonLd post={post} />

      <Breadcrumbs
        items={[
          { name: 'Блог', href: '/blog/' },
          { name: post.title, href: `/blog/${post.slug}/` },
        ]}
      />

      <Section bg="default" padding="sm">
        <header className={styles.header}>
          <div className={styles.meta}>
            <span className={styles.category}>{post.category}</span>
            <span className={styles.dot} aria-hidden="true">
              ·
            </span>
            <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
            <span className={styles.dot} aria-hidden="true">
              ·
            </span>
            <span>{post.readingMinutes} мин чтения</span>
          </div>

          <h1 className={styles.title}>{post.title}</h1>
          <p className={styles.excerpt}>{post.excerpt}</p>
        </header>
      </Section>

      <Section bg="default" padding="none" flush>
        <div className={styles.cover}>
          <ImageSlot
            alt={post.coverAlt}
            label={post.coverLabel}
            preload
            sizes="100vw"
          />
        </div>
      </Section>

      <Section bg="raised">
        <article className={styles.body}>
          {post.body.map((block, index) => {
            if (block.type === 'heading') {
              return (
                <h2 key={index} className={styles.subheading}>
                  {block.text}
                </h2>
              );
            }

            if (block.type === 'list') {
              return (
                <ul key={index} className={styles.list}>
                  {block.items.map((item) => (
                    <li key={item} className={styles.listItem}>
                      {item}
                    </li>
                  ))}
                </ul>
              );
            }

            return (
              <p key={index} className={styles.paragraph}>
                {block.text}
              </p>
            );
          })}
        </article>

        <div className={styles.author}>
          <div className={styles.authorPhoto}>
            <ImageSlot alt={post.author} label="Фото" circle sizes="56px" />
          </div>
          <div className={styles.authorInfo}>
            <span className={styles.authorName}>{post.author}</span>
            <span className={styles.authorNote}>Студия Soft Interior</span>
          </div>
        </div>
      </Section>

      {related.length > 0 && (
        <Section bg="sunken" padding="sm">
          <Eyebrow>Читайте также</Eyebrow>

          <div className={styles.relatedGrid}>
            {related.map((item) => (
              <article key={item.slug} className={styles.relatedCard}>
                <span className={styles.category}>{item.category}</span>
                <h2 className={styles.relatedTitle}>
                  <Link href={`/blog/${item.slug}/`}>{item.title}</Link>
                </h2>
                <p className={styles.relatedExcerpt}>{item.excerpt}</p>
                <Button href={`/blog/${item.slug}/`} variant="link">
                  Читать <span aria-hidden="true">→</span>
                </Button>
              </article>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
