import type { MediaVariants } from '@/lib/db/schema';

/**
 * Адреса обработанных файлов. Модуль общий: им пользуются и серверные
 * страницы, и клиентские компоненты (каталог, админка).
 *
 * Файлы лежат в MEDIA_DIR/public/<id>/… и отдаются маршрутом /media/[...path].
 */

/** Медиафайл в том виде, в каком его получает вёрстка. */
export interface Media {
  id: string;
  kind: 'image' | 'video';
  caption: string;
  width: number | null;
  height: number | null;
  variants: MediaVariants;
}

export type ImageFormat = 'avif' | 'webp';

function srcSet(id: string, prefix: string, widths: number[], format: ImageFormat) {
  return widths.map((w) => `/media/${id}/${prefix}${w}.${format} ${w}w`).join(', ');
}

/** srcset картинки (или обложки видео) в нужном формате. */
export function imageSrcSet(media: Media, format: ImageFormat): string {
  const v = media.variants;
  return v.kind === 'image'
    ? srcSet(media.id, '', v.widths, format)
    : srcSet(media.id, 'poster-', v.posterWidths, format);
}

/** Запасной src — самый крупный WebP. */
export function imageFallback(media: Media): string {
  const v = media.variants;
  const widths = v.kind === 'image' ? v.widths : v.posterWidths;
  const prefix = v.kind === 'image' ? '' : 'poster-';
  return `/media/${media.id}/${prefix}${Math.max(...widths)}.webp`;
}

/** Самая маленькая версия — для превью в админке. */
export function imageThumb(media: Media): string {
  const v = media.variants;
  const widths = v.kind === 'image' ? v.widths : v.posterWidths;
  const prefix = v.kind === 'image' ? '' : 'poster-';
  return `/media/${media.id}/${prefix}${Math.min(...widths)}.webp`;
}

/** Файлы видео от большего к меньшему: <source> выбирается по ширине экрана. */
export function videoSources(media: Media): { src: string; height: number }[] {
  const v = media.variants;
  if (v.kind !== 'video') return [];
  return [...v.heights]
    .sort((a, b) => b - a)
    .map((height) => ({ src: `/media/${media.id}/${height}.mp4`, height }));
}
