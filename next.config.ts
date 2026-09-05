import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* Адреса со слешем на конце: /remont/ вместо /remont.
     Один вариант написания — меньше дублей в поиске. */
  trailingSlash: true,

  images: {
    /* Современные форматы вместо JPEG — меньше вес, выше скорость. */
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
