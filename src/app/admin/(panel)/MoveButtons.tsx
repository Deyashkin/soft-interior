'use client';

import { useTransition } from 'react';
import { moveProject } from '../actions';
import styles from '../admin.module.css';

export function MoveButtons({ id, first, last }: { id: string; first: boolean; last: boolean }) {
  const [pending, start] = useTransition();

  return (
    <div className={styles.rowMove}>
      <button
        type="button"
        className={styles.iconButton}
        disabled={first || pending}
        title="Выше в каталоге"
        onClick={() => start(() => moveProject(id, -1))}
      >
        ↑
      </button>
      <button
        type="button"
        className={styles.iconButton}
        disabled={last || pending}
        title="Ниже в каталоге"
        onClick={() => start(() => moveProject(id, 1))}
      >
        ↓
      </button>
    </div>
  );
}
