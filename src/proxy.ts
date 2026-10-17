import { NextResponse, type NextRequest } from 'next/server';
import { cityIdFromHost } from '@/config/site';

/**
 * Один сервер — два сайта. По домену выбираем город и незаметно для
 * посетителя переписываем адрес: sochi.soft-interior.ru/remont/ →
 * /sochi/remont/. Адрес в браузере не меняется.
 *
 * Прямой заход на /moscow/… снаружи попадает в /moscow/moscow/… и
 * получает 404 — дублей страниц под двумя адресами нет.
 */
export function proxy(request: NextRequest) {
  const cityId = cityIdFromHost(request.headers.get('host'));
  const url = request.nextUrl.clone();
  url.pathname = `/${cityId}${url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    /* Всё, кроме админки, API, медиафайлов, служебных файлов Next.js
       и иконки сайта. */
    '/((?!admin|api|media|_next|icon\\.svg|favicon\\.ico).*)',
  ],
};
