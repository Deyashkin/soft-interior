import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ImageSlot } from '@/components/ui/ImageSlot';
import { Num } from '@/components/ui/Num';
import { heroStats } from '@/content/home';
import { city, site } from '@/config/site';
import styles from './Hero.module.css';

/**
 * Первый экран главной.
 * Здесь единственный H1 страницы — важно для SEO, второго быть не должно.
 */
export function Hero() {
  return (
    <Section bg="default" padding="none" flush>
      <div className={styles.hero}>
        <div className={styles.content}>
          <Eyebrow>Студия полного цикла · с {site.foundedYear} года</Eyebrow>

          <h1 className={styles.title}>
            Дизайн, ремонт
            <br />и комплектация
            <br />
            интерьеров {city.locative}
          </h1>

          <p className={styles.lead}>
            Забираем весь путь на себя: проект, стройку и мебель — в одном договоре,
            с фиксированной сметой и понятными сроками. Работаем в Москве и Сочи.
          </p>

          <div className={styles.actions}>
            <Button href="/#zayavka">
              Рассчитать стоимость <span aria-hidden="true">→</span>
            </Button>
            <Button href="/projects/" variant="link">
              Смотреть проекты
            </Button>
          </div>

          <div className={styles.stats}>
            {heroStats.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <Num size="stat">{stat.value}</Num>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.media}>
          <ImageSlot
            alt="Интерьер гостиной, реализованный студией Soft Interior"
            label="Гостиная — главный кадр 1200×1400"
            priority
            sizes="(max-width: 1100px) 100vw, 55vw"
          />
          <span className={styles.caption}>Проект · Ремонт · Комплектация</span>
        </div>
      </div>
    </Section>
  );
}
