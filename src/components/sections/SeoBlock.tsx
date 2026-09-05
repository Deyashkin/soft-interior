import Link from 'next/link';
import { Section } from '@/components/layout/Section';
import { seoLinks, seoText } from '@/content/home';
import styles from './SeoBlock.module.css';

/**
 * Текстовый блок внизу страницы.
 * Даёт поисковику связный текст с гео-упоминаниями и раздаёт вес
 * на внутренние страницы услуг.
 */
export function SeoBlock() {
  return (
    <Section
      bg="raised"
      padding="xs"
      className={styles.section}
      innerClassName={styles.block}
    >
      <h2 className={styles.title}>Работаем в Москве и Сочи</h2>
      <p className={styles.text}>{seoText}</p>
      <div className={styles.links}>
        {seoLinks.map((link) => (
          <Link key={link.label} href={link.href} className={styles.link}>
            {link.label}
          </Link>
        ))}
      </div>
    </Section>
  );
}
