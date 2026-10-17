import { notFound } from 'next/navigation';

/**
 * Любой неизвестный адрес внутри города — 404 с шапкой и подвалом сайта
 * (src/app/[city]/not-found.tsx), а не голая общая страница ошибки.
 */
export default function UnknownPage() {
  notFound();
}
