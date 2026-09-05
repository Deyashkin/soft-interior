import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { Num } from '@/components/ui/Num';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { packages, packagesNote } from '@/content/packages';
import { cx } from '@/lib/cx';
import styles from './Packages.module.css';

/** Тарифные пакеты. */
export function Packages() {
  return (
    <Section bg="default">
      <SectionHeader
        eyebrow="Цены"
        title={
          <>
            Три пакета — от проекта
            <br />
            до готового дома
          </>
        }
        text="Цены указаны за квадратный метр объекта. Точная смета — после обмеров, обычно в пределах ±7% от расчёта."
      />

      <div className={styles.grid}>
        {packages.map((pack) => (
          <article
            key={pack.number}
            className={cx(styles.card, pack.featured && styles.cardFeatured)}
          >
            <span className={styles.number}>
              {pack.number}
              {pack.badge && <span className={styles.badge}>{pack.badge}</span>}
            </span>

            <h3 className={styles.title}>{pack.title}</h3>

            <div className={styles.price}>
              <span className={styles.priceFrom}>от</span>
              <Num size="priceLg">{pack.priceFrom}</Num>
              <span className={styles.priceUnit}>{pack.priceUnit}</span>
            </div>

            <div className={styles.features}>
              {pack.features.map((feature) => (
                <span
                  key={feature.label}
                  className={feature.included === false ? styles.excluded : undefined}
                >
                  {feature.label}
                </span>
              ))}
            </div>

            <span className={styles.duration}>{pack.duration}</span>

            <Button
              href="/#zayavka"
              variant={pack.featured ? 'light' : 'outline'}
              fullWidth
              className={styles.action}
            >
              Выбрать
            </Button>
          </article>
        ))}
      </div>

      <p className={styles.note}>{packagesNote}</p>
    </Section>
  );
}
