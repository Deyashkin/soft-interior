'use client';

import { startTransition, useActionState, useState } from 'react';
import type { ProjectRow } from '@/lib/db/schema';
import type { FormState } from '../../actions';
import styles from '../../admin.module.css';

/** Транслитерация названия в адрес страницы: «Дом в Сочи» → dom-v-sochi. */
const MAP: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y',
  к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f',
  х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .split('')
    .map((ch) => MAP[ch] ?? ch)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

type Action = (state: FormState, form: FormData) => Promise<FormState>;

export function ProjectForm({ project, action }: { project?: ProjectRow; action: Action }) {
  const [state, formAction, pending] = useActionState(action, {});
  const [slug, setSlug] = useState(project?.slug ?? '');
  // Адрес подставляется из названия, пока его не поправили руками.
  const [slugTouched, setSlugTouched] = useState(Boolean(project));

  return (
    // Отправка через onSubmit, а не action: React очищает форму после action,
    // и при ошибке проверки пропали бы несохранённые правки.
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => formAction(data));
      }}
    >
      <div className={styles.grid2}>
        <label className={styles.field}>
          <span className={styles.label}>Название</span>
          <input
            name="title"
            required
            defaultValue={project?.title}
            className={styles.input}
            placeholder="Квартира в ЖК «Прайм Парк»"
            onChange={(e) => !slugTouched && setSlug(slugify(e.target.value))}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Адрес страницы: /projects/…/</span>
          <input
            name="slug"
            required
            value={slug}
            className={styles.input}
            placeholder="prime-park"
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
          />
        </label>
      </div>

      <div className={styles.grid3}>
        <label className={styles.field}>
          <span className={styles.label}>Город</span>
          <select name="city" defaultValue={project?.city ?? 'Москва'} className={styles.input}>
            <option>Москва</option>
            <option>Сочи</option>
          </select>
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Тип объекта (фильтр каталога)</span>
          <select name="type" defaultValue={project?.type ?? 'Квартира'} className={styles.input}>
            <option>Квартира</option>
            <option>Дом</option>
            <option>Апартаменты</option>
          </select>
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Состав работ</span>
          <input
            name="service"
            required
            defaultValue={project?.service}
            className={styles.input}
            placeholder="Проект + ремонт + комплектация"
          />
        </label>
      </div>

      <div className={styles.grid3}>
        <label className={styles.field}>
          <span className={styles.label}>Площадь, м²</span>
          <input name="area" type="number" min={1} required defaultValue={project?.area} className={styles.input} />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Срок</span>
          <input
            name="duration"
            required
            defaultValue={project?.duration}
            className={styles.input}
            placeholder="7 месяцев"
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Год</span>
          <input
            name="year"
            type="number"
            min={2000}
            max={2100}
            required
            defaultValue={project?.year ?? new Date().getFullYear()}
            className={styles.input}
          />
        </label>
      </div>

      <label className={styles.field}>
        <span className={styles.label}>Описание (2–3 предложения: задача и решение)</span>
        <textarea name="summary" required defaultValue={project?.summary} className={styles.input} />
      </label>

      <div className={styles.checks}>
        <label className={styles.check}>
          <input type="checkbox" name="published" defaultChecked={project?.published ?? true} />
          Опубликован на сайте
        </label>
        <label className={styles.check}>
          <input type="checkbox" name="featured" defaultChecked={project?.featured} />
          Крупный кейс на главной
        </label>
      </div>

      <div className={styles.grid2}>
        <label className={styles.field}>
          <span className={styles.label}>Карточка на главной: цвет</span>
          <select name="theme" defaultValue={project?.theme ?? 'light'} className={styles.input}>
            <option value="light">Светлая (под тёмное фото)</option>
            <option value="dark">Тёмная (под светлое фото)</option>
          </select>
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Карточка на главной: сторона</span>
          <select name="align" defaultValue={project?.align ?? 'left'} className={styles.input}>
            <option value="left">Слева</option>
            <option value="right">Справа</option>
          </select>
        </label>
      </div>

      <div className={styles.formActions}>
        <button type="submit" className={styles.button} disabled={pending}>
          {pending ? 'Сохраняем…' : project ? 'Сохранить' : 'Создать и перейти к фото'}
        </button>
        {state.error && <p className={styles.error}>{state.error}</p>}
        {state.saved && !pending && <p className={styles.ok}>Сохранено, сайт обновлён.</p>}
      </div>
    </form>
  );
}
