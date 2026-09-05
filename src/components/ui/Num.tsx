import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import styles from './Num.module.css';

type NumSize = 'inherit' | 'price' | 'priceLg' | 'stat' | 'step';

interface NumProps {
  children: ReactNode;
  size?: NumSize;
  className?: string;
}

/**
 * Обёртка для любых чисел: цен, площадей, метражей, сроков, счётчиков.
 *
 * Зачем отдельный компонент: шрифт цифр вынесен в собственную роль
 * --font-numeric (см. tokens.css, раздел 3). Пока она совпадает с
 * заголовочной антиквой, но поменять её можно одной строкой —
 * и заголовки при этом не изменятся.
 *
 * Правило: любое число, которое читается как значение (цена, площадь,
 * процент, год, номер этапа) — оборачиваем в <Num>.
 */
export function Num({ children, size = 'inherit', className }: NumProps) {
  return <span className={cx(styles.num, styles[size], className)}>{children}</span>;
}
