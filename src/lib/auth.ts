import 'server-only';
import { createHash, randomBytes } from 'node:crypto';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { and, eq, gt, lt } from 'drizzle-orm';
import { db, schema } from '@/lib/db';

/**
 * ВХОД В АДМИНКУ.
 *
 * Сессия — случайный токен в httpOnly-cookie; в базе лежит только его хеш,
 * поэтому утечка таблицы sessions не даёт войти. Проверка прав —
 * requireAdmin() в начале КАЖДОГО серверного действия и маршрута админки,
 * а не только в layout: layout не защищает отдельные запросы.
 */

const COOKIE = 'si_session';
const SESSION_DAYS = 30;

const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await db().insert(schema.sessions).values({ id: hashToken(token), userId, expiresAt });
  // Попутно чистим просроченные сессии.
  await db().delete(schema.sessions).where(lt(schema.sessions.expiresAt, new Date()));

  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) await db().delete(schema.sessions).where(eq(schema.sessions.id, hashToken(token)));
  jar.delete(COOKIE);
}

/** Текущий пользователь или null. Один запрос к базе на рендер. */
export const getCurrentUser = cache(async () => {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const [row] = await db()
    .select({ id: schema.users.id, email: schema.users.email, role: schema.users.role })
    .from(schema.sessions)
    .innerJoin(schema.users, eq(schema.users.id, schema.sessions.userId))
    .where(and(eq(schema.sessions.id, hashToken(token)), gt(schema.sessions.expiresAt, new Date())))
    .limit(1);
  return row ?? null;
});

/** Для страниц и серверных действий: без входа — на страницу логина. */
export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') redirect('/admin/login/');
  return user;
}

/** Для маршрутов API: без входа — null, маршрут сам вернёт 401. */
export async function adminOrNull() {
  const user = await getCurrentUser();
  return user?.role === 'admin' ? user : null;
}

/* Простая защита от подбора пароля: не больше 10 попыток за 15 минут
   на один email. Хранится в памяти процесса — для одного сервера хватает. */
const attempts = new Map<string, { count: number; until: number }>();

export async function verifyLogin(email: string, password: string) {
  const key = email.toLowerCase();
  const now = Date.now();
  const entry = attempts.get(key);
  if (entry && entry.until > now && entry.count >= 10) return { error: 'Слишком много попыток. Подождите 15 минут.' };

  const user = await db().query.users.findFirst({ where: eq(schema.users.email, key) });
  // bcrypt сравниваем всегда, даже если пользователя нет, — чтобы по времени
  // ответа нельзя было понять, существует ли такой email.
  const ok = await bcrypt.compare(
    password,
    user?.passwordHash ?? '$2b$12$C6UzMDM.H6dfI/f/IKcEeO5bzjxu6Wf3kd0mA6fW2cQ5wJvH1M8G.',
  );
  if (!user || !ok) {
    const fresh = !entry || entry.until <= now;
    attempts.set(key, { count: fresh ? 1 : entry.count + 1, until: fresh ? now + 15 * 60 * 1000 : entry.until });
    return { error: 'Неверный email или пароль.' };
  }
  attempts.delete(key);
  return { user };
}
