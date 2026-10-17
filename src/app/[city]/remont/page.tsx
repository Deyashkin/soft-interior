import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ServicePage } from '@/components/pages/ServicePage';
import { services } from '@/content/services';
import { cityFromParams, type CityParams } from '@/config/city';

const service = services.find((item) => item.slug === 'remont');

export async function generateMetadata({ params }: { params: CityParams }): Promise<Metadata> {
  const city = await cityFromParams(params);
  return {
    title: `Ремонт квартир под ключ ${city.locative} — цены и сроки`,
    description: `Ремонт под ключ ${city.locative} от 28 000 ₽/м²: своя бригада, прораб на объекте, смета по позициям, еженедельный фотоотчёт. Гарантия 3 года.`,
    alternates: { canonical: '/remont/' },
  };
}

export default async function RenovationPage({ params }: { params: CityParams }) {
  const city = await cityFromParams(params);
  if (!service) notFound();
  return <ServicePage service={service} city={city} />;
}
