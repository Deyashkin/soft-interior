import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Section } from '@/components/layout/Section';
import { PageHero } from '@/components/sections/PageHero';
import { ContactMap } from '@/components/sections/ContactMap';
import { cities, site } from '@/config/site';
import { cityFromParams, type CityParams } from '@/config/city';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Контакты студии Soft Interior — Москва и Сочи',
  description:
    'Адреса, телефоны и почта студии Soft Interior в Москве и Сочи. Выезд дизайнера на объект бесплатный, работаем с 10:00 до 20:00.',
  alternates: { canonical: '/kontakty/' },
};

export default async function ContactsPage({ params }: { params: CityParams }) {
  const city = await cityFromParams(params);
  return (
    <>
      <Breadcrumbs city={city} items={[{ name: 'Контакты', href: '/kontakty/' }]} />

      <PageHero
        eyebrow="Контакты"
        title="Как с нами связаться"
        lead={`Работаем ${site.workingHours} без выходных. Выезд дизайнера на объект в Москве и Сочи — бесплатный.`}
      />

      <Section bg="raised">
        <div className={styles.grid}>
          {Object.values(cities).map((item) => (
            <div key={item.id} className={styles.card}>
              <span className={styles.region}>{item.region}</span>
              <h2 className={styles.cityName}>{item.name}</h2>
              <a href={`tel:${item.phoneHref}`} className={styles.phone}>
                {item.phone}
              </a>
              <span className={styles.address}>{item.address}</span>
              {item.id === city.id ? (
                <span className={styles.current}>Текущий город</span>
              ) : (
                <a href={item.origin} className={styles.current}>
                  Перейти на сайт города →
                </a>
              )}
            </div>
          ))}
        </div>
      </Section>

      <ContactMap />
    </>
  );
}
