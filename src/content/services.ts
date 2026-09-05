/** Три основные услуги. Используются на главной и в меню. */

export interface Service {
  slug: string;
  title: string;
  href: string;
  summary: string;
  bullets: string[];
  priceFrom: string;
  priceUnit: string;
  imageAlt: string;
}

export const services: Service[] = [
  {
    slug: 'dizayn-interyera',
    title: 'Дизайн интерьера',
    href: '/dizayn-interyera/',
    summary:
      'Планировки, 3D-визуализации и рабочая документация, по которой строят без вопросов.',
    bullets: [
      'обмеры и 2–4 варианта планировок',
      'визуализации всех помещений',
      '40+ листов чертежей',
    ],
    priceFrom: '3 500 ₽',
    priceUnit: '/ м²',
    imageAlt: 'Дизайн-проект интерьера',
  },
  {
    slug: 'remont',
    title: 'Ремонт под ключ',
    href: '/remont/',
    summary:
      'Своя бригада и прораб на объекте. Смета по позициям, фотоотчёт каждую неделю.',
    bullets: [
      'черновые и чистовые работы',
      'инженерия: электрика, вода, климат',
      'технадзор и приёмка по этапам',
    ],
    priceFrom: '28 000 ₽',
    priceUnit: '/ м²',
    imageAlt: 'Ремонт квартиры под ключ',
  },
  {
    slug: 'komplektaciya',
    title: 'Комплектация',
    href: '/komplektaciya/',
    summary:
      'Мебель, свет, сантехника и декор: подбор, закупка, логистика, сборка и расстановка.',
    bullets: [
      'спецификация с ценами и сроками',
      'скидки поставщиков переходят вам',
      'приёмка и хранение до монтажа',
    ],
    priceFrom: '1 200 ₽',
    priceUnit: '/ м²',
    imageAlt: 'Комплектация интерьера мебелью',
  },
];

/** Дополнительные услуги — строка под карточками. */
export const extraServices = [
  { title: 'авторский надзор', price: '45 000 ₽/мес' },
  { title: 'консультация дизайнера', price: '12 000 ₽ / 2 часа' },
];
