import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { logout } from '../actions';
import styles from '../admin.module.css';

/** Каркас закрытой части админки. Без входа — на /admin/login/. */
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <Link href="/admin/" className={styles.brand}>
          Soft Interior · админка
        </Link>
        <div className={styles.topbarRight}>
          <a href="/" target="_blank" rel="noreferrer">
            Открыть сайт ↗
          </a>
          <span>{user.email}</span>
          <form action={logout}>
            <button type="submit" className={styles.buttonGhost} style={{ color: 'inherit' }}>
              Выйти
            </button>
          </form>
        </div>
      </header>
      <main className={styles.page}>{children}</main>
    </div>
  );
}
