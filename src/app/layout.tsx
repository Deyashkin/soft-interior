import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { OrganizationJsonLd } from '@/components/seo/JsonLd';
import { fontVariables } from '@/styles/fonts';
import { city, site } from '@/config/site';

/**
 * Метаданные по умолчанию для всех страниц.
 * Каждая страница переопределяет title и description своими —
 * см. экспорт `metadata` в файлах src/app/**\/page.tsx.
 */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `Дизайн, ремонт и комплектация интерьеров ${city.locative} — ${site.name}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: 'website',
    locale: site.locale,
    siteName: site.name,
    url: site.url,
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
};

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
      <body>
        <OrganizationJsonLd />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
