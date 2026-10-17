import path from 'node:path';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { Readable } from 'node:stream';
import { publicDir } from '@/lib/media/storage';

/**
 * Раздача сжатых файлов: /media/<id>/<файл>.
 *
 * Имена файлов неизменны (новая загрузка — новый id), поэтому браузер
 * кэширует их навсегда. Для видео поддерживаются запросы диапазона (Range):
 * без них не работает перемотка, а Safari не проигрывает ролик вовсе.
 */

const TYPES: Record<string, string> = {
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
};

const SAFE_ID = /^[0-9a-f-]{36}$/;
const SAFE_FILE = /^[a-z0-9-]+\.(avif|webp|mp4)$/;

export async function GET(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const parts = (await params).path;
  if (parts.length !== 2 || !SAFE_ID.test(parts[0]) || !SAFE_FILE.test(parts[1])) {
    return new Response('Not found', { status: 404 });
  }

  const file = path.join(/*turbopackIgnore: true*/ publicDir(parts[0]), parts[1]);
  let size: number;
  try {
    size = (await stat(file)).size;
  } catch {
    return new Response('Not found', { status: 404 });
  }

  const headers: Record<string, string> = {
    'Content-Type': TYPES[path.extname(file)],
    'Cache-Control': 'public, max-age=31536000, immutable',
    'Accept-Ranges': 'bytes',
  };

  const range = request.headers.get('range')?.match(/^bytes=(\d*)-(\d*)$/);
  if (range && (range[1] || range[2])) {
    // bytes=500-999, bytes=500- или bytes=-500 (последние 500 байт)
    let start = range[1] ? Number(range[1]) : size - Number(range[2]);
    let end = range[1] && range[2] ? Number(range[2]) : size - 1;
    start = Math.max(0, start);
    end = Math.min(end, size - 1);
    if (start > end) {
      return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
    }
    const stream = createReadStream(file, { start, end });
    return new Response(Readable.toWeb(stream) as ReadableStream, {
      status: 206,
      headers: { ...headers, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': String(end - start + 1) },
    });
  }

  const stream = createReadStream(file);
  return new Response(Readable.toWeb(stream) as ReadableStream, {
    headers: { ...headers, 'Content-Length': String(size) },
  });
}
