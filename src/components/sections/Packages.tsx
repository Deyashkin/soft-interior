import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { Num } from '@/components/ui/Num';
import { SectionHeader } from '@/components/ui/SectionHeader';
import {
  packageGroups,
  packagesBundle,
  packagesNote,
  type PackageGroup,
} from '@/content/packages';
import { cx } from '@/lib/cx';
import styles from './Packages.module.css';

/** Один блок: услуга и три её пакета. */
function PackageGroupSection({
  group,
  index,
}: {
  group: PackageGroup;
  index: number;
}) {
  return (
    <Section
      id={group.slug}
      bg={index % 2 === 0 ? 'default' : 'raised'}
      padding="sm"
    >
      <SectionHeader
        eyebrow={`Услуга ${String(index + 1).padStart(2, '0')}`}
        title={group.service}
        text={group.intro}
        small
      />

      <div className={styles.grid}>
        {group.packages.map((pack) => (
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

      <p className={styles.groupLink}>
        <Button href={group.href} variant="link">
          Подробнее про услугу <span aria-hidden="true">→</span>
        </Button>
      </p>
    </Section>
  );
}

/** Тарифы по всем услугам: три блока по три пакета. */
export function Packages() {
  return (
    <>
      {packageGroups.map((group, index) => (
        <PackageGroupSection key={group.slug} group={group} index={index} />
      ))}

      <Section bg="inverse" padding="sm">
        <div className={styles.bundle}>
          <div className={styles.bundleText}>
            <h2 className={styles.bundleTitle}>{packagesBundle.title}</h2>
            <p className={styles.bundleSummary}>{packagesBundle.text}</p>
            <p className={styles.bundleNote}>{packagesBundle.note}</p>
          </div>

          <div className={styles.bundleAside}>
            <div className={styles.price}>
              <span className={styles.bundleFrom}>от</span>
              <Num size="priceLg">{packagesBundle.priceFrom}</Num>
              <span className={styles.bundleFrom}>{packagesBundle.priceUnit}</span>
            </div>
            <Button href="/#zayavka" variant="light">
              Рассчитать стоимость
            </Button>
          </div>
        </div>

        <p className={styles.bundleFooter}>{packagesNote}</p>
      </Section>
    </>
  );
}
