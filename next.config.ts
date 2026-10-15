import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* Статическая сборка: на сервер уезжает папка out/ (nginx в контейнере).
     Серверной части у сайта нет — заявки уходят прямо в CRM. */
  output: 'export',

  /* Адреса со слешем на конце: /remont/ вместо /remont.
     Один вариант написания — меньше дублей в поиске. */
  trailingSlash: true,

  images: {
    /* При output: 'export' нет сервера-оптимизатора картинок, поэтому
       фото нужно класть в /public уже сжатыми (WebP/AVIF, до 1600 px). */
    unoptimized: true,
  },
};

export default nextConfig;
