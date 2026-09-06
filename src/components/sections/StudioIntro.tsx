import { Section } from '@/components/layout/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ImageSlot } from '@/components/ui/ImageSlot';
import { Num } from '@/components/ui/Num';
import { studioIntro } from '@/content/about';
import styles from './StudioIntro.module.css';

/** Рассказ о студии: фотография и текст. Страница «О студии». */
export function StudioIntro() {
  return (
    <Section bg="raised" flush>
      <div className={styles.layout}>
        <div className={styles.media}>
          <ImageSlot
            alt={studioIntro.imageAlt}
            label={studioIntro.imageLabel}
            sizes="(max-width: 1000px) 100vw, 50vw"
          />
        </div>

        <div className={styles.content}>
          <Eyebrow>{studioIntro.eyebrow}</Eyebrow>
          <h2 className={styles.title}>{studioIntro.title}</h2>

          <div className={styles.text}>
            {studioIntro.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className={styles.facts}>
            {studioIntro.facts.map((fact) => (
              <div key={fact.label} className={styles.fact}>
                <Num className={styles.factValue}>{fact.value}</Num>
                <span className={styles.factLabel}>{fact.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
