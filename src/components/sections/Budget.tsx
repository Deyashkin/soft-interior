import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ImageSlot } from '@/components/ui/ImageSlot';
import { Num } from '@/components/ui/Num';
import { budgetRows, budgetStats } from '@/content/home';
import styles from './Budget.module.css';

/** Прозрачная смета: из чего складывается стоимость. */
export function Budget() {
  return (
    <Section bg="default" padding="none" flush>
      <div className={styles.layout}>
        <div className={styles.content}>
          <Eyebrow>Смета прозрачно</Eyebrow>
          <h2 className={styles.title}>Видно, за что вы платите</h2>
          <p className={styles.text}>
            Смета — таблица на 200–400 строк: работы, материалы, объёмы, цены.
            Вы получаете к ней доступ и видите каждое списание. Пример реальной
            сметы отправим до подписания договора.
          </p>

          <div className={styles.table}>
            {budgetRows.map((row) => (
              <div key={row.label} className={styles.row}>
                <span>{row.label}</span>
                <span className={styles.rowNote}>{row.note}</span>
              </div>
            ))}
          </div>

          <div className={styles.stats}>
            {budgetStats.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <Num className={styles.statValue}>{stat.value}</Num>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>

          <Button href="/#zayavka" className={styles.action}>
            Получить пример сметы
          </Button>
        </div>

        <div className={styles.media}>
          <ImageSlot
            alt="Объект в работе и проектная документация"
            label="Объект в работе / документы"
            sizes="(max-width: 1000px) 100vw, 50vw"
          />
        </div>
      </div>
    </Section>
  );
}
