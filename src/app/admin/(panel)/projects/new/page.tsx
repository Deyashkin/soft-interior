import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { createProject } from '../../../actions';
import { ProjectForm } from '../ProjectForm';
import styles from '../../../admin.module.css';

export default async function NewProjectPage() {
  await requireAdmin();

  return (
    <>
      <Link href="/admin/" className={styles.back}>
        ← Все проекты
      </Link>
      <h1 className={styles.pageTitle}>Новый проект</h1>
      <p className={styles.hint}>Фото и видео добавляются на следующем шаге, после создания.</p>
      <div className={styles.card}>
        <ProjectForm action={createProject} />
      </div>
    </>
  );
}
