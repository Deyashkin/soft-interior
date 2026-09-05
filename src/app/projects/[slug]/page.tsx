import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Section } from '@/components/layout/Section';
import { ImageSlot } from '@/components/ui/ImageSlot';
import { Num } from '@/components/ui/Num';
import { PageHero } from '@/components/sections/PageHero';
import { LeadForm } from '@/components/sections/LeadForm';
import { projects } from '@/content/projects';
import styles from './page.module.css';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Генерируем статические страницы для всех кейсов на этапе сборки. */
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
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
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) notFound();

  return (
    <>
      <Breadcrumbs
        items={[
          { name: 'Проекты', href: '/projects/' },
          { name: project.title, href: `/projects/${project.slug}/` },
        ]}
      />

      <PageHero eyebrow={project.eyebrow} title={project.title} />

      <Section bg="default" padding="none" flush>
        <div className={styles.media}>
          <ImageSlot
            alt={`${project.title} — главный кадр интерьера`}
            label={`${project.title} — главный кадр`}
            priority
            sizes="100vw"
          />
        </div>
      </Section>

      <Section bg="raised">
        <div className={styles.meta}>
          {project.meta.map((item) => (
            <div key={item.label} className={styles.metaItem}>
              <span className={styles.metaLabel}>{item.label}</span>
              <Num className={styles.metaValue}>{item.value}</Num>
            </div>
          ))}
        </div>

        <p className={styles.text}>{project.summary}</p>
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
