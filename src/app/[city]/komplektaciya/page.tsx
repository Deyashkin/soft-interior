import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ServicePage } from '@/components/pages/ServicePage';
import { services } from '@/content/services';
import { cityFromParams, type CityParams } from '@/config/city';

const service = services.find((item) => item.slug === 'komplektaciya');

export async function generateMetadata({ params }: { params: CityParams }): Promise<Metadata> {
  const city = await cityFromParams(params);
  return {
    title: `Комплектация интерьера ${city.locative} — мебель, свет, декор`,
    description: `Комплектация квартиры ${city.locative} от 1 200 ₽/м²: подбор, закупка, логистика и сборка мебели. Партнёрские скидки переходят вам, наценки студии нет.`,
    alternates: { canonical: '/komplektaciya/' },
  };
}

export default async function FurnishingPage({ params }: { params: CityParams }) {
  const city = await cityFromParams(params);
  if (!service) notFound();
  return <ServicePage service={service} city={city} />;
}
