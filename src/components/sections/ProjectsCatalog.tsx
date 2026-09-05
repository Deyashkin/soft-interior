'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Section } from '@/components/layout/Section';
import { ImageSlot } from '@/components/ui/ImageSlot';
import { Num } from '@/components/ui/Num';
import { projectFilters, projectMeta, projects } from '@/content/projects';
import { cx } from '@/lib/cx';
import styles from './ProjectsCatalog.module.css';

/** Склонение слова «проект» под число. */
function projectsWord(count: number) {
  const tens = count % 100;
  const ones = count % 10;
  if (tens > 10 && tens < 20) return 'проектов';
  if (ones === 1) return 'проект';
  if (ones >= 2 && ones <= 4) return 'проекта';
  return 'проектов';
}

/**
 * Каталог проектов с фильтрами по городу и типу объекта.
 *
 * Фильтр хранится в состоянии компонента: список небольшой и грузится
 * целиком, поэтому обходимся без запросов на сервер.
 */
export function ProjectsCatalog() {
  const [active, setActive] = useState(0);

  const visible = useMemo(() => {
    const filter = projectFilters[active];
    return projects.filter((project) => !filter.type || project.type === filter.type);
  }, [active]);

  return (
    <Section bg="raised">
      <div className={styles.filters}>
        {projectFilters.map((filter, index) => (
          <button
            key={filter.label}
            type="button"
            className={cx(styles.filter, index === active && styles.filterActive)}
            aria-pressed={index === active}
            onClick={() => setActive(index)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <p className={styles.count} aria-live="polite">
        {visible.length} {projectsWord(visible.length)}
      </p>

      {visible.length === 0 ? (
        <p className={styles.empty}>
          По этому фильтру проектов пока нет — попробуйте другой.
        </p>
      ) : (
        <div className={styles.grid}>
          {visible.map((project) => (
            <article key={project.slug} className={styles.card}>
              <Link href={`/projects/${project.slug}/`} className={styles.media}>
                <ImageSlot
                  alt={`${project.title} — интерьер после ремонта`}
                  label={project.title}
                  sizes="(max-width: 900px) 100vw, 50vw"
                />
              </Link>

              <span className={styles.service}>{project.service}</span>

              <h2 className={styles.title}>
                <Link href={`/projects/${project.slug}/`}>{project.title}</Link>
              </h2>

              <p className={styles.summary}>{project.summary}</p>

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
            </article>
          ))}
        </div>
      )}
    </Section>
  );
}
