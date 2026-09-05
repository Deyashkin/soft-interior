import Image from 'next/image';
import { cx } from '@/lib/cx';
import styles from './ImageSlot.module.css';

interface ImageSlotProps {
  /** Путь к файлу в /public, например '/images/hero.jpg'. */
  src?: string;
  /** Альтернативный текст — обязателен для SEO и доступности. */
  alt: string;
  /** Подпись на заглушке, пока фото не загружено. */
  label?: string;
  /** Круглая обрезка — для аватаров. */
  circle?: boolean;
  /** Грузить сразу, без ленивой загрузки. Ставить только для первого экрана. */
  priority?: boolean;
  /** Подсказка браузеру о ширине картинки в разных вьюпортах. */
  sizes?: string;
  className?: string;
}

/**
 * Место под фотографию.
 *
 * Пока src не передан — рисует заглушку с подписью. Как только появятся
 * реальные снимки, положите их в /public/images/ и добавьте src —
 * дальше всё делает next/image: WebP/AVIF, ресайз, ленивая загрузка.
 *
 * Родитель должен задавать размер (height или aspect-ratio) —
 * слот растягивается на 100% родителя.
 */
export function ImageSlot({
  src,
  alt,
  label,
  circle,
  priority,
  sizes = '100vw',
  className,
}: ImageSlotProps) {
  return (
    <div className={cx(styles.slot, circle && styles.circle, className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={styles.image}
        />
      ) : (
        <div className={styles.placeholder} role="img" aria-label={alt}>
          <span className={styles.label}>{label ?? alt}</span>
        </div>
      )}
    </div>
  );
}
