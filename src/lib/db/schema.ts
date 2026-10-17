import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

/**
 * СХЕМА БАЗЫ ДАННЫХ.
 *
 * Поменяли таблицу — выполните `npm run db:generate`: появится новый файл
 * миграции в папке drizzle/. Применяется он сам при старте сервера
 * (src/instrumentation.ts).
 */

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  /** Пока роль одна — главный админ. Поле на будущее: редакторы, менеджеры. */
  role: text('role', { enum: ['admin'] }).notNull().default('admin'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const sessions = pgTable('sessions', {
  /** Случайный токен из cookie. В базе хранится только его SHA-256. */
  id: text('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
});

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  city: text('city', { enum: ['Москва', 'Сочи'] }).notNull(),
  type: text('type', { enum: ['Квартира', 'Дом', 'Апартаменты'] }).notNull(),
  /** Состав работ: что именно делали на объекте. */
  service: text('service').notNull(),
  /** Площадь в м². */
  area: integer('area').notNull(),
  duration: text('duration').notNull(),
  year: integer('year').notNull(),
  summary: text('summary').notNull(),
  /** Крупный кейс на главной. Таких должно быть немного — два-три. */
  featured: boolean('featured').notNull().default(false),
  /** Оформление карточки поверх фото на главной. */
  theme: text('theme', { enum: ['light', 'dark'] }).notNull().default('light'),
  align: text('align', { enum: ['left', 'right'] }).notNull().default('left'),
  /** Черновик не виден на сайте. */
  published: boolean('published').notNull().default(true),
  /** Порядок в каталоге: меньше — выше. */
  position: integer('position').notNull().default(0),
  /** Главный кадр. Пусто — берётся первый файл галереи. */
  coverMediaId: uuid('cover_media_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

/** Что получилось после обработки файла. Пути — относительно /media/. */
export type MediaVariants =
  | {
      kind: 'image';
      /** Ширины, в которых сохранены AVIF и WebP: <id>/<ширина>.<формат> */
      widths: number[];
    }
  | {
      kind: 'video';
      /** Видео разной высоты: <id>/<высота>.mp4 */
      heights: number[];
      /** Обложка видео — как картинка: <id>/poster-<ширина>.<формат> */
      posterWidths: number[];
      durationSec: number;
    };

export const media = pgTable('media', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  kind: text('kind', { enum: ['image', 'video'] }).notNull(),
  /** processing → ready | failed. На сайт попадают только ready. */
  status: text('status', { enum: ['processing', 'ready', 'failed'] })
    .notNull()
    .default('processing'),
  error: text('error'),
  /** Подпись под кадром и alt для картинки. */
  caption: text('caption').notNull().default(''),
  position: integer('position').notNull().default(0),
  originalName: text('original_name').notNull(),
  /** Файл оригинала в MEDIA_DIR/originals/. Наружу не отдаётся. */
  originalFile: text('original_file').notNull(),
  width: integer('width'),
  height: integer('height'),
  variants: jsonb('variants').$type<MediaVariants>(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export type ProjectRow = typeof projects.$inferSelect;
export type MediaRow = typeof media.$inferSelect;
