'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FocusEvent,
  type PointerEvent,
} from 'react';
import { ImageSlot } from '@/components/ui/ImageSlot';
import { cx } from '@/lib/cx';
import { heroAutoplaySeconds, heroSlides } from '@/content/home';
import styles from './HeroSlider.module.css';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

/** Просил ли человек в настройках системы убрать анимации. */
function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}

/** 1 → «01»: номер кадра в счётчике. */
function pad(value: number) {
  return String(value).padStart(2, '0');
}

/** Состояние перетаскивания мышью: откуда начали и с какого кадра. */
interface DragState {
  x: number;
  scrollLeft: number;
  from: number;
}

/**
 * Слайдер кадров на первом экране.
 *
 * Листается:
 *  - сам, раз в heroAutoplaySeconds секунд (src/content/home.ts);
 *  - свайпом: на телефоне и тачпаде — пальцами, на компьютере — мышью,
 *    зажав кадр и потянув в сторону;
 *  - кнопками «←» / «→» и стрелками клавиатуры, когда слайдер в фокусе.
 *
 * Сам слайдер не листается, пока курсор над ним, пока в нём фокус
 * с клавиатуры и пока кадр тянут пальцем или мышью — чтобы кадр не уехал
 * из-под руки. Тем, кто отключил анимации в системе, слайдер сам не листается.
 */
export function HeroSlider() {
  const trackRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const drag = useRef<DragState | null>(null);

  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [touching, setTouching] = useState(false);
  const [dragging, setDragging] = useState(false);
  const reducedMotion = useReducedMotion();

  const count = heroSlides.length;
  const paused =
    hovered || keyboardFocus || touching || dragging || reducedMotion;

  const scrollToSlide = useCallback(
    (target: number) => {
      const track = trackRef.current;
      if (!track) return;
      track.scrollTo({
        left: target * track.clientWidth,
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
    },
    [reducedMotion],
  );

  /** Стрелки и автопрокрутка ходят по кругу: после последнего — первый. */
  const goTo = useCallback(
    (target: number) => scrollToSlide((target + count) % count),
    [count, scrollToSlide],
  );

  /* Текущий кадр считаем по положению прокрутки — так он верен при любом
     способе листания, а не только при нажатии на кнопки. */
  const onScroll = () => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const track = trackRef.current;
      if (!track || !track.clientWidth) return;
      setIndex(Math.round(track.scrollLeft / track.clientWidth));
    });
  };

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  /* Автопрокрутка. Таймер перезапускается при каждой смене кадра,
     поэтому ручное листание не «догоняется» тут же автоматическим. */
  useEffect(() => {
    if (paused || count < 2) return;
    const timer = setTimeout(() => goTo(index + 1), heroAutoplaySeconds * 1000);
    return () => clearTimeout(timer);
  }, [index, paused, count, goTo]);

  /* --- Свайп мышью ------------------------------------------------------
     Пальцем и тачпадом ленту листает сам браузер (это обычная прокрутка
     с привязкой к кадрам). Мышью браузер так не умеет — дописываем. */

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track || event.pointerType !== 'mouse' || event.button !== 0) return;

    drag.current = {
      x: event.clientX,
      scrollLeft: track.scrollLeft,
      from: Math.round(track.scrollLeft / track.clientWidth),
    };
    track.setPointerCapture(event.pointerId);
    // Пока тянем, привязку к кадрам снимаем: иначе браузер дёргал бы
    // ленту к ближайшему кадру на каждом пикселе движения.
    track.style.scrollSnapType = 'none';
    setDragging(true);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track || !drag.current) return;
    track.scrollLeft = drag.current.scrollLeft - (event.clientX - drag.current.x);
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    const state = drag.current;
    if (!track || !state) return;

    drag.current = null;
    setDragging(false);

    // Потянули заметно — листаем в ту сторону, чуть-чуть — возвращаем кадр.
    const distance = event.clientX - state.x;
    const threshold = Math.min(80, track.clientWidth * 0.15);
    let target = state.from;
    if (distance < -threshold) target = Math.min(state.from + 1, count - 1);
    if (distance > threshold) target = Math.max(state.from - 1, 0);

    scrollToSlide(target);

    // Привязку к кадрам возвращаем, когда лента доехала до места.
    const fallback = setTimeout(restoreSnap, 700);
    track.addEventListener('scrollend', restoreSnap, { once: true });

    function restoreSnap() {
      clearTimeout(fallback);
      track?.removeEventListener('scrollend', restoreSnap);
      if (track) track.style.scrollSnapType = '';
    }
  };

  /* --- Паузы автопрокрутки ---------------------------------------------- */

  /* При наведении — только для мыши: на телефоне «наведение» срабатывает
     от касания и потом не снимается. */
  const onPointerEnter = (event: PointerEvent) => {
    if (event.pointerType === 'mouse') setHovered(true);
  };
  const onPointerLeave = (event: PointerEvent) => {
    if (event.pointerType === 'mouse') setHovered(false);
  };

  /* При фокусе — только для клавиатуры. Иначе после клика мышью по стрелке
     кнопка остаётся в фокусе и слайдер замирает навсегда. */
  const onFocus = (event: FocusEvent) => {
    if (event.target.matches(':focus-visible')) setKeyboardFocus(true);
  };
  const onBlur = (event: FocusEvent) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setKeyboardFocus(false);
    }
  };

  return (
    <div
      className={styles.slider}
      role="region"
      aria-roledescription="carousel"
      aria-label="Интерьеры, реализованные студией"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <div
        ref={trackRef}
        className={cx(styles.track, dragging && styles.dragging)}
        // Фокус нужен, чтобы листать стрелками клавиатуры.
        tabIndex={0}
        // Пока кадры меняются сами, не зачитываем каждую смену скринридером.
        aria-live={paused ? 'polite' : 'off'}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        // Браузер не должен утаскивать картинку как файл вместо свайпа.
        onDragStart={(event) => event.preventDefault()}
        onTouchStart={() => setTouching(true)}
        onTouchEnd={() => setTouching(false)}
        onTouchCancel={() => setTouching(false)}
      >
        {heroSlides.map((slide, i) => (
          <div
            key={slide.label}
            className={styles.slide}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} из ${count}`}
          >
            <ImageSlot
              src={slide.src}
              alt={slide.alt}
              label={slide.label}
              // Сразу грузим только первый кадр — он виден при открытии.
              preload={i === 0}
              sizes="(max-width: 1100px) 100vw, 55vw"
              className={styles.image}
            />
            <span className={styles.caption}>{slide.caption}</span>
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.button}
          onClick={() => goTo(index - 1)}
          aria-label="Предыдущий кадр"
        >
          <span aria-hidden="true">←</span>
        </button>

        <span className={styles.counter} aria-hidden="true">
          <span className={styles.counterCurrent}>{pad(index + 1)}</span>
          <span className={styles.counterSeparator}>/</span>
          {pad(count)}
        </span>

        <button
          type="button"
          className={styles.button}
          onClick={() => goTo(index + 1)}
          aria-label="Следующий кадр"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
