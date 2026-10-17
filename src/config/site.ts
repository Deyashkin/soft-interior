/**
 * ОБЩИЕ НАСТРОЙКИ САЙТА: города, контакты, меню, реквизиты.
 *
 * Сайт живёт на двух адресах с одинаковой структурой:
 *   soft-interior.ru       — Москва и область (основной домен)
 *   sochi.soft-interior.ru — Сочи и побережье
 *
 * Оба адреса обслуживает одно приложение. Город определяет src/proxy.ts
 * по домену и переписывает адрес на /<город>/… — поэтому все страницы
 * лежат в src/app/[city]/ и получают город из params.
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
  /**
   * Координаты офиса для карты на странице контактов.
   * ВНИМАНИЕ: сейчас указаны приблизительные точки по названию улицы.
   * Перед публикацией замените на реальные — их видно в Яндекс.Картах
   * в адресной строке при клике по нужной точке.
   */
  coords: { lat: number; lon: number };
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
    coords: { lat: 55.7423, lon: 37.5943 },
    origin: 'https://soft-interior.ru',
  },
  sochi: {
    id: 'sochi',
    name: 'Сочи',
    locative: 'в Сочи',
    region: 'Сочи и побережье',
    phone: '+7 (862) 123-45-67',
    phoneHref: '+78621234567',
    address: 'ул. Навагинская, 9, офис 21',
    coords: { lat: 43.5854, lon: 39.7203 },
    origin: 'https://sochi.soft-interior.ru',
  },
};

export const cityIds = Object.keys(cities) as CityId[];

export function isCityId(value: string): value is CityId {
  return value in cities;
}

/** Второй город — для переключателя в шапке. */
export function otherCityOf(city: City): City {
  return cities[city.id === 'moscow' ? 'sochi' : 'moscow'];
}

/** Город по домену запроса. Всё, что не sochi.*, — Москва. */
export function cityIdFromHost(host: string | null): CityId {
  return host?.startsWith('sochi.') ? 'sochi' : 'moscow';
}

export const site = {
  name: 'Soft Interior',
  tagline: 'Пространства со смыслом',
  description:
    'Студия дизайна, ремонта и комплектации интерьеров. Проект, стройка и мебель в одном договоре — с фиксированной сметой и сроками.',
  email: 'hello@softinterior.ru',
  workingHours: '10:00–20:00',
  foundedYear: 2019,
  legal: 'ООО «Софт Интерьер», ИНН 7701234567',
  locale: 'ru_RU',
  social: [
    { label: 'Telegram', href: 'https://t.me/softinterior' },
    { label: 'Pinterest', href: 'https://pinterest.com/softinterior' },
    { label: 'YouTube', href: 'https://youtube.com/@softinterior' },
  ],
} as const;

/**
 * Главное меню. Порядок здесь = порядок в шапке.
 *
 * Пункт с `children` — это группа без собственной страницы: в шапке она
 * раскрывается подменю. «Услуги» существуют только как три отдельные
 * страницы, общей страницы-рубрики у них нет.
 */
export const mainNav = [
  {
    label: 'Услуги',
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
  { label: 'Публичная оферта', href: '/oferta/' },
  { label: 'Политика конфиденциальности', href: '/politika-konfidencialnosti/' },
  { label: 'Согласие на обработку данных', href: '/soglasie/' },
] as const;
