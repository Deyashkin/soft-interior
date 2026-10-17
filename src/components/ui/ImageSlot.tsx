import Image from 'next/image';
import { cx } from '@/lib/cx';
import { imageFallback, imageSrcSet, videoSources, type Media } from '@/lib/media/urls';
import styles from './ImageSlot.module.css';

interface ImageSlotProps {
  /** Файл из админки (фото или видео) — уже сжатый в нескольких размерах. */
  media?: Media | null;
  /** Путь к файлу в /public, например '/images/hero.jpg'. */
  src?: string;
  /** Альтернативный текст — обязателен для SEO и доступности. */
  alt: string;
  /** Подпись на заглушке, пока фото не загружено. */
  label?: string;
  /** Круглая обрезка — для аватаров. */
  circle?: boolean;
  /**
   * Загрузить сразу, без ленивой загрузки. Только для главного кадра
   * первого экрана. (В Next.js 16 свойство next/image называется preload.)
   */
  preload?: boolean;
  /** Подсказка браузеру о ширине картинки в разных вьюпортах. */
  sizes?: string;
  /**
   * Как показывать видео: controls — с кнопками (галерея),
   * ambient — без звука и по кругу, как живое фото (обложки).
   */
  video?: 'controls' | 'ambient';
  className?: string;
}

/**
 * Место под фотографию или видео.
 *
 * Пока файла нет — рисует заглушку с подписью. Файлы из админки
 * выводятся через <picture>: браузер сам берёт AVIF или WebP нужной ширины.
 *
 * Родитель должен задавать размер (height или aspect-ratio) —
 * слот растягивается на 100% родителя.
 */
export function ImageSlot({
  media,
  src,
  alt,
  label,
  circle,
  preload,
  sizes = '100vw',
  video = 'controls',
  className,
}: ImageSlotProps) {
  const text = media?.caption || alt;

  let content;
  if (media?.kind === 'video') {
    const ambient = video === 'ambient';
    const [large, ...smaller] = videoSources(media);
    content = (
      <video
        className={styles.image}
        poster={imageFallback(media)}
        aria-label={text}
        playsInline
        preload={ambient ? 'metadata' : 'none'}
        {...(ambient ? { autoPlay: true, muted: true, loop: true } : { controls: true })}
      >
        {/* Меньшее видео — для телефонов, большее — для остальных. */}
        {smaller.map((file) => (
          <source key={file.src} src={file.src} type="video/mp4" media="(max-width: 900px)" />
        ))}
        {large && <source src={large.src} type="video/mp4" />}
      </video>
    );
  } else if (media) {
    content = (
      <picture>
        <source type="image/avif" srcSet={imageSrcSet(media, 'avif')} sizes={sizes} />
        <source type="image/webp" srcSet={imageSrcSet(media, 'webp')} sizes={sizes} />
        <img
          src={imageFallback(media)}
          alt={text}
          width={media.width ?? undefined}
          height={media.height ?? undefined}
          loading={preload ? 'eager' : 'lazy'}
          fetchPriority={preload ? 'high' : undefined}
          decoding="async"
          className={styles.image}
        />
      </picture>
    );
  } else if (src) {
    content = <Image src={src} alt={alt} fill sizes={sizes} preload={preload} className={styles.image} />;
  } else {
    content = (
      <div className={styles.placeholder} role="img" aria-label={alt}>
        <span className={styles.label}>{label ?? alt}</span>
      </div>
    );
  }

  return <div className={cx(styles.slot, circle && styles.circle, className)}>{content}</div>;
}
