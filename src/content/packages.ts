/** Тарифные пакеты. Главная + страница /ceny/. */

export interface PackageFeature {
  label: string;
  /** false — пункт показывается приглушённым («не входит») */
  included?: boolean;
}

export interface Package {
  number: string;
  title: string;
  priceFrom: string;
  priceUnit: string;
  features: PackageFeature[];
  duration: string;
  /** Выделенный тариф — тёмная карточка с бейджем */
  featured?: boolean;
  badge?: string;
}

export const packages: Package[] = [
  {
    number: 'Пакет 01',
    title: 'Дизайн-проект',
    priceFrom: '3 500 ₽',
    priceUnit: '/ м²',
    features: [
      { label: 'Планировочные решения' },
      { label: 'Визуализации всех зон' },
      { label: 'Полный комплект чертежей' },
      { label: 'Ведомости отделки' },
      { label: 'Ремонт — отдельно', included: false },
      { label: 'Комплектация — отдельно', included: false },
    ],
    duration: 'Срок: 6–8 недель',
  },
  {
    number: 'Пакет 02',
    title: 'Проект + ремонт',
    priceFrom: '31 500 ₽',
    priceUnit: '/ м²',
    featured: true,
    badge: 'выбирают чаще',
    features: [
      { label: 'Всё из пакета 01' },
      { label: 'Черновые и чистовые работы' },
      { label: 'Инженерные системы' },
      { label: 'Прораб и авторский надзор' },
      { label: 'Фотоотчёт раз в неделю' },
      { label: 'Комплектация — отдельно', included: false },
    ],
    duration: 'Срок: 5–7 месяцев',
  },
  {
    number: 'Пакет 03',
    title: 'Полный цикл',
    priceFrom: '32 700 ₽',
    priceUnit: '/ м²',
    features: [
      { label: 'Всё из пакета 02' },
      { label: 'Подбор и закупка мебели' },
      { label: 'Логистика и сборка' },
      { label: 'Декор и текстиль' },
      { label: 'Финальный стайлинг и фотосъёмка' },
      { label: 'Передача объекта «с ключами»' },
    ],
    duration: 'Срок: 6–8 месяцев',
  },
];

export const packagesNote =
  'Мебель и материалы оплачиваются напрямую поставщикам — мы не добавляем наценку и отдаём вам партнёрские скидки.';
