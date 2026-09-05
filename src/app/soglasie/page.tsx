import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { PageHero } from '@/components/sections/PageHero';
import { Prose } from '@/components/sections/Prose';
import { site } from '@/config/site';

export const metadata: Metadata = {
  title: 'Согласие на обработку персональных данных',
  description:
    'Условия согласия на обработку персональных данных при отправке заявки через сайт студии Soft Interior.',
  alternates: { canonical: '/soglasie/' },
  robots: { index: false, follow: true },
};

/** Черновик документа — текст должен утвердить юрист перед публикацией. */
export default function ConsentPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: 'Согласие на обработку данных', href: '/soglasie/' },
        ]}
      />

      <PageHero
        eyebrow="Документы"
        title="Согласие на обработку персональных данных"
        lead="Отправляя форму на сайте, вы подтверждаете согласие на обработку указанных данных."
      />

      <Prose>
        <p>
          Отправляя заявку, вы даёте согласие {site.legal} на обработку
          персональных данных: сбор, запись, хранение, уточнение, использование и
          удаление.
        </p>

        <h2>Срок действия</h2>
        <p>
          Согласие действует до его отзыва. Отозвать можно письмом на{' '}
          <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>

        <p>
          Текст документа — черновик. Перед публикацией сайта его нужно привести в
          соответствие с 152-ФЗ и утвердить у юриста.
        </p>
      </Prose>
    </>
  );
}
