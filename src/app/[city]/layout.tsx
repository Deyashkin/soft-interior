import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PromoPopup } from '@/components/layout/PromoPopup';
import { OrganizationJsonLd } from '@/components/seo/JsonLd';
import { CityProvider } from '@/config/city-context';
import { cityFromParams, type CityParams } from '@/config/city';
import { site } from '@/config/site';

/**
 * Страницы не собираются заранее: каждая рендерится при первом заходе
 * и кэшируется до следующего деплоя или сохранения в админке.
 * Так сборке в CI не нужна база данных.
 */
export function generateStaticParams() {
  return [];
}

/**
 * Страховка: даже если админку закрыли до конца обработки видео, сайт
 * подхватит новые файлы не позже чем через 10 минут.
 */
export const revalidate = 600;

/**
 * Метаданные по умолчанию для всех страниц города.
 * Каждая страница переопределяет title и description своими.
 */
export async function generateMetadata({ params }: { params: CityParams }): Promise<Metadata> {
  const city = await cityFromParams(params);
  return {
    metadataBase: new URL(city.origin),
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
      url: city.origin,
    },
    alternates: {
      canonical: '/',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CityLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: CityParams }>) {
  const city = await cityFromParams(params);

  return (
    <CityProvider cityId={city.id}>
      <OrganizationJsonLd city={city} />
      <Header />
      <main>{children}</main>
      <Footer />
      <PromoPopup />
    </CityProvider>
  );
}
