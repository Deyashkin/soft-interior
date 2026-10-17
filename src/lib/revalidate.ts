import 'server-only';
import { revalidatePath } from 'next/cache';

/**
 * Сброс кэша страниц сайта (обоих городов) после изменений в админке.
 *
 * revalidatePath работает только внутри запроса. Фоновая обработка файлов
 * завершается вне запроса, поэтому она лишь ставит отметку markSiteStale(),
 * а сбрасывает кэш ближайший запрос админки (flushStale).
 */
const KEY = Symbol.for('soft-interior.site-stale');
const flags = globalThis as unknown as Record<symbol, boolean | undefined>;

export function revalidateSite() {
  revalidatePath('/', 'layout');
  flags[KEY] = false;
}

export function markSiteStale() {
  flags[KEY] = true;
}

export function flushStale() {
  if (flags[KEY]) revalidateSite();
}
