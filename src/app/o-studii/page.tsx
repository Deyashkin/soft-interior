import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { PageHero } from '@/components/sections/PageHero';
import { Advantages } from '@/components/sections/Advantages';
import { Process } from '@/components/sections/Process';
import { Team } from '@/components/sections/Team';
import { Reviews } from '@/components/sections/Reviews';
import { Budget } from '@/components/sections/Budget';
import { LeadForm } from '@/components/sections/LeadForm';
import { SeoBlock } from '@/components/sections/SeoBlock';
import { city, site } from '@/config/site';

export const metadata: Metadata = {
  title: `О студии Soft Interior — команда и подход к работе`,
  description: `Студия полного цикла с ${site.foundedYear} года: 11 человек, собственные бригады в Москве и Сочи, фиксированная смета и гарантия 3 года.`,
  alternates: { canonical: '/o-studii/' },
};

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: 'О студии', href: '/o-studii/' }]} />

      <PageHero
        eyebrow="О студии"
        title={`Студия Soft Interior ${city.locative}`}
        lead={`Проектируем и реализуем интерьеры с ${site.foundedYear} года. Забираем на себя весь путь — от первой планировки до расстановки мебели, — чтобы у объекта был один ответственный подрядчик.`}
      />

      <Advantages />
      <Process />
      <Team />
      <Reviews />
      <Budget />
      <LeadForm />
      <SeoBlock />
    </>
  );
}
