import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Num } from '@/components/ui/Num';
import { HeroSlider } from '@/components/sections/HeroSlider';
import { heroStats } from '@/content/home';
import { site, type City } from '@/config/site';
import styles from './Hero.module.css';

/**
 * Первый экран главной.
 * Здесь единственный H1 страницы — важно для SEO, второго быть не должно.
 * Справа — слайдер кадров (HeroSlider), кадры задаются в src/content/home.ts.
 */
export function Hero({ city }: { city: City }) {
  return (
    <Section bg="default" padding="xs" flush>
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

        {/* Слайдер — клиентский компонент, а сам первый экран с H1 остаётся
            серверным: заголовок и текст приходят в HTML сразу, для поиска. */}
        <div className={styles.media}>
          <HeroSlider />
        </div>
      </div>
    </Section>
  );
}
