import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ServicePage } from '@/components/pages/ServicePage';
import { services } from '@/content/services';
import { city } from '@/config/site';

const service = services.find((item) => item.slug === 'remont');

export const metadata: Metadata = {
  title: `Ремонт квартир под ключ ${city.locative} — цены и сроки`,
  description: `Ремонт под ключ ${city.locative} от 28 000 ₽/м²: своя бригада, прораб на объекте, смета по позициям, еженедельный фотоотчёт. Гарантия 3 года.`,
  alternates: { canonical: '/remont/' },
};

export default function RenovationPage() {
  if (!service) notFound();
  return <ServicePage service={service} />;
}
