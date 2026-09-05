import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { Num } from '@/components/ui/Num';
import { PageHero } from '@/components/sections/PageHero';
import { Process } from '@/components/sections/Process';
import { Faq } from '@/components/sections/Faq';
import { LeadForm } from '@/components/sections/LeadForm';
import { SeoBlock } from '@/components/sections/SeoBlock';
import { FaqJsonLd, ServicesJsonLd } from '@/components/seo/JsonLd';
import type { Service } from '@/content/services';
import { city } from '@/config/site';
import styles from './ServicePage.module.css';

/**
 * Общий шаблон страницы услуги.
 * Используется тремя страницами: дизайн, ремонт, комплектация.
 * Отличаются они только данными из src/content/services.ts.
 */
export function ServicePage({ service }: { service: Service }) {
  return (
    <>
      <ServicesJsonLd />
      <FaqJsonLd />

      <Breadcrumbs items={[{ name: service.title, href: service.href }]} />

      <PageHero
        eyebrow="Услуга"
        title={`${service.title} ${city.locative}`}
        lead={service.summary}
        actions={
          <>
            <Button href="/#zayavka">
              Рассчитать стоимость <span aria-hidden="true">→</span>
            </Button>
            <span className={styles.price}>
              от <Num size="price">{service.priceFrom}</Num> {service.priceUnit}
            </span>
          </>
        }
      />

      <Section bg="raised">
        <h2 className={styles.subtitle}>Что входит в работу</h2>
        <ul className={styles.list}>
          {service.bullets.map((bullet) => (
            <li key={bullet} className={styles.listItem}>
              {bullet}
            </li>
          ))}
        </ul>
      </Section>

      <Process />
      <LeadForm />
      <Faq />
      <SeoBlock />
    </>
  );
}
