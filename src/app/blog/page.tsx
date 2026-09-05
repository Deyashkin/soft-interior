import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Section } from '@/components/layout/Section';
import { PageHero } from '@/components/sections/PageHero';
import { LeadForm } from '@/components/sections/LeadForm';

export const metadata: Metadata = {
  title: 'Блог студии Soft Interior — о дизайне, ремонте и бюджетах',
  description:
    'Статьи о том, как устроен ремонт под ключ: из чего складывается смета, сколько длится проект, как выбрать материалы и не переплатить.',
  alternates: { canonical: '/blog/' },
};

/**
 * Заготовка блога.
 * Когда появятся статьи — заведите src/content/posts.ts и роут
 * src/app/blog/[slug]/page.tsx по образцу /projects/[slug]/.
 */
export default function BlogPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: 'Блог', href: '/blog/' }]} />

      <PageHero
        eyebrow="Блог"
        title="Как устроены дизайн и ремонт изнутри"
        lead="Разбираем сметы, сроки и типичные ошибки на реальных объектах. Первые статьи готовим."
      />

      <Section bg="raised">
        <p>Материалы появятся здесь в ближайшее время.</p>
      </Section>

      <LeadForm />
    </>
  );
}
