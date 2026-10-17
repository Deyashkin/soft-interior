import type { Metadata } from 'next';

/** Админка не должна попадать в поиск. */
export const metadata: Metadata = {
  title: 'Админка — Soft Interior',
  robots: { index: false, follow: false },
};

/** Все страницы админки зависят от входа — не кэшируем их. */
export const dynamic = 'force-dynamic';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
