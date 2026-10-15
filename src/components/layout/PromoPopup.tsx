'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { popup } from '@/content/popup';
import styles from './PromoPopup.module.css';

const STORAGE_KEY = 'si-popup-dismissed';

/** Закрывали ли карточку недавно. Приватный режим может запретить доступ. */
function dismissedRecently() {
  try {
    const saved = Number(window.localStorage.getItem(STORAGE_KEY));
    if (!saved) return false;
    return Date.now() - saved < popup.remindAfterDays * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

function remember() {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    // Хранилище недоступно — покажем карточку в следующий раз. Не страшно.
  }
}

/** Форма расчёта на странице — карточка ведёт к ней, а не на главную. */
function findForm() {
  return document.getElementById('zayavka');
}

/**
 * Всплывающая карточка с предложением расчёта.
 *
 * Ненавязчивость здесь — не про оформление, а про поведение:
 * страницу не затемняем, фокус не перехватываем, показываем один раз
 * и не раньше, чем человек успел что-то прочитать. Закрыли — молчим
 * две недели. Тексты и тайминги: src/content/popup.ts.
 */
export function PromoPopup() {
  const [visible, setVisible] = useState(false);
  const [atForm, setAtForm] = useState(false);
  const [href, setHref] = useState('/#zayavka');

  const close = useCallback(() => {
    setVisible(false);
    remember();
  }, []);

  useEffect(() => {
    if (dismissedRecently()) return;

    const show = () => {
      // На странице со своей формой ведём к ней, иначе — на главную.
      if (findForm()) setHref('#zayavka');
      setVisible(true);
      stop();
    };

    const onScroll = () => {
      const scrollable = document.body.scrollHeight - window.innerHeight;
      const passed = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      if (passed >= popup.scrollPercent) show();
    };

    function stop() {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    }

    const timer = setTimeout(show, popup.delaySeconds * 1000);
    window.addEventListener('scroll', onScroll, { passive: true });

    return stop;
  }, []);

  /**
   * Пока форма расчёта на экране, карточку прячем: предлагать расчёт поверх
   * самой формы — и бессмысленно, и она закрыла бы кнопку отправки.
   * Это не закрытие: ушёл от формы — карточка вернулась.
   */
  useEffect(() => {
    const form = findForm();
    if (!form) return;

    const observer = new IntersectionObserver(([entry]) =>
      setAtForm(entry.isIntersecting),
    );
    observer.observe(form);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [visible, close]);

  if (!visible || atForm) return null;

  return (
    // role="dialog" без aria-modal: остальная страница остаётся доступной.
    <aside
      className={styles.popup}
      role="dialog"
      aria-labelledby="promo-popup-title"
    >
      <button
        type="button"
        className={styles.close}
        onClick={close}
        aria-label="Закрыть предложение"
      >
        <span aria-hidden="true">✕</span>
      </button>

      <Eyebrow>{popup.eyebrow}</Eyebrow>

      {/* Не заголовок тега h2: карточка не должна лезть в структуру страницы. */}
      <p className={styles.title} id="promo-popup-title">
        {popup.title}
      </p>

      <p className={styles.text}>{popup.text}</p>

      <div className={styles.actions}>
        <Button href={href} size="sm" onClick={close}>
          {popup.action}
        </Button>
        <button type="button" className={styles.dismiss} onClick={close}>
          {popup.dismiss}
        </button>
      </div>

      <span className={styles.note}>{popup.note}</span>
    </aside>
  );
}
