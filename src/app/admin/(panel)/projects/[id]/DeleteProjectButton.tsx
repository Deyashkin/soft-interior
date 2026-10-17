'use client';

import { useTransition } from 'react';
import styles from '../../../admin.module.css';

export function DeleteProjectButton({ action, title }: { action: () => Promise<void>; title: string }) {
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      className={styles.buttonDanger}
      disabled={pending}
      onClick={() => {
        if (confirm(`Удалить проект «${title}» вместе со всеми фото и видео? Это нельзя отменить.`)) {
          start(() => action());
        }
      }}
    >
      {pending ? 'Удаляем…' : 'Удалить проект'}
    </button>
  );
}
