/**
 * ЗДЕСЬ ПОДКЛЮЧАЮТСЯ ШРИФТЫ.
 *
 * Шрифты грузятся через next/font — Next скачивает их на этапе сборки и раздаёт
 * со своего домена. Внешних запросов к Google Fonts в рантайме нет.
 *
 * Каждый шрифт отдаёт CSS-переменную (variable). Сами переменные назначаются
 * на роли (заголовки / текст / цифры) в src/styles/tokens.css.
 *
 * ЧТОБЫ ДОБАВИТЬ НОВЫЙ ШРИФТ:
 *   1. импортируйте его из 'next/font/google' (имя = название семейства через _)
 *   2. заведите константу по образцу ниже со своей --font-* переменной
 *   3. добавьте её в массив fontVariables (в самом низу файла)
 *   4. назначьте переменную на роль в tokens.css
 */

import { Cormorant_Garamond, Jost } from 'next/font/google';

/** Антиква для заголовков. */
export const fontCormorant = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant',
});

/** Гротеск для основного текста и интерфейса. */
export const fontJost = Jost({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500'],
  display: 'swap',
  variable: '--font-jost',
});

/*
 * ПРИМЕР добавления третьего шрифта — под цифры, цены и площади.
 * Раскомментируйте, добавьте в fontVariables и укажите в tokens.css:
 *     --font-numeric: var(--font-manrope), system-ui, sans-serif;
 *
 * import { Manrope } from 'next/font/google';
 *
 * export const fontManrope = Manrope({
 *   subsets: ['latin', 'cyrillic'],
 *   weight: ['400', '500', '600'],
 *   display: 'swap',
 *   variable: '--font-manrope',
 * });
 */

/** Все подключённые шрифты. Классы вешаются на <html> в src/app/layout.tsx. */
export const fontVariables = [fontCormorant.variable, fontJost.variable].join(' ');
