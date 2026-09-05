import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import { Eyebrow } from './Eyebrow';
import styles from './SectionHeader.module.css';

interface SectionHeaderProps {
  /** Рубрика над заголовком. */
  eyebrow: string;
  /** Заголовок секции (H2). */
  title: ReactNode;
  /** Текст справа от заголовка. */
  text?: string;
  /** Произвольный блок справа — например кнопка или фильтры. */
  aside?: ReactNode;
  /** Уменьшенный размер заголовка. */
  small?: boolean;
  /** Оформление для тёмного фона. */
  inverse?: boolean;
  className?: string;
}

/** Стандартная шапка секции: рубрика + H2 слева, пояснение справа. */
export function SectionHeader({
  eyebrow,
  title,
  text,
  aside,
  small,
  inverse,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cx(styles.header, className)}>
      <div className={styles.left}>
        <Eyebrow inverse={inverse}>{eyebrow}</Eyebrow>
        <h2 className={small ? styles.titleSm : styles.title}>{title}</h2>
      </div>

      {text && (
        <p className={cx(styles.aside, inverse && styles.asideInverse)}>{text}</p>
      )}
      {aside}
    </div>
  );
}
