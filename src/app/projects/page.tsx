import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Section } from '@/components/layout/Section';
import { ImageSlot } from '@/components/ui/ImageSlot';
import { Num } from '@/components/ui/Num';
import { PageHero } from '@/components/sections/PageHero';
import { LeadForm } from '@/components/sections/LeadForm';
import { SeoBlock } from '@/components/sections/SeoBlock';
import { projects, projectsTotal } from '@/content/projects';
import { city } from '@/config/site';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: `Проекты интерьеров ${city.locative} — портфолио студии`,
  description: `Реализованные интерьеры квартир, домов и апартаментов ${city.locative}: планировки, фотографии до и после, сроки и площади объектов.`,
  alternates: { canonical: '/projects/' },
};

export default function ProjectsPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: 'Проекты', href: '/projects/' }]} />

      <PageHero
        eyebrow="Портфолио"
        title={`Проекты интерьеров ${city.locative}`}
        lead={`Сдали ${projectsTotal} объекта: квартиры, дома и апартаменты в Москве и Сочи. У каждого кейса — площадь, срок, состав работ и фотографии результата.`}
      />

      <Section bg="raised">
        <div className={styles.grid}>
          {projects.map((project) => (
            <article key={project.slug} className={styles.card}>
              <Link href={`/projects/${project.slug}/`} className={styles.media}>
                <ImageSlot
                  alt={`${project.title} — интерьер после ремонта`}
                  label={project.title}
                  sizes="(max-width: 800px) 100vw, 50vw"
                />
              </Link>

              <h2 className={styles.title}>
                <Link href={`/projects/${project.slug}/`}>{project.title}</Link>
              </h2>

              <div className={styles.meta}>
                {project.meta.map((item) => (
                  <span key={item.label}>
                    {item.label}: <Num>{item.value}</Num>
                  </span>
                ))}
              </div>

              <p className={styles.summary}>{project.summary}</p>
            </article>
          ))}
        </div>
      </Section>

      <LeadForm />
      <SeoBlock />
    </>
  );
}
