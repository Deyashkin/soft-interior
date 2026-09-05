import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ServicePage } from '@/components/pages/ServicePage';
import { services } from '@/content/services';
import { city } from '@/config/site';

const service = services.find((item) => item.slug === 'komplektaciya');

export const metadata: Metadata = {
  title: `Комплектация интерьера ${city.locative} — мебель, свет, декор`,
  description: `Комплектация квартиры ${city.locative} от 1 200 ₽/м²: подбор, закупка, логистика и сборка мебели. Партнёрские скидки переходят вам, наценки студии нет.`,
  alternates: { canonical: '/komplektaciya/' },
};

export default function FurnishingPage() {
  if (!service) notFound();
  return <ServicePage service={service} />;
}
