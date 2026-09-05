import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { PageHero } from '@/components/sections/PageHero';
import { Packages } from '@/components/sections/Packages';
import { Services } from '@/components/sections/Services';
import { Budget } from '@/components/sections/Budget';
import { Faq } from '@/components/sections/Faq';
import { LeadForm } from '@/components/sections/LeadForm';
import { SeoBlock } from '@/components/sections/SeoBlock';
import { FaqJsonLd, ServicesJsonLd } from '@/components/seo/JsonLd';
import { city } from '@/config/site';

export const metadata: Metadata = {
  title: `Цены на дизайн, ремонт и комплектацию ${city.locative}`,
  description: `Стоимость работ ${city.locative}: дизайн-проект от 3 500 ₽/м², ремонт под ключ от 28 000 ₽/м², полный цикл от 32 700 ₽/м². Смета фиксируется договором.`,
  alternates: { canonical: '/ceny/' },
};

export default function PricesPage() {
  return (
    <>
      <ServicesJsonLd />
      <FaqJsonLd />

      <Breadcrumbs items={[{ name: 'Цены', href: '/ceny/' }]} />

      <PageHero
        eyebrow="Цены"
        title={`Цены на дизайн, ремонт и комплектацию ${city.locative}`}
        lead="Стоимость считается за квадратный метр объекта. Точная смета — после обмеров, обычно в пределах ±7% от предварительного расчёта."
      />

      <Packages />
      <Services />
      <Budget />
      <LeadForm />
      <Faq />
      <SeoBlock />
    </>
  );
}
