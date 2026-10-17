import 'server-only';
import path from 'node:path';
import { count } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db, schema } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { resumeMediaQueue } from '@/lib/media/queue';
import { ensureDirs } from '@/lib/media/storage';
import { seedProjects } from '@/content/projects';

/**
 * Подготовка при старте сервера (вызывается из src/instrumentation.ts):
 *   1. применить миграции из папки drizzle/;
 *   2. создать главного админа из ADMIN_EMAIL / ADMIN_PASSWORD, если
 *      пользователей ещё нет;
 *   3. на пустой базе перенести стартовые проекты из src/content/projects.ts;
 *   4. дообработать файлы, которые не успели до перезапуска.
 */
export async function bootstrap() {
  await migrate(db(), { migrationsFolder: path.join(/*turbopackIgnore: true*/ process.cwd(), 'drizzle') });
  await ensureDirs();

  const [{ users }] = await db().select({ users: count() }).from(schema.users);
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (users === 0 && email && password) {
    await db().insert(schema.users).values({ email, passwordHash: await hashPassword(password) });
    console.log(`[bootstrap] создан администратор ${email}`);
  } else if (users === 0) {
    console.warn('[bootstrap] нет ни одного администратора: задайте ADMIN_EMAIL и ADMIN_PASSWORD');
  }

  const [{ projects }] = await db().select({ projects: count() }).from(schema.projects);
  if (projects === 0) {
    await db()
      .insert(schema.projects)
      .values(
        seedProjects.map((p, index) => ({
          slug: p.slug,
          title: p.title,
          city: p.city,
          type: p.type,
          service: p.service,
          area: p.area,
          duration: p.duration,
          year: p.year,
          summary: p.summary,
          featured: p.featured ?? false,
          theme: p.theme ?? 'light',
          align: p.align ?? 'left',
          position: index,
        })),
      );
    console.log(`[bootstrap] перенесено стартовых проектов: ${seedProjects.length}`);
  }

  await resumeMediaQueue();
}
