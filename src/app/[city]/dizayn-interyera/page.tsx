import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ServicePage } from '@/components/pages/ServicePage';
import { services } from '@/content/services';
import { cityFromParams, type CityParams } from '@/config/city';

const service = services.find((item) => item.slug === 'dizayn-interyera');

export async function generateMetadata({ params }: { params: CityParams }): Promise<Metadata> {
  const city = await cityFromParams(params);
  return {
    title: `Дизайн интерьера ${city.locative} — цены на дизайн-проект`,
    description: `Дизайн-проект квартиры и дома ${city.locative} от 3 500 ₽/м²: планировки, визуализации, полный комплект чертежей. Срок 6–8 недель.`,
    alternates: { canonical: '/dizayn-interyera/' },
  };
}

export default async function DesignPage({ params }: { params: CityParams }) {
  const city = await cityFromParams(params);
  if (!service) notFound();
  return <ServicePage service={service} city={city} />;
}
