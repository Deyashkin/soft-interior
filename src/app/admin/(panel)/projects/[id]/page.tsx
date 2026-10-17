import Link from 'next/link';
import { notFound } from 'next/navigation';
import { asc, eq } from 'drizzle-orm';
import { db, schema } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { deleteProject, updateProject } from '../../../actions';
import { ProjectForm } from '../ProjectForm';
import { MediaManager } from './MediaManager';
import { DeleteProjectButton } from './DeleteProjectButton';
import styles from '../../../admin.module.css';

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();

  const project = await db().query.projects.findFirst({ where: eq(schema.projects.id, id) });
  if (!project) notFound();

  const files = await db()
    .select()
    .from(schema.media)
    .where(eq(schema.media.projectId, id))
    .orderBy(asc(schema.media.position), asc(schema.media.createdAt));

  return (
    <>
      <Link href="/admin/" className={styles.back}>
        ← Все проекты
      </Link>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>{project.title}</h1>
        {project.published && (
          <a href={`/projects/${project.slug}/`} target="_blank" rel="noreferrer" className={styles.buttonGhost}>
            Открыть на сайте ↗
          </a>
        )}
      </div>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Фото и видео</h2>
        <MediaManager projectId={project.id} coverId={project.coverMediaId} initial={files} />
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Описание проекта</h2>
        <ProjectForm project={project} action={updateProject.bind(null, project.id)} />
      </section>

      <DeleteProjectButton action={deleteProject.bind(null, project.id)} title={project.title} />
    </>
  );
}
