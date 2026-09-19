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
  /** Есть и у ссылок: например, закрыть попап при переходе к форме. */
  onClick?: () => void;
}

interface LinkProps extends BaseProps {
  href: string;
  /** Ссылка на другой сайт: открывается в новой вкладке. */
  external?: boolean;
  type?: never;
}

interface NativeButtonProps extends BaseProps {
  href?: never;
  type?: 'button' | 'submit';
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
    onClick,
  } = props;

  // Текстовые ссылки не используют размеры и рамки кнопок.
  const isTextLink = variant === 'link' || variant === 'linkInverse';

  const classes = cx(
    isTextLink ? styles[variant] : cx(styles.base, styles[variant], sizeClass[size]),
    fullWidth && styles.fullWidth,
    className,
  );

  if ('href' in props && props.href) {
    if (props.external) {
      return (
        <a
          href={props.href}
          className={classes}
          onClick={onClick}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={props.href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  const { type = 'button' } = props as NativeButtonProps;

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
