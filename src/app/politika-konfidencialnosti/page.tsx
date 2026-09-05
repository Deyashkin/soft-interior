import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { PageHero } from '@/components/sections/PageHero';
import { Prose } from '@/components/sections/Prose';
import { site } from '@/config/site';

export const metadata: Metadata = {
  title: 'Политика конфиденциальности',
  description:
    'Как студия Soft Interior обрабатывает и защищает персональные данные посетителей сайта.',
  alternates: { canonical: '/politika-konfidencialnosti/' },
  robots: { index: false, follow: true },
};

/** Черновик документа — текст должен утвердить юрист перед публикацией. */
export default function PrivacyPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          {
            name: 'Политика конфиденциальности',
            href: '/politika-konfidencialnosti/',
          },
        ]}
      />

      <PageHero
        eyebrow="Документы"
        title="Политика конфиденциальности"
        lead={`Документ описывает, какие данные собирает сайт ${site.name} и как они используются.`}
      />

      <Prose>
        <h2>1. Какие данные мы собираем</h2>
        <p>
          Через форму заявки: имя, номер телефона, город, тип объекта, площадь и
          предпочтительный способ связи. Автоматически: обезличенные данные
          посещений через системы веб-аналитики.
        </p>

        <h2>2. Зачем они нужны</h2>
        <p>
          Чтобы связаться с вами по заявке, подготовить расчёт стоимости и вести
          переписку по проекту. Мы не передаём контакты третьим лицам и не
          используем их для рассылок без отдельного согласия.
        </p>

        <h2>3. Как связаться</h2>
        <p>
          По вопросам обработки данных пишите на{' '}
          <a href={`mailto:${site.email}`}>{site.email}</a>. По запросу удалим ваши
          данные из базы.
        </p>

        <p>
          Текст документа — черновик. Перед публикацией сайта его нужно привести в
          соответствие с 152-ФЗ и утвердить у юриста.
        </p>
      </Prose>
    </>
  );
}
