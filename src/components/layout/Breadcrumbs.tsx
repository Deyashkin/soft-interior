import { Fragment } from 'react';
import Link from 'next/link';
import { Section } from './Section';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import styles from './Breadcrumbs.module.css';

export interface Crumb {
  name: string;
  href: string;
}

/**
 * Хлебные крошки + микроразметка BreadcrumbList.
 * Последний элемент — текущая страница, ссылкой не оформляется.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail = [{ name: 'Главная', href: '/' }, ...items];

  return (
    <>
      <BreadcrumbJsonLd items={trail} />
      <Section bg="default" padding="none">
        <nav className={styles.nav} aria-label="Хлебные крошки">
          {trail.map((crumb, index) => {
            const isLast = index === trail.length - 1;

            return (
              <Fragment key={crumb.href}>
                {index > 0 && (
                  <span className={styles.separator} aria-hidden="true">
                    /
                  </span>
                )}
                {isLast ? (
                  <span className={styles.current} aria-current="page">
                    {crumb.name}
                  </span>
                ) : (
                  <Link href={crumb.href} className={styles.link}>
                    {crumb.name}
                  </Link>
                )}
              </Fragment>
            );
          })}
        </nav>
      </Section>
    </>
  );
}
