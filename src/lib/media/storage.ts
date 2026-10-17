import 'server-only';
import path from 'node:path';
import { mkdir, rm } from 'node:fs/promises';

/**
 * Где лежат файлы. На сервере — папка, смонтированная в контейнер
 * (Coolify → Persistent Storage), чтобы файлы переживали деплой.
 *
 *   originals/<id>.<ext>   — оригиналы, наружу не отдаются
 *   public/<id>/…          — сжатые версии, отдаёт /media/[...path]
 */
export function mediaRoot(): string {
  return path.resolve(/*turbopackIgnore: true*/ process.env.MEDIA_DIR || 'media-data');
}

export function originalsDir() {
  return path.join(/*turbopackIgnore: true*/ mediaRoot(), 'originals');
}

export function publicDir(id?: string) {
  const dir = path.join(/*turbopackIgnore: true*/ mediaRoot(), 'public');
  return id ? path.join(/*turbopackIgnore: true*/ dir, id) : dir;
}

export async function ensureDirs(id?: string) {
  await mkdir(originalsDir(), { recursive: true });
  await mkdir(publicDir(id), { recursive: true });
}

/** Удаляет оригинал и все сжатые версии файла. */
export async function removeMediaFiles(id: string, originalFile: string) {
  await rm(publicDir(id), { recursive: true, force: true });
  await rm(path.join(/*turbopackIgnore: true*/ originalsDir(), path.basename(originalFile)), { force: true });
}

/** Разрешённые форматы загрузки. */
export const IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/heic': 'heic',
  'image/heif': 'heif',
  'image/tiff': 'tif',
};

export const VIDEO_TYPES: Record<string, string> = {
  'video/mp4': 'mp4',
  'video/quicktime': 'mov',
  'video/webm': 'webm',
  'video/x-matroska': 'mkv',
  'video/x-msvideo': 'avi',
};

export const MAX_IMAGE_BYTES = 80 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 2 * 1024 * 1024 * 1024;
