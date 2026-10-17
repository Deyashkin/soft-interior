import 'server-only';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

/**
 * Подключение к Postgres. Создаётся при первом обращении, а не при импорте:
 * сборка в CI идёт без базы и не должна падать из-за отсутствия DATABASE_URL.
 */
let instance: ReturnType<typeof createDb> | undefined;

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL не задан');
  // Небольшой пул: сервер общий с магазином, нагрузка у сайта студии скромная.
  // onnotice: не засорять лог служебными сообщениями миграций.
  const client = postgres(url, { max: 5, onnotice: () => {} });
  return drizzle(client, { schema });
}

export function db() {
  instance ??= createDb();
  return instance;
}

export { schema };
