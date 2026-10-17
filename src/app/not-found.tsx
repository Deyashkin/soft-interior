import Link from 'next/link';

/** 404 вне страниц города (например, неизвестный адрес в /admin). */
export default function NotFound() {
  return (
    <main style={{ padding: '20vh 24px', textAlign: 'center' }}>
      <h1>Такой страницы нет</h1>
      <p>
        <Link href="/">На главную</Link>
      </p>
    </main>
  );
}
