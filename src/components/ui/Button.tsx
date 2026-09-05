import type { ReactNode } from 'react';
import Link from 'next/link';
import { cx } from '@/lib/cx';
import styles from './Button.module.css';

export type ButtonVariant =
  | 'solid'
  | 'outline'
  | 'light'
  | 'outlineInverse'
  | 'link'
  | 'linkInverse';

type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

interface LinkProps extends BaseProps {
  href: string;
  type?: never;
}

interface NativeButtonProps extends BaseProps {
  href?: never;
  type?: 'button' | 'submit';
  onClick?: () => void;
}

type Props = LinkProps | NativeButtonProps;

const sizeClass: Record<ButtonSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
};

/**
 * Кнопка или ссылка-действие.
 * Есть href → рендерится next/link, нет → обычный <button>.
 *
 * Варианты оформления описаны в Button.module.css.
 */
export function Button(props: Props) {
  const {
    children,
    variant = 'solid',
    size = 'md',
    fullWidth,
    className,
  } = props;

  // Текстовые ссылки не используют размеры и рамки кнопок.
  const isTextLink = variant === 'link' || variant === 'linkInverse';

  const classes = cx(
    isTextLink ? styles[variant] : cx(styles.base, styles[variant], sizeClass[size]),
    fullWidth && styles.fullWidth,
    className,
  );

  if ('href' in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const { type = 'button', onClick } = props as NativeButtonProps;

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
