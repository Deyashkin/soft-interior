import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* Сервер Next.js в Docker: сборка кладёт в .next/standalone всё нужное
     для запуска без node_modules (см. Dockerfile). */
  output: 'standalone',

  /* Адреса со слешем на конце: /remont/ вместо /remont.
     Один вариант написания — меньше дублей в поиске. */
  trailingSlash: true,

  images: {
    /* Фото из админки сжимаются один раз при загрузке (несколько размеров
       AVIF/WebP), поэтому встроенный оптимизатор на лету не нужен. */
    unoptimized: true,
  },
};

export default nextConfig;
