import Link from 'next/link';
import { asc, eq } from 'drizzle-orm';
import { db, schema } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { imageThumb } from '@/lib/media/urls';
import { MoveButtons } from './MoveButtons';
import styles from '../admin.module.css';

/** Список проектов в порядке каталога. */
export default async function AdminProjectsPage() {
  await requireAdmin();

  const projects = await db()
    .select()
    .from(schema.projects)
    .orderBy(asc(schema.projects.position), asc(schema.projects.createdAt));

  // Превью: обложка или первый готовый файл.
  const files = await db()
    .select()
    .from(schema.media)
    .where(eq(schema.media.status, 'ready'))
    .orderBy(asc(schema.media.position), asc(schema.media.createdAt));

  const counts = new Map<string, number>();
  files.forEach((f) => counts.set(f.projectId, (counts.get(f.projectId) ?? 0) + 1));

  return (
    <>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>Проекты</h1>
        <Link href="/admin/projects/new/" className={styles.button}>
          + Новый проект
        </Link>
      </div>

      <p className={styles.hint}>
        Порядок здесь — порядок в каталоге на сайте. «На главной» — проект показан
        крупным кейсом на главной странице.
      </p>

      <div className={styles.list}>
        {projects.map((project, index) => {
          const own = files.filter((f) => f.projectId === project.id);
          const cover = own.find((f) => f.id === project.coverMediaId) ?? own[0];
          return (
            <div key={project.id} className={styles.row}>
              <div className={styles.rowThumb}>
                {cover?.variants && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageThumb({ ...cover, variants: cover.variants })}
                    alt=""
                  />
                )}
              </div>
              <div>
                <Link href={`/admin/projects/${project.id}/`} className={styles.rowTitle}>
                  {project.title}
                </Link>
                <div className={styles.rowMeta}>
                  {project.city} · {project.type} · {project.area} м² · файлов:{' '}
                  {counts.get(project.id) ?? 0}
                </div>
              </div>
              <div className={styles.badges}>
                {project.featured && <span className={styles.badge}>На главной</span>}
                {!project.published && <span className={styles.badgeMuted}>Черновик</span>}
              </div>
              <MoveButtons id={project.id} first={index === 0} last={index === projects.length - 1} />
            </div>
          );
        })}
      </div>
    </>
  );
}
