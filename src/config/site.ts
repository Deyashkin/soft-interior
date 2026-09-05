/**
 * ОБЩИЕ НАСТРОЙКИ САЙТА: города, контакты, меню, реквизиты.
 *
 * По плану из макета сайт живёт на двух поддоменах с одинаковой структурой:
 *   msk.softinterior.ru   — Москва и область
 *   sochi.softinterior.ru — Сочи и побережье
 *
 * Какой город собирается — определяет переменная окружения NEXT_PUBLIC_CITY
 * (значения: moscow | sochi). См. файл .env.local.
 */

export type CityId = 'moscow' | 'sochi';

export interface City {
  id: CityId;
  /** Именительный падеж: «Москва» */
  name: string;
  /** Предложный падеж для заголовков: «в Москве» */
  locative: string;
  /** Подпись региона в переключателе */
  region: string;
  phone: string;
  phoneHref: string;
  address: string;
  /** Полный адрес поддомена — на него ведёт переключатель городов */
  origin: string;
}

export const cities: Record<CityId, City> = {
  moscow: {
    id: 'moscow',
    name: 'Москва',
    locative: 'в Москве',
    region: 'Москва и МО',
    phone: '+7 (495) 123-45-67',
    phoneHref: '+74951234567',
    address: 'ул. Пречистенка, 12, офис 4',
    origin: 'https://msk.softinterior.ru',
  },
  sochi: {
    id: 'sochi',
    name: 'Сочи',
    locative: 'в Сочи',
    region: 'Сочи и побережье',
    phone: '+7 (862) 123-45-67',
    phoneHref: '+78621234567',
    address: 'ул. Навагинская, 9, офис 21',
    origin: 'https://sochi.softinterior.ru',
  },
};

/** Город текущей сборки. */
export const currentCityId: CityId =
  (process.env.NEXT_PUBLIC_CITY as CityId) === 'sochi' ? 'sochi' : 'moscow';

export const city = cities[currentCityId];

/** Второй город — для переключателя в шапке. */
export const otherCity = cities[currentCityId === 'moscow' ? 'sochi' : 'moscow'];

export const site = {
  name: 'Soft Interior',
  tagline: 'Пространства со смыслом',
  description:
    'Студия дизайна, ремонта и комплектации интерьеров. Проект, стройка и мебель в одном договоре — с фиксированной сметой и сроками.',
  email: 'hello@softinterior.ru',
  workingHours: '10:00–20:00',
  foundedYear: 2019,
  legal: 'ООО «Софт Интерьер», ИНН 7701234567',
  url: city.origin,
  locale: 'ru_RU',
  social: [
    { label: 'Telegram', href: 'https://t.me/softinterior' },
    { label: 'Pinterest', href: 'https://pinterest.com/softinterior' },
    { label: 'YouTube', href: 'https://youtube.com/@softinterior' },
  ],
} as const;

/** Главное меню. Порядок здесь = порядок в шапке. */
export const mainNav = [
  {
    label: 'Услуги',
    href: '/dizayn-interyera/',
    children: [
      { label: 'Дизайн интерьера', href: '/dizayn-interyera/' },
      { label: 'Ремонт под ключ', href: '/remont/' },
      { label: 'Комплектация', href: '/komplektaciya/' },
    ],
  },
  { label: 'Проекты', href: '/projects/' },
  { label: 'Цены', href: '/ceny/' },
  { label: 'О студии', href: '/o-studii/' },
  { label: 'Блог', href: '/blog/' },
  { label: 'Контакты', href: '/kontakty/' },
] as const;

/** Колонки меню в подвале. */
export const footerNav = [
  {
    title: 'Услуги',
    links: [
      { label: 'Дизайн интерьера', href: '/dizayn-interyera/' },
      { label: 'Ремонт под ключ', href: '/remont/' },
      { label: 'Комплектация', href: '/komplektaciya/' },
      { label: 'Авторский надзор', href: '/dizayn-interyera/' },
      { label: 'Цены и пакеты', href: '/ceny/' },
    ],
  },
  {
    title: 'Студия',
    links: [
      { label: 'Проекты', href: '/projects/' },
      { label: 'О студии и команда', href: '/o-studii/' },
      { label: 'Отзывы', href: '/o-studii/' },
      { label: 'Блог', href: '/blog/' },
      { label: 'Контакты', href: '/kontakty/' },
    ],
  },
] as const;

export const legalNav = [
  { label: 'Политика конфиденциальности', href: '/politika-konfidencialnosti/' },
  { label: 'Согласие на обработку данных', href: '/soglasie/' },
] as const;
