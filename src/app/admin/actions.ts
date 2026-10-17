'use server';

import { redirect } from 'next/navigation';
import { and, asc, eq, inArray, ne } from 'drizzle-orm';
import { createSession, destroySession, requireAdmin, verifyLogin } from '@/lib/auth';
import { db, schema } from '@/lib/db';
import { removeMediaFiles } from '@/lib/media/storage';
import { flushStale, revalidateSite } from '@/lib/revalidate';

/**
 * Серверные действия админки. Каждое начинается с requireAdmin():
 * действие — это отдельный POST-запрос, защиты страницы для него мало.
 */

export interface FormState {
  error?: string;
  saved?: boolean;
}

/* --- Вход ------------------------------------------------------------- */

export async function login(_prev: FormState, form: FormData): Promise<FormState> {
  const email = String(form.get('email') ?? '').trim();
  const password = String(form.get('password') ?? '');
  if (!email || !password) return { error: 'Введите email и пароль.' };

  const result = await verifyLogin(email, password);
  if ('error' in result) return { error: result.error };
  await createSession(result.user.id);
  redirect('/admin/');
}

export async function logout() {
  await destroySession();
  redirect('/admin/login/');
}

/* --- Проекты ---------------------------------------------------------- */

const CITIES = ['Москва', 'Сочи'] as const;
const TYPES = ['Квартира', 'Дом', 'Апартаменты'] as const;

function pick<T extends string>(value: FormDataEntryValue | null, allowed: readonly T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

/** Поля проекта из формы с проверкой. */
function readProject(form: FormData) {
  const text = (name: string) => String(form.get(name) ?? '').trim();
  const data = {
    title: text('title'),
    slug: text('slug').toLowerCase(),
    city: pick(form.get('city'), CITIES, 'Москва'),
    type: pick(form.get('type'), TYPES, 'Квартира'),
    service: text('service'),
    area: Number(text('area')),
    duration: text('duration'),
    year: Number(text('year')),
    summary: text('summary'),
    featured: form.get('featured') === 'on',
    published: form.get('published') === 'on',
    theme: pick(form.get('theme'), ['light', 'dark'] as const, 'light'),
    align: pick(form.get('align'), ['left', 'right'] as const, 'left'),
  };

  if (!data.title) return { error: 'Укажите название.' };
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(data.slug)) {
    return { error: 'Адрес страницы — только латиница, цифры и дефисы, например prime-park.' };
  }
  if (!data.service || !data.duration || !data.summary) return { error: 'Заполните все поля.' };
  if (!Number.isInteger(data.area) || data.area <= 0) return { error: 'Площадь — целое число больше нуля.' };
  if (!Number.isInteger(data.year) || data.year < 2000 || data.year > 2100) return { error: 'Проверьте год.' };
  return { data };
}

async function slugTaken(slug: string, exceptId?: string) {
  const row = await db().query.projects.findFirst({
    where: exceptId
      ? and(eq(schema.projects.slug, slug), ne(schema.projects.id, exceptId))
      : eq(schema.projects.slug, slug),
  });
  return Boolean(row);
}

export async function createProject(_prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = readProject(form);
  if ('error' in parsed) return { error: parsed.error };
  if (await slugTaken(parsed.data.slug)) return { error: 'Такой адрес страницы уже занят.' };

  // Новый проект — в начало каталога.
  const first = await db().query.projects.findFirst({ orderBy: asc(schema.projects.position) });
  const [row] = await db()
    .insert(schema.projects)
    .values({ ...parsed.data, position: (first?.position ?? 0) - 1 })
    .returning({ id: schema.projects.id });

  revalidateSite();
  redirect(`/admin/projects/${row.id}/`);
}

export async function updateProject(id: string, _prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = readProject(form);
  if ('error' in parsed) return { error: parsed.error };
  if (await slugTaken(parsed.data.slug, id)) return { error: 'Такой адрес страницы уже занят.' };

  await db()
    .update(schema.projects)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(schema.projects.id, id));
  revalidateSite();
  return { saved: true };
}

export async function deleteProject(id: string) {
  await requireAdmin();
  const files = await db().select().from(schema.media).where(eq(schema.media.projectId, id));
  await db().delete(schema.projects).where(eq(schema.projects.id, id));
  await Promise.all(files.map((f) => removeMediaFiles(f.id, f.originalFile)));
  revalidateSite();
  redirect('/admin/');
}

/** Сдвинуть проект в каталоге на одну позицию вверх или вниз. */
export async function moveProject(id: string, direction: -1 | 1) {
  await requireAdmin();
  const all = await db()
    .select({ id: schema.projects.id })
    .from(schema.projects)
    .orderBy(asc(schema.projects.position), asc(schema.projects.createdAt));
  const index = all.findIndex((p) => p.id === id);
  const swap = index + direction;
  if (index < 0 || swap < 0 || swap >= all.length) return;
  [all[index], all[swap]] = [all[swap], all[index]];
  await db().transaction(async (tx) => {
    for (const [position, p] of all.entries()) {
      await tx.update(schema.projects).set({ position }).where(eq(schema.projects.id, p.id));
    }
  });
  revalidateSite();
}

/* --- Медиа ------------------------------------------------------------ */

async function mediaOf(projectId: string) {
  return db()
    .select()
    .from(schema.media)
    .where(eq(schema.media.projectId, projectId))
    .orderBy(asc(schema.media.position), asc(schema.media.createdAt));
}

/** Список файлов проекта — админка опрашивает его, пока идёт обработка. */
export async function listMedia(projectId: string) {
  await requireAdmin();
  flushStale();
  return mediaOf(projectId);
}

export async function reorderMedia(projectId: string, ids: string[]) {
  await requireAdmin();
  await db().transaction(async (tx) => {
    for (const [position, id] of ids.entries()) {
      await tx
        .update(schema.media)
        .set({ position })
        .where(and(eq(schema.media.id, id), eq(schema.media.projectId, projectId)));
    }
  });
  revalidateSite();
}

export async function setCover(projectId: string, mediaId: string | null) {
  await requireAdmin();
  await db()
    .update(schema.projects)
    .set({ coverMediaId: mediaId, updatedAt: new Date() })
    .where(eq(schema.projects.id, projectId));
  revalidateSite();
}

export async function setCaption(mediaId: string, caption: string) {
  await requireAdmin();
  await db()
    .update(schema.media)
    .set({ caption: caption.trim().slice(0, 300) })
    .where(eq(schema.media.id, mediaId));
  revalidateSite();
}

export async function deleteMedia(mediaIds: string[]) {
  await requireAdmin();
  if (mediaIds.length === 0) return;
  const rows = await db().select().from(schema.media).where(inArray(schema.media.id, mediaIds));
  await db().delete(schema.media).where(inArray(schema.media.id, mediaIds));
  // Если удалили обложку — проект возвращается к первому файлу галереи.
  await db()
    .update(schema.projects)
    .set({ coverMediaId: null })
    .where(inArray(schema.projects.coverMediaId, mediaIds));
  await Promise.all(rows.map((r) => removeMediaFiles(r.id, r.originalFile)));
  revalidateSite();
}

/** Повторить обработку файла, если она упала. */
export async function retryMedia(mediaId: string) {
  await requireAdmin();
  await db()
    .update(schema.media)
    .set({ status: 'processing', error: null })
    .where(eq(schema.media.id, mediaId));
  const { enqueueMedia } = await import('@/lib/media/queue');
  enqueueMedia(mediaId);
}
