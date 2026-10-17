import { defineConfig } from 'drizzle-kit';

/** Генерация миграций: `npm run db:generate`. */
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
});
