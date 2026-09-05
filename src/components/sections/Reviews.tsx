import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { reviews, reviewsRating } from '@/content/reviews';
import styles from './Reviews.module.css';

/** Отзывы клиентов после сдачи объекта. */
export function Reviews() {
  return (
    <Section bg="inverse">
      <SectionHeader
        eyebrow="Отзывы"
        inverse
        title={
          <>
            Что говорят клиенты
            <br />
            после сдачи
          </>
        }
        aside={
          <div className={styles.rating}>
            <span>
              {reviewsRating.score} на {reviewsRating.source} · {reviewsRating.count}{' '}
              отзывов
            </span>
            <Button href="/o-studii/" variant="linkInverse">
              Все отзывы <span aria-hidden="true">→</span>
            </Button>
          </div>
        }
      />

      <div className={styles.grid}>
        {reviews.map((review) => (
          <figure key={review.author} className={styles.card}>
            <span className={styles.quote} aria-hidden="true">
              “
            </span>
            <blockquote className={styles.text}>{review.text}</blockquote>
            <figcaption className={styles.author}>
              <span className={styles.authorName}>{review.author}</span>
              <span className={styles.authorObject}>{review.object}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
