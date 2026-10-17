/**
 * Выполняется один раз при старте сервера, до первого запроса.
 * Миграции, первый админ, стартовые проекты — см. src/lib/bootstrap.ts.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  if (!process.env.DATABASE_URL) {
    console.warn('[bootstrap] DATABASE_URL не задан — база и админка отключены');
    return;
  }
  const { bootstrap } = await import('./lib/bootstrap');
  await bootstrap();
}
