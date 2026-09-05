import { faq } from '@/content/faq';
import { services } from '@/content/services';
import { city, site } from '@/config/site';

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
