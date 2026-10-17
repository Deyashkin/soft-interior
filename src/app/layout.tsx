import type { Viewport } from 'next';
import './globals.css';
import { fontVariables } from '@/styles/fonts';

/**
 * Общий каркас для сайта и админки: <html>, шрифты, базовые стили.
 * Шапка, подвал и метаданные города — в src/app/[city]/layout.tsx.
 */
export const viewport: Viewport = {
  themeColor: '#f4efe8',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
