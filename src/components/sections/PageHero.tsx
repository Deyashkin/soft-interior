import type { ReactNode } from 'react';
import { Section } from '@/components/layout/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import styles from './PageHero.module.css';

interface PageHeroProps {
  eyebrow: string;
  /** Единственный H1 страницы. */
  title: string;
  lead?: string;
  /** Кнопки под лидом. */
  actions?: ReactNode;
}

/** Стандартная шапка внутренней страницы. */
export function PageHero({ eyebrow, title, lead, actions }: PageHeroProps) {
  return (
    <Section bg="default" padding="sm">
      <div className={styles.hero}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className={styles.title}>{title}</h1>
        {lead && <p className={styles.lead}>{lead}</p>}
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </Section>
  );
}
