import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { ImageSlot } from '@/components/ui/ImageSlot';
import { Num } from '@/components/ui/Num';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { projectFilters, projectMeta, type Project } from '@/content/projects';
import { cx } from '@/lib/cx';
import styles from './Portfolio.module.css';

/** Портфолио на главной: развёрнутые кейсы (отмечены «на главной» в админке). */
export function Portfolio({ projects }: { projects: Project[] }) {
  return (
    <Section id="projects" bg="sunken" padding="none" flush>
      <div className={styles.header}>
        <SectionHeader
          eyebrow="Портфолио"
          title={
            <>
              Объекты, сданные
              <br />
              под ключ
            </>
          }
          aside={
            <div className={styles.filters}>
              {projectFilters.map((filter, index) => (
                <span
                  key={filter.label}
                  className={cx(styles.filter, index === 0 && styles.filterActive)}
                >
                  {filter.label}
                </span>
              ))}
            </div>
          }
        />
      </div>

      {projects.map((project, index) => (
        <div key={project.slug}>
          <article className={styles.case}>
            <div className={styles.caseMedia}>
              <ImageSlot
                media={project.cover}
                video="ambient"
                alt={`${project.title} — интерьер после ремонта`}
                label={`${project.title} — главный кадр`}
                sizes="100vw"
              />
            </div>

            <div
              className={cx(
                styles.overlay,
                project.align === 'left' ? styles.overlayLeft : styles.overlayRight,
                project.theme === 'dark' ? styles.overlayDark : styles.overlayLight,
              )}
            >
              <span className={styles.caseEyebrow}>{`Кейс ${String(index + 1).padStart(2, '0')} · ${project.service}`}</span>
              <h3 className={styles.caseTitle}>{project.title}</h3>
              <p className={styles.caseSummary}>{project.summary}</p>

              <div className={styles.meta}>
                {projectMeta(project).map((item) => (
                  <div key={item.label} className={styles.metaItem}>
                    <span className={styles.metaLabel}>{item.label}</span>
                    <span className={styles.metaValue}>
                      <Num>{item.value}</Num>
                    </span>
                  </div>
                ))}
              </div>

              <Button
                href={`/projects/${project.slug}/`}
                variant={project.theme === 'dark' ? 'linkInverse' : 'link'}
                className={styles.caseLink}
              >
                Смотреть кейс <span aria-hidden="true">→</span>
              </Button>
            </div>
          </article>

          {project.gallery.length > 0 && (
            <div className={styles.gallery}>
              {project.gallery.slice(0, 3).map((item) => (
                <div key={item.id} className={styles.galleryItem}>
                  <ImageSlot
                    media={item}
                    alt={`${project.title} — дополнительный кадр`}
                    sizes="(max-width: 640px) 100vw, (max-width: 800px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className={styles.footer}>
        <Button href="/projects/" variant="outline">
          Все проекты <span aria-hidden="true">→</span>
        </Button>
        <span className={styles.footerNote}>
          Фильтры по городу, типу объекта, площади и услуге
        </span>
      </div>
    </Section>
  );
}
