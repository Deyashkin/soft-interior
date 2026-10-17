import 'server-only';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { rm } from 'node:fs/promises';
import sharp from 'sharp';
import { eq } from 'drizzle-orm';
import { db, schema } from '@/lib/db';
import type { MediaVariants } from '@/lib/db/schema';
import { ensureDirs, originalsDir, publicDir } from './storage';
import { markSiteStale } from '@/lib/revalidate';

/**
 * ОБРАБОТКА ЗАГРУЖЕННЫХ ФАЙЛОВ.
 *
 * Картинка → AVIF и WebP в нескольких ширинах (sharp).
 * Видео → MP4 H.264 1080p и 720p + обложка (ffmpeg).
 *
 * Сервер общий с магазином, поэтому всё идёт по одному файлу за раз,
 * в один поток и с низким приоритетом процесса.
 */

/** Ширины картинок. Больше 2400 px на сайте не нужно даже на Retina. */
const IMAGE_WIDTHS = [640, 1080, 1600, 2400];
/** Высоты видео (по короткой стороне — вертикальные тоже). */
const VIDEO_HEIGHTS = [1080, 720];

sharp.concurrency(1);
sharp.cache(false);

/** Запуск внешней программы с низким приоритетом (nice есть только в Linux). */
function run(cmd: string, args: string[]): Promise<string> {
  const [bin, binArgs] =
    process.platform === 'linux' ? ['nice', ['-n', '19', cmd, ...args]] : [cmd, args];
  return new Promise((resolve, reject) => {
    const child = spawn(bin, binArgs, { stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    let err = '';
    child.stdout.on('data', (d) => (out += d));
    child.stderr.on('data', (d) => (err = (err + d).slice(-4000)));
    child.on('error', reject);
    child.on('close', (code) =>
      code === 0 ? resolve(out) : reject(new Error(`${cmd}: код ${code}\n${err}`)),
    );
  });
}

function pickWidths(sourceWidth: number): number[] {
  const widths = IMAGE_WIDTHS.filter((w) => w < sourceWidth);
  widths.push(Math.min(sourceWidth, IMAGE_WIDTHS[IMAGE_WIDTHS.length - 1]));
  return [...new Set(widths)].sort((a, b) => a - b);
}

/** Сохраняет картинку во всех ширинах и форматах. prefix — для обложек видео. */
async function writeImageVariants(input: string, outDir: string, prefix = '') {
  const meta = await sharp(input).rotate().toBuffer({ resolveWithObject: true });
  const width = meta.info.width;
  const height = meta.info.height;
  const widths = pickWidths(width);

  for (const w of widths) {
    const resized = sharp(meta.data).resize({ width: w, withoutEnlargement: true });
    await resized.clone().avif({ quality: 55, effort: 4 }).toFile(path.join(/*turbopackIgnore: true*/ outDir, `${prefix}${w}.avif`));
    await resized.clone().webp({ quality: 78 }).toFile(path.join(/*turbopackIgnore: true*/ outDir, `${prefix}${w}.webp`));
  }
  return { width, height, widths };
}

async function processImage(id: string, original: string) {
  const outDir = publicDir(id);
  let input = original;

  // HEIC/HEIF с iPhone sharp не читает — сначала переводим в PNG.
  if (/\.(heic|heif)$/i.test(original)) {
    input = path.join(/*turbopackIgnore: true*/ outDir, 'source.png');
    await run('heif-convert', [original, input]);
  }

  try {
    const { width, height, widths } = await writeImageVariants(input, outDir);
    const variants: MediaVariants = { kind: 'image', widths };
    return { width, height, variants };
  } finally {
    if (input !== original) await rm(input, { force: true });
  }
}

interface ProbeStream {
  codec_type: string;
  width?: number;
  height?: number;
  tags?: { rotate?: string };
  side_data_list?: { rotation?: number }[];
}

async function processVideo(id: string, original: string) {
  const outDir = publicDir(id);
  const probe = JSON.parse(
    await run('ffprobe', ['-v', 'error', '-print_format', 'json', '-show_streams', '-show_format', original]),
  ) as { streams: ProbeStream[]; format: { duration?: string } };

  const video = probe.streams.find((s) => s.codec_type === 'video');
  if (!video?.width || !video.height) throw new Error('В файле нет видеодорожки');

  // Телефоны пишут вертикальное видео как горизонтальное + флаг поворота.
  const rotation = Math.abs(
    Number(video.side_data_list?.find((d) => d.rotation !== undefined)?.rotation ?? video.tags?.rotate ?? 0),
  );
  const rotated = rotation === 90 || rotation === 270;
  const w = rotated ? video.height : video.width;
  const h = rotated ? video.width : video.height;
  const shortSide = Math.min(w, h);
  const durationSec = Math.round(Number(probe.format.duration ?? 0));

  let heights = VIDEO_HEIGHTS.filter((target) => target <= shortSide);
  if (heights.length === 0) heights = [shortSide - (shortSide % 2)];

  for (const target of heights) {
    // Масштабируем по короткой стороне, длинная — пропорционально и чётная.
    const scale = w >= h ? `scale=-2:${target}` : `scale=${target}:-2`;
    await run('ffmpeg', [
      '-y', '-i', original,
      '-vf', scale,
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '24',
      '-profile:v', 'high', '-pix_fmt', 'yuv420p',
      '-c:a', 'aac', '-b:a', '128k',
      '-movflags', '+faststart',
      '-threads', '1',
      path.join(/*turbopackIgnore: true*/ outDir, `${target}.mp4`),
    ]);
  }

  // Обложка — кадр на первой секунде (или в середине короткого ролика).
  const posterPng = path.join(/*turbopackIgnore: true*/ outDir, 'poster-source.png');
  const at = Math.min(1, durationSec / 2).toFixed(2);
  await run('ffmpeg', ['-y', '-ss', at, '-i', original, '-frames:v', '1', posterPng]);
  try {
    const poster = await writeImageVariants(posterPng, outDir, 'poster-');
    const variants: MediaVariants = {
      kind: 'video',
      heights,
      posterWidths: poster.widths,
      durationSec,
    };
    return { width: w, height: h, variants };
  } finally {
    await rm(posterPng, { force: true });
  }
}

/** Обрабатывает один файл и записывает результат в базу. */
export async function processMedia(id: string) {
  const row = await db().query.media.findFirst({ where: eq(schema.media.id, id) });
  if (!row || row.status !== 'processing') return;

  await ensureDirs(id);
  const original = path.join(/*turbopackIgnore: true*/ originalsDir(), path.basename(row.originalFile));

  try {
    const result =
      row.kind === 'image' ? await processImage(id, original) : await processVideo(id, original);
    await db()
      .update(schema.media)
      .set({ status: 'ready', error: null, ...result })
      .where(eq(schema.media.id, id));
    markSiteStale();
  } catch (error) {
    console.error(`[media] ${id} (${row.originalName}):`, error);
    await db()
      .update(schema.media)
      .set({ status: 'failed', error: String(error instanceof Error ? error.message : error).slice(0, 2000) })
      .where(eq(schema.media.id, id));
  }
}
