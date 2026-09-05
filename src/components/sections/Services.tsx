import { Fragment } from 'react';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { ImageSlot } from '@/components/ui/ImageSlot';
import { Num } from '@/components/ui/Num';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { extraServices, services } from '@/content/services';
import styles from './Services.module.css';

/** Блок услуг: три карточки + строка дополнительных услуг. */
export function Services() {
  return (
    <Section id="services" bg="raised">
      <SectionHeader
        eyebrow="Услуги"
        title={
          <>
            Три услуги, которые
            <br />
            работают вместе
          </>
        }
        text="Можно взять любую отдельно. Но когда проект, ремонт и мебель ведёт одна команда, объект сдаётся заметно быстрее — и без спорных мест на стыках."
      />

      <div className={styles.grid}>
        {services.map((service) => (
          <article key={service.slug} className={styles.card}>
            <div className={styles.media}>
              <ImageSlot
                alt={service.imageAlt}
                label={service.title}
                sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 33vw"
              />
            </div>

            <div className={styles.body}>
              <h3 className={styles.title}>{service.title}</h3>
              <p className={styles.summary}>{service.summary}</p>

              <div className={styles.bullets}>
                {service.bullets.map((bullet) => (
                  <span key={bullet}>— {bullet}</span>
                ))}
              </div>

              <div className={styles.price}>
                <span className={styles.priceFrom}>от</span>
                <Num size="price">{service.priceFrom}</Num>
                <span className={styles.priceUnit}>{service.priceUnit}</span>
              </div>

              <Button href={service.href} variant="link" className={styles.more}>
                Подробнее <span aria-hidden="true">→</span>
              </Button>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.extra}>
        <p className={styles.extraText}>
          Отдельно:{' '}
          {extraServices.map((item, index) => (
            <Fragment key={item.title}>
              {index > 0 && ' · '}
              <strong className={styles.extraHighlight}>{item.title}</strong> —{' '}
              {item.price}
            </Fragment>
          ))}
        </p>
        <Button href="/ceny/" variant="link">
          Все услуги и цены <span aria-hidden="true">→</span>
        </Button>
      </div>
    </Section>
  );
}
