import type { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { Advantages } from '@/components/sections/Advantages';
import { Services } from '@/components/sections/Services';
import { Packages } from '@/components/sections/Packages';
import { Portfolio } from '@/components/sections/Portfolio';
import { Process } from '@/components/sections/Process';
import { Budget } from '@/components/sections/Budget';
import { Team } from '@/components/sections/Team';
import { Reviews } from '@/components/sections/Reviews';
import { LeadForm } from '@/components/sections/LeadForm';
import { Faq } from '@/components/sections/Faq';
import { SeoBlock } from '@/components/sections/SeoBlock';
import { FaqJsonLd, ServicesJsonLd } from '@/components/seo/JsonLd';
import { city } from '@/config/site';

export const metadata: Metadata = {
  title: `Дизайн, ремонт и комплектация интерьеров ${city.locative} — Soft Interior`,
  description: `Студия полного цикла ${city.locative}: дизайн-проект, ремонт под ключ и комплектация в одном договоре. Фиксированная смета, сроки в договоре, гарантия 3 года.`,
  alternates: { canonical: '/' },
};

/**
 * Главная страница.
 *
 * Порядок секций = порядок блоков на экране. Чтобы переставить блоки местами
 * или убрать один — правьте только этот список.
 */
export default function HomePage() {
  return (
    <>
      <ServicesJsonLd />
      <FaqJsonLd />

      <Hero />
      <Advantages />
      <Services />
      <Packages />
      <Portfolio />
      <Process />
      <Budget />
      <Team />
      <Reviews />
      <LeadForm />
      <Faq />
      <SeoBlock />
    </>
  );
}
