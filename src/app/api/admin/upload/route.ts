import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { createWriteStream } from 'node:fs';
import { rm } from 'node:fs/promises';
import { Readable, Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { eq, max } from 'drizzle-orm';
import { adminOrNull } from '@/lib/auth';
import { db, schema } from '@/lib/db';
import { enqueueMedia } from '@/lib/media/queue';
import { flushStale } from '@/lib/revalidate';
import {
  IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
  VIDEO_TYPES,
  ensureDirs,
  originalsDir,
} from '@/lib/media/storage';

/**
 * Загрузка одного файла в проект.
 *
 * Тело запроса — сам файл (не multipart): так он пишется на диск потоком
 * и не держится в памяти целиком. Имя файла — в заголовке X-File-Name.
 *   POST /api/admin/upload/?projectId=<uuid>
 */
export async function POST(request: Request) {
  if (!(await adminOrNull())) return Response.json({ error: 'Нужно войти' }, { status: 401 });
  flushStale();

  // Запросы с чужих сайтов отклоняем (cookie и так не уйдёт, но лучше явно).
  const origin = request.headers.get('origin');
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  if (origin && host && new URL(origin).host !== host) {
    return Response.json({ error: 'Чужой источник запроса' }, { status: 403 });
  }

  const projectId = new URL(request.url).searchParams.get('projectId') ?? '';
  const project = /^[0-9a-f-]{36}$/.test(projectId)
    ? await db().query.projects.findFirst({ where: eq(schema.projects.id, projectId) })
    : undefined;
  if (!project) return Response.json({ error: 'Проект не найден' }, { status: 404 });

  const type = (request.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase();
  const kind = type in IMAGE_TYPES ? 'image' : type in VIDEO_TYPES ? 'video' : null;
  if (!kind || !request.body) {
    return Response.json(
      { error: 'Поддерживаются фото (JPG, PNG, WebP, AVIF, HEIC) и видео (MP4, MOV, WebM)' },
      { status: 415 },
    );
  }

  const limit = kind === 'image' ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
  const declared = Number(request.headers.get('content-length') ?? 0);
  if (declared > limit) {
    return Response.json({ error: `Файл больше ${Math.round(limit / 1024 / 1024)} МБ` }, { status: 413 });
  }

  const originalName = decodeURIComponent(request.headers.get('x-file-name') ?? 'file').slice(0, 200);
  const id = randomUUID();
  const ext = kind === 'image' ? IMAGE_TYPES[type] : VIDEO_TYPES[type];
  const fileName = `${id}.${ext}`;
  const target = path.join(/*turbopackIgnore: true*/ originalsDir(), fileName);
  await ensureDirs();

  // Считаем байты на лету: Content-Length клиент может и не прислать.
  let written = 0;
  const counter = new Transform({
    transform(chunk: Buffer, _enc, done) {
      written += chunk.length;
      done(written > limit ? new Error('too-large') : null, chunk);
    },
  });

  try {
    await pipeline(
      Readable.fromWeb(request.body as import('node:stream/web').ReadableStream),
      counter,
      createWriteStream(target),
    );
  } catch (error) {
    await rm(target, { force: true });
    const tooLarge = error instanceof Error && error.message === 'too-large';
    return Response.json(
      { error: tooLarge ? `Файл больше ${Math.round(limit / 1024 / 1024)} МБ` : 'Загрузка прервалась' },
      { status: tooLarge ? 413 : 400 },
    );
  }

  const [{ last }] = await db()
    .select({ last: max(schema.media.position) })
    .from(schema.media)
    .where(eq(schema.media.projectId, projectId));

  const [row] = await db()
    .insert(schema.media)
    .values({
      id,
      projectId,
      kind,
      originalName,
      originalFile: fileName,
      position: (last ?? -1) + 1,
    })
    .returning();

  enqueueMedia(id);
  return Response.json({ media: row });
}
