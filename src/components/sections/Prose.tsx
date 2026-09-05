import type { ReactNode } from 'react';
import { Section } from '@/components/layout/Section';
import styles from './Prose.module.css';

/** Обёртка для длинного текста с ограниченной шириной строки. */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <Section bg="raised">
      <div className={styles.prose}>{children}</div>
    </Section>
  );
}
