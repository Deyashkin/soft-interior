import 'server-only';
import { eq } from 'drizzle-orm';
import { db, schema } from '@/lib/db';
import { processMedia } from './process';

/**
 * Очередь обработки: файлы обрабатываются строго по одному.
 * Хранится в globalThis — Next.js может загрузить модуль несколько раз,
 * а очередь должна быть одна на процесс.
 */
const KEY = Symbol.for('soft-interior.media-queue');

interface QueueState {
  tail: Promise<void>;
  pending: Set<string>;
}

function state(): QueueState {
  const g = globalThis as unknown as Record<symbol, QueueState | undefined>;
  return (g[KEY] ??= { tail: Promise.resolve(), pending: new Set() });
}

export function enqueueMedia(id: string) {
  const s = state();
  if (s.pending.has(id)) return;
  s.pending.add(id);
  s.tail = s.tail
    .then(() => processMedia(id))
    .catch((error) => console.error('[media] очередь:', error))
    .finally(() => s.pending.delete(id));
}

/** После перезапуска сервера дообрабатываем то, что не успели. */
export async function resumeMediaQueue() {
  const rows = await db()
    .select({ id: schema.media.id })
    .from(schema.media)
    .where(eq(schema.media.status, 'processing'))
    .orderBy(schema.media.createdAt);
  rows.forEach((row) => enqueueMedia(row.id));
  if (rows.length) console.log(`[media] в очереди после перезапуска: ${rows.length}`);
}
