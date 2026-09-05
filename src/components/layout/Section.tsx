import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import styles from './Section.module.css';

type Background = 'default' | 'raised' | 'sunken' | 'accent' | 'inverse' | 'none';
type Padding = 'default' | 'sm' | 'xs' | 'none';

interface SectionProps {
  children: ReactNode;
  /** Фон секции. Растягивается на всю ширину экрана. */
  bg?: Background;
  /** Вертикальные отступы. */
  padding?: Padding;
  /** true — убрать боковые поля контейнера (сетки встык). */
  flush?: boolean;
  id?: string;
  className?: string;
  /** Класс для внутреннего контейнера. */
  innerClassName?: string;
  as?: 'section' | 'div' | 'header' | 'footer' | 'article';
}

const bgClass: Record<Background, string> = {
  default: styles.bgDefault,
  raised: styles.bgRaised,
  sunken: styles.bgSunken,
  accent: styles.bgAccent,
  inverse: styles.bgInverse,
  none: styles.bgNone,
};

const padClass: Record<Padding, string> = {
  default: styles.padDefault,
  sm: styles.padSm,
  xs: styles.padXs,
  none: styles.padNone,
};

/**
 * Обёртка секции страницы.
 *
 * Фон — во всю ширину окна, контент — в центрированном контейнере
 * шириной не больше --container-max (см. tokens.css, раздел 7).
 */
export function Section({
  children,
  bg = 'default',
  padding = 'default',
  flush = false,
  id,
  className,
  innerClassName,
  as: Tag = 'section',
}: SectionProps) {
  return (
    <Tag id={id} className={cx(styles.section, bgClass[bg], className)}>
      <div
        className={cx(
          styles.inner,
          padClass[padding],
          flush && styles.flush,
          innerClassName,
        )}
      >
        {children}
      </div>
    </Tag>
  );
}
