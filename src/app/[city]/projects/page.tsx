import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { PageHero } from '@/components/sections/PageHero';
import { ProjectsCatalog } from '@/components/sections/ProjectsCatalog';
import { LeadForm } from '@/components/sections/LeadForm';
import { SeoBlock } from '@/components/sections/SeoBlock';
import { projectsDelivered } from '@/content/projects';
import { getPublishedProjects } from '@/lib/projects';
import { cityFromParams, type CityParams } from '@/config/city';

export async function generateMetadata({ params }: { params: CityParams }): Promise<Metadata> {
  const city = await cityFromParams(params);
  return {
    title: `Проекты интерьеров ${city.locative} — портфолио студии`,
    description: `Реализованные интерьеры квартир, домов и апартаментов в Москве и Сочи: площадь, сроки, состав работ и фотографии по каждому объекту.`,
    alternates: { canonical: '/projects/' },
  };
}

export default async function ProjectsPage({ params }: { params: CityParams }) {
  const city = await cityFromParams(params);
  const projects = await getPublishedProjects();
  const moscow = projects.filter((project) => project.city === 'Москва').length;
  const sochi = projects.filter((project) => project.city === 'Сочи').length;

  return (
    <>
      <Breadcrumbs city={city} items={[{ name: 'Проекты', href: '/projects/' }]} />

      <PageHero
        eyebrow="Портфолио"
        title="Проекты интерьеров в Москве и Сочи"
        lead={`Всего сдали ${projectsDelivered} объекта, здесь опубликовано ${projects.length}: ${moscow} в Москве и области, ${sochi} в Сочи и на побережье. У каждого — площадь, срок, состав работ и фотографии результата.`}
      />

      <ProjectsCatalog projects={projects} />
      <LeadForm />
      <SeoBlock />
    </>
  );
}
