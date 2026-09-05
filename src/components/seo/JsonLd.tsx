import { faq } from '@/content/faq';
import { services } from '@/content/services';
import { sortedPosts, type Post } from '@/content/posts';
import { city, site } from '@/config/site';

/** Объём текста статьи — поиск использует его как признак содержательности. */
function countWords(post: Post) {
  return post.body.reduce((total, block) => {
    const text = block.type === 'list' ? block.items.join(' ') : block.text;
    return total + text.split(/\s+/).length;
  }, 0);
}

/**
 * Микроразметка schema.org.
 *
 * Отдаётся поисковикам отдельным JSON-скриптом — на вид страницы не влияет,
 * но даёт расширенные сниппеты в выдаче Яндекса и Google.
 *
 * Что размечено:
 *   Organization    — карточка компании (адрес, телефон, соцсети)
 *   Service         — три услуги с ценами
 *   FAQPage         — вопросы из src/content/faq.ts
 *   BreadcrumbList  — хлебные крошки (см. <Breadcrumbs />)
 */

function JsonLdScript({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Карточка организации. Ставится в корневой layout — на всех страницах. */
export function OrganizationJsonLd() {
  return (
    <JsonLdScript
      data={{
        '@context': 'https://schema.org',
        '@type': 'HomeAndConstructionBusiness',
        name: site.name,
        description: site.description,
        url: site.url,
        email: site.email,
        telephone: city.phone,
        priceRange: '₽₽₽',
        address: {
          '@type': 'PostalAddress',
          addressLocality: city.name,
          streetAddress: city.address,
          addressCountry: 'RU',
        },
        areaServed: city.region,
        foundingDate: String(site.foundedYear),
        sameAs: site.social.map((link) => link.href),
      }}
    />
  );
}

/** Услуги с ценами — для главной и страниц услуг. */
export function ServicesJsonLd() {
  return (
    <JsonLdScript
      data={{
        '@context': 'https://schema.org',
        '@graph': services.map((service) => ({
          '@type': 'Service',
          name: `${service.title} ${city.locative}`,
          description: service.summary,
          provider: { '@type': 'Organization', name: site.name },
          areaServed: city.name,
          url: `${site.url}${service.href}`,
          offers: {
            '@type': 'Offer',
            price: service.priceFrom.replace(/[^\d]/g, ''),
            priceCurrency: 'RUB',
            unitText: 'м²',
          },
        })),
      }}
    />
  );
}

/** Блок вопросов и ответов. */
export function FaqJsonLd() {
  return (
    <JsonLdScript
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      }}
    />
  );
}

/** Статья блога: даёт в выдаче дату, автора и расширенный сниппет. */
export function ArticleJsonLd({ post }: { post: Post }) {
  return (
    <JsonLdScript
      data={{
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        articleSection: post.category,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt ?? post.publishedAt,
        wordCount: countWords(post),
        inLanguage: 'ru-RU',
        author: { '@type': 'Person', name: post.author },
        publisher: {
          '@type': 'Organization',
          name: site.name,
          url: site.url,
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${site.url}/blog/${post.slug}/`,
        },
      }}
    />
  );
}

/** Список статей — помогает поиску увидеть блог как раздел, а не набор страниц. */
export function BlogListJsonLd() {
  return (
    <JsonLdScript
      data={{
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: `Блог студии ${site.name}`,
        url: `${site.url}/blog/`,
        inLanguage: 'ru-RU',
        publisher: { '@type': 'Organization', name: site.name, url: site.url },
        blogPost: sortedPosts.map((post) => ({
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt,
          author: { '@type': 'Person', name: post.author },
          url: `${site.url}/blog/${post.slug}/`,
        })),
      }}
    />
  );
}

/** Хлебные крошки. items — от главной к текущей странице. */
export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; href: string }[];
}) {
  return (
    <JsonLdScript
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: `${site.url}${item.href}`,
        })),
      }}
    />
  );
}
