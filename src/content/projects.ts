/** Портфолио. Кейсы на главной и страницы /projects/[slug]/. */

export interface ProjectMeta {
  label: string;
  value: string;
}

export interface Project {
  slug: string;
  eyebrow: string;
  title: string;
  summary: string;
  meta: ProjectMeta[];
  city: 'Москва' | 'Сочи';
  /** Оформление карточки поверх фото на главной */
  theme: 'light' | 'dark';
  align: 'left' | 'right';
  /** Дополнительные кадры под главным фото */
  gallery: string[];
}

export const projects: Project[] = [
  {
    slug: 'prime-park',
    eyebrow: 'Кейс 01 · Проект + ремонт + комплектация',
    title: 'Квартира в ЖК «Прайм Парк»',
    summary:
      'Семья с двумя детьми переезжала из «двушки». Собрали 4 сценария планировки, ушли от коридоров и получили полноценную детскую и кабинет.',
    meta: [
      { label: 'Город', value: 'Москва' },
      { label: 'Площадь', value: '128 м²' },
      { label: 'Срок', value: '7 месяцев' },
      { label: 'Год', value: '2025' },
    ],
    city: 'Москва',
    theme: 'light',
    align: 'left',
    gallery: ['Кейс 01 — кадр 2', 'Кейс 01 — кадр 3', 'Кейс 01 — планировка'],
  },
  {
    slug: 'apartamenty-u-morya',
    eyebrow: 'Кейс 02 · Проект + комплектация',
    title: 'Апартаменты у моря, Сочи',
    summary:
      'Объект под сдачу: нужен был интерьер, который переживёт поток гостей и хорошо смотрится на фото. Все материалы — с запасом по износу.',
    meta: [
      { label: 'Город', value: 'Сочи' },
      { label: 'Площадь', value: '64 м²' },
      { label: 'Срок', value: '4 месяца' },
      { label: 'Год', value: '2026' },
    ],
    city: 'Сочи',
    theme: 'dark',
    align: 'right',
    gallery: [],
  },
];

/** Фильтры над портфолио. */
export const projectFilters = ['Все', 'Москва', 'Сочи', 'Квартиры', 'Дома'];

export const projectsTotal = 64;
