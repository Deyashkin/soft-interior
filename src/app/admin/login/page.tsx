import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { LoginForm } from './LoginForm';
import styles from '../admin.module.css';

export default async function LoginPage() {
  if (await getCurrentUser()) redirect('/admin/');

  return (
    <div className={styles.loginWrap}>
      <div className={styles.loginCard}>
        <h1 className={styles.cardTitle}>Вход в админку</h1>
        <LoginForm />
      </div>
    </div>
  );
}
