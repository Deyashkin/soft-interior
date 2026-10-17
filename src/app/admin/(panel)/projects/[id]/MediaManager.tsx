'use client';

import { useEffect, useRef, useState, useTransition, type DragEvent } from 'react';
import type { MediaRow } from '@/lib/db/schema';
import { imageThumb } from '@/lib/media/urls';
import { cx } from '@/lib/cx';
import {
  deleteMedia,
  listMedia,
  reorderMedia,
  retryMedia,
  setCaption,
  setCover,
} from '../../../actions';
import styles from '../../../admin.module.css';

/** Тип файла по расширению — браузеры не всегда знают HEIC и MOV. */
const BY_EXT: Record<string, string> = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', avif: 'image/avif',
  heic: 'image/heic', heif: 'image/heif', tif: 'image/tiff', tiff: 'image/tiff',
  mp4: 'video/mp4', m4v: 'video/mp4', mov: 'video/quicktime', webm: 'video/webm', mkv: 'video/x-matroska', avi: 'video/x-msvideo',
};

function fileType(file: File) {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  return BY_EXT[ext] ?? file.type;
}

interface Upload {
  key: string;
  name: string;
  progress: number;
  error?: string;
}

/** Загрузка одного файла с прогрессом (fetch прогресс отправки не показывает). */
function uploadFile(projectId: string, file: File, onProgress: (p: number) => void) {
  return new Promise<MediaRow>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `/api/admin/upload/?projectId=${projectId}`);
    xhr.setRequestHeader('Content-Type', fileType(file));
    xhr.setRequestHeader('X-File-Name', encodeURIComponent(file.name));
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total);
    xhr.onload = () => {
      let body: { media?: MediaRow; error?: string } = {};
      try {
        body = JSON.parse(xhr.responseText);
      } catch {}
      if (xhr.status === 200 && body.media) resolve(body.media);
      else reject(new Error(body.error ?? `Ошибка ${xhr.status}`));
    };
    xhr.onerror = () => reject(new Error('Нет связи с сервером'));
    xhr.send(file);
  });
}

function formatDuration(sec: number) {
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
}

export function MediaManager({
  projectId,
  coverId: initialCover,
  initial,
}: {
  projectId: string;
  coverId: string | null;
  initial: MediaRow[];
}) {
  const [items, setItems] = useState(initial);
  const [coverId, setCoverId] = useState(initialCover);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [dropActive, setDropActive] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  // Пока что-то обрабатывается — раз в 3 секунды обновляем статусы.
  const processing = items.some((m) => m.status === 'processing');
  useEffect(() => {
    if (!processing) return;
    const timer = setInterval(async () => setItems(await listMedia(projectId)), 3000);
    return () => clearInterval(timer);
  }, [processing, projectId]);

  /* --- Загрузка ----------------------------------------------------------- */

  async function addFiles(files: FileList | File[]) {
    const list = Array.from(files);
    const queued = list.map((file, i) => ({ key: `${Date.now()}-${i}-${file.name}`, name: file.name, progress: 0 }));
    setUploads((u) => [...u, ...queued]);

    // По одному: сервер и канал не забиваются, порядок файлов сохраняется.
    for (const [i, file] of list.entries()) {
      const { key } = queued[i];
      const update = (patch: Partial<Upload>) =>
        setUploads((u) => u.map((x) => (x.key === key ? { ...x, ...patch } : x)));
      try {
        const row = await uploadFile(projectId, file, (progress) => update({ progress }));
        setItems((current) => [...current, row]);
        setUploads((u) => u.filter((x) => x.key !== key));
      } catch (error) {
        update({ error: error instanceof Error ? error.message : String(error) });
      }
    }
  }

  function onZoneDrop(e: DragEvent) {
    e.preventDefault();
    setDropActive(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  }

  /* --- Порядок ------------------------------------------------------------ */

  function applyOrder(next: MediaRow[]) {
    setItems(next);
    startTransition(() => reorderMedia(projectId, next.map((m) => m.id)));
  }

  function moveTo(fromId: string, toId: string) {
    const moved = items.find((m) => m.id === fromId);
    if (!moved || fromId === toId) return;
    // Карточка занимает место той, на которую её бросили.
    const next = items.filter((m) => m.id !== fromId);
    next.splice(items.findIndex((m) => m.id === toId), 0, moved);
    applyOrder(next);
  }

  function shift(id: string, direction: -1 | 1) {
    const index = items.findIndex((m) => m.id === id);
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    applyOrder(next);
  }

  /* --- Действия с файлом -------------------------------------------------- */

  function makeCover(id: string) {
    const next = coverId === id ? null : id;
    setCoverId(next);
    startTransition(() => setCover(projectId, next));
  }

  function remove(item: MediaRow) {
    if (!confirm(`Удалить «${item.originalName}»?`)) return;
    setItems((current) => current.filter((m) => m.id !== item.id));
    if (coverId === item.id) setCoverId(null);
    startTransition(() => deleteMedia([item.id]));
  }

  function retry(id: string) {
    setItems((current) => current.map((m) => (m.id === id ? { ...m, status: 'processing', error: null } : m)));
    startTransition(() => retryMedia(id));
  }

  // Обложка: выбранная или первый готовый файл.
  const effectiveCover = coverId ?? items.find((m) => m.status === 'ready')?.id;

  return (
    <>
      <div
        className={cx(styles.drop, dropActive && styles.dropActive)}
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
        onDragOver={(e) => {
          if (!e.dataTransfer.types.includes('Files')) return;
          e.preventDefault();
          setDropActive(true);
        }}
        onDragLeave={() => setDropActive(false)}
        onDrop={onZoneDrop}
      >
        <span className={styles.dropTitle}>Перетащите сюда фото и видео или нажмите, чтобы выбрать</span>
        <span className={styles.dropHint}>
          Фото: JPG, PNG, HEIC (iPhone), WebP — до 80 МБ. Видео: MP4, MOV — до 2 ГБ.
          <br />
          Сжимаются автоматически; видео обрабатывается несколько минут.
        </span>
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          accept="image/*,video/*,.heic,.heif,.mov"
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {uploads.length > 0 && (
        <div className={styles.uploads}>
          {uploads.map((u) => (
            <div key={u.key} className={styles.upload}>
              <span>{u.name}</span>
              <span className={u.error ? styles.error : undefined}>
                {u.error ?? `${Math.round(u.progress * 100)}%`}
              </span>
              {!u.error && (
                <div className={styles.progress}>
                  <div className={styles.progressBar} style={{ width: `${u.progress * 100}%` }} />
                </div>
              )}
            </div>
          ))}
          {uploads.some((u) => u.error) && (
            <button
              type="button"
              className={styles.buttonGhost}
              onClick={() => setUploads((u) => u.filter((x) => !x.error))}
            >
              Скрыть ошибки
            </button>
          )}
        </div>
      )}

      {items.length > 0 && (
        <p className={styles.hint} style={{ marginTop: 'var(--space-6)' }}>
          Порядок на сайте — как здесь. Перетаскивайте карточки мышью или двигайте стрелками.
          Обложка — главный кадр в каталоге и на главной.
        </p>
      )}

      <div className={styles.mediaGrid}>
        {items.map((item, index) => {
          const ready = item.status === 'ready' && item.variants;
          const isCover = item.id === effectiveCover;
          return (
            <div
              key={item.id}
              className={cx(
                styles.tile,
                isCover && styles.tileCover,
                dragId === item.id && styles.tileDragging,
                overId === item.id && dragId !== item.id && styles.tileOver,
              )}
              draggable
              onDragStart={(e) => {
                setDragId(item.id);
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', item.id);
              }}
              onDragEnd={() => {
                setDragId(null);
                setOverId(null);
              }}
              onDragOver={(e) => {
                if (!dragId) return;
                e.preventDefault();
                setOverId(item.id);
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (dragId) moveTo(dragId, item.id);
                setDragId(null);
                setOverId(null);
              }}
            >
              <div className={styles.tileMedia}>
                {ready ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageThumb({ ...item, variants: item.variants! })} alt={item.caption} />
                ) : item.status === 'failed' ? (
                  <div className={styles.tileStatusError} title={item.error ?? ''}>
                    Не удалось обработать
                  </div>
                ) : (
                  <div className={styles.tileStatus}>
                    {item.kind === 'video' ? 'Видео обрабатывается…' : 'Обрабатывается…'}
                  </div>
                )}
                {item.kind === 'video' && (
                  <span className={styles.tileTag}>
                    Видео
                    {item.variants?.kind === 'video' && ` · ${formatDuration(item.variants.durationSec)}`}
                  </span>
                )}
              </div>

              <input
                className={styles.captionInput}
                placeholder="Подпись (необязательно)"
                defaultValue={item.caption}
                onBlur={(e) => {
                  if (e.target.value !== item.caption) {
                    const caption = e.target.value;
                    setItems((current) => current.map((m) => (m.id === item.id ? { ...m, caption } : m)));
                    startTransition(() => setCaption(item.id, caption));
                  }
                }}
              />

              <div className={styles.tileActions}>
                <button type="button" onClick={() => shift(item.id, -1)} disabled={index === 0} title="Раньше">
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => shift(item.id, 1)}
                  disabled={index === items.length - 1}
                  title="Позже"
                >
                  →
                </button>
                {ready && (
                  <button type="button" onClick={() => makeCover(item.id)}>
                    {isCover ? (coverId ? '★ Обложка' : '★ Обложка (авто)') : 'Сделать обложкой'}
                  </button>
                )}
                {item.status === 'failed' && (
                  <button type="button" onClick={() => retry(item.id)}>
                    Повторить
                  </button>
                )}
                <button type="button" onClick={() => remove(item)}>
                  Удалить
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
