import 'server-only';
import { and, asc, eq, inArray } from 'drizzle-orm';
import { db, schema } from '@/lib/db';
import type { MediaRow, ProjectRow } from '@/lib/db/schema';
import type { Media } from '@/lib/media/urls';
import type { Project } from '@/content/projects';

/**
 * Проекты для страниц сайта: только опубликованные, файлы — только готовые.
 * Страницы кэшируются целиком, поэтому отдельный кэш данных здесь не нужен.
 */

function toMedia(row: MediaRow): Media {
  return {
    id: row.id,
    kind: row.kind,
    caption: row.caption,
    width: row.width,
    height: row.height,
    variants: row.variants!,
  };
}

function toProject(row: ProjectRow, files: MediaRow[]): Project {
  const ready = files.filter((m) => m.status === 'ready' && m.variants).map(toMedia);
  const cover = ready.find((m) => m.id === row.coverMediaId) ?? ready[0] ?? null;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    city: row.city,
    type: row.type,
    service: row.service,
    area: row.area,
    duration: row.duration,
    year: row.year,
    summary: row.summary,
    featured: row.featured,
    theme: row.theme,
    align: row.align,
    cover,
    gallery: ready.filter((m) => m.id !== cover?.id),
  };
}

async function withMedia(rows: ProjectRow[]): Promise<Project[]> {
  if (rows.length === 0) return [];
  const files = await db()
    .select()
    .from(schema.media)
    .where(inArray(schema.media.projectId, rows.map((r) => r.id)))
    .orderBy(asc(schema.media.position), asc(schema.media.createdAt));
  return rows.map((row) => toProject(row, files.filter((f) => f.projectId === row.id)));
}

const order = [asc(schema.projects.position), asc(schema.projects.createdAt)];

export async function getPublishedProjects(): Promise<Project[]> {
  const rows = await db()
    .select()
    .from(schema.projects)
    .where(eq(schema.projects.published, true))
    .orderBy(...order);
  return withMedia(rows);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const rows = await db()
    .select()
    .from(schema.projects)
    .where(and(eq(schema.projects.published, true), eq(schema.projects.featured, true)))
    .orderBy(...order);
  return withMedia(rows);
}

export async function getPublishedProject(slug: string): Promise<Project | null> {
  const rows = await db()
    .select()
    .from(schema.projects)
    .where(and(eq(schema.projects.slug, slug), eq(schema.projects.published, true)))
    .limit(1);
  return (await withMedia(rows))[0] ?? null;
}
