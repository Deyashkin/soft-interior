'use client';

import { startTransition, useActionState } from 'react';
import { login, type FormState } from '../actions';
import styles from '../admin.module.css';

export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(login, {});

  return (
    // Отправка через onSubmit, а не action: React очищает форму после action,
    // и после неверного пароля пришлось бы заново вводить email.
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => action(data));
      }}
    >
      <label className={styles.field}>
        <span className={styles.label}>Email</span>
        <input name="email" type="email" autoComplete="username" required className={styles.input} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>Пароль</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={styles.input}
        />
      </label>
      {state.error && <p className={styles.error}>{state.error}</p>}
      <button type="submit" className={styles.button} disabled={pending}>
        {pending ? 'Входим…' : 'Войти'}
      </button>
    </form>
  );
}
