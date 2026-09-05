import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import styles from './Eyebrow.module.css';

interface EyebrowProps {
  children: ReactNode;
  /** Осветлённый акцент для тёмного фона. */
  inverse?: boolean;
  /** Нейтральный серый вместо акцентного. */
  muted?: boolean;
  className?: string;
}

/** Мелкая рубрика в разрядку над заголовком секции. */
export function Eyebrow({ children, inverse, muted, className }: EyebrowProps) {
  return (
    <span
      className={cx(
        styles.eyebrow,
        inverse && styles.inverse,
        muted && styles.muted,
        className,
      )}
    >
      {children}
    </span>
  );
}
