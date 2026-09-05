import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { Num } from '@/components/ui/Num';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { processSteps } from '@/content/home';
import { cx } from '@/lib/cx';
import styles from './Process.module.css';

/** Как мы работаем: пять этапов. */
export function Process() {
  return (
    <Section bg="raised">
      <SectionHeader
        eyebrow="Как мы работаем"
        title={
          <>
            Пять этапов, на каждом
            <br />
            вы знаете, что происходит
          </>
        }
        aside={
          <Button href="/o-studii/" variant="link">
            Подробнее о процессе <span aria-hidden="true">→</span>
          </Button>
        }
      />

      <ol className={styles.grid}>
        {processSteps.map((step, index) => (
          <li
            key={step.number}
            className={cx(styles.step, index === 0 && styles.stepFirst)}
          >
            <Num size="step">{step.number}</Num>
            <h3 className={styles.title}>{step.title}</h3>
            <p className={styles.text}>{step.text}</p>
            <span className={styles.duration}>{step.duration}</span>
          </li>
        ))}
      </ol>
    </Section>
  );
}
