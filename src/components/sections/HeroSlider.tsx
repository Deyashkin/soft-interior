'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type FocusEvent,
  type PointerEvent,
} from 'react';
import { ImageSlot } from '@/components/ui/ImageSlot';
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

/**
 * Слайдер кадров на первом экране.
 *
 * Листается тремя способами:
 *  - сам, раз в heroAutoplaySeconds секунд (src/content/home.ts);
 *  - прокруткой: свайп на телефоне, жест тачпадом, Shift + колесо мыши,
 *    стрелки клавиатуры, когда слайдер в фокусе. Это обычная горизонтальная
 *    прокрутка с привязкой к кадрам (scroll-snap) — её делает сам браузер;
 *  - кнопками «←» / «→».
 *
 * Обычное колесо мыши кадры НЕ листает — намеренно: иначе страница
 * «застревала» бы, пока курсор над фотографией.
 *
 * Автопрокрутка останавливается, пока курсор над слайдером, пока в нём
 * фокус с клавиатуры и пока палец на экране; кнопкой паузы — насовсем.
 * Тем, кто отключил анимации в системе, слайдер сам не листается.
 */
export function HeroSlider() {
  const trackRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [touching, setTouching] = useState(false);
  const reducedMotion = useReducedMotion();

  const count = heroSlides.length;
  const paused =
    userPaused || hovered || keyboardFocus || touching || reducedMotion;

  const goTo = useCallback(
    (target: number) => {
      const track = trackRef.current;
      if (!track) return;
      const next = (target + count) % count;
      track.scrollTo({
        left: next * track.clientWidth,
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
    },
    [count, reducedMotion],
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

  /* Пауза при наведении — только для мыши: на телефоне «наведение»
     срабатывает от касания и потом не снимается. */
  const onPointerEnter = (event: PointerEvent) => {
    if (event.pointerType === 'mouse') setHovered(true);
  };
  const onPointerLeave = (event: PointerEvent) => {
    if (event.pointerType === 'mouse') setHovered(false);
  };

  /* Пауза при фокусе — только для клавиатуры. Иначе после клика мышью
     по стрелке кнопка остаётся в фокусе и слайдер замирает навсегда. */
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
        className={styles.track}
        // Фокус нужен, чтобы листать стрелками клавиатуры.
        tabIndex={0}
        // Пока кадры меняются сами, не зачитываем каждую смену скринридером.
        aria-live={paused ? 'polite' : 'off'}
        onScroll={onScroll}
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

        {!reducedMotion && (
          <button
            type="button"
            className={styles.button}
            onClick={() => setUserPaused((value) => !value)}
            aria-label={
              userPaused ? 'Включить автопрокрутку' : 'Остановить автопрокрутку'
            }
          >
            {userPaused ? (
              <svg viewBox="0 0 12 12" className={styles.icon} aria-hidden="true">
                <path d="M3 1.5v9l7.5-4.5z" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 12 12" className={styles.icon} aria-hidden="true">
                <rect x="2.5" y="1.5" width="2.5" height="9" fill="currentColor" />
                <rect x="7" y="1.5" width="2.5" height="9" fill="currentColor" />
              </svg>
            )}
          </button>
        )}

        {/* Полоса до следующего кадра. На паузе прячем, а после неё
            запускаем заново вместе с таймером — чтобы не расходились. */}
        {!paused && (
          <span
            key={index}
            className={styles.progress}
            style={{ '--slide-duration': `${heroAutoplaySeconds}s` } as CSSProperties}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}
