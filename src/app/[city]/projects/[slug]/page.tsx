import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cityFromParams } from '@/config/city';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Section } from '@/components/layout/Section';
import { ImageSlot } from '@/components/ui/ImageSlot';
import { Num } from '@/components/ui/Num';
import { PageHero } from '@/components/sections/PageHero';
import { LeadForm } from '@/components/sections/LeadForm';
import { projectMeta, projects } from '@/content/projects';
import styles from './page.module.css';

interface PageProps {
  params: Promise<{ city: string; slug: string }>;
}

/** Страница рендерится при первом заходе и дальше отдаётся из кэша. */
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) return {};

  return {
    title: `${project.title} — кейс студии Soft Interior`,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}/` },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const city = await cityFromParams(params);
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) notFound();

  return (
    <>
      <Breadcrumbs
        city={city}
        items={[
          { name: 'Проекты', href: '/projects/' },
          { name: project.title, href: `/projects/${project.slug}/` },
        ]}
      />

      <PageHero
        eyebrow={`${project.city} · ${project.service}`}
        title={project.title}
        lead={project.summary}
      />

      <Section bg="default" padding="none" flush>
        <div className={styles.media}>
          <ImageSlot
            alt={`${project.title} — главный кадр интерьера`}
            label={`${project.title} — главный кадр`}
            preload
            sizes="100vw"
          />
        </div>
      </Section>

      <Section bg="raised">
        <div className={styles.meta}>
          {projectMeta(project).map((item) => (
            <div key={item.label} className={styles.metaItem}>
              <span className={styles.metaLabel}>{item.label}</span>
              <Num className={styles.metaValue}>{item.value}</Num>
            </div>
          ))}
        </div>
      </Section>

      {project.gallery.length > 0 && (
        <Section bg="default" padding="none" flush>
          <div className={styles.gallery}>
            {project.gallery.map((label) => (
              <div key={label} className={styles.galleryItem}>
                <ImageSlot
                  alt={`${project.title} — дополнительный кадр`}
                  label={label}
                  sizes="(max-width: 900px) 100vw, 33vw"
                />
              </div>
            ))}
          </div>
        </Section>
      )}

      <LeadForm />
    </>
  );
}
