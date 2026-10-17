# Образ сервера Next.js (output: 'standalone').
# Сборка `npm run build` идёт в GitHub Actions — здесь только упаковка готового
# .next/standalone, чтобы не собирать Next.js на сервере рядом с магазином.
#
# Debian (glibc), а не Alpine: бинарники sharp ставятся в CI на Ubuntu
# и должны совпадать по libc с образом.
FROM node:22-bookworm-slim

# ffmpeg — сжатие видео из админки; libheif-examples (heif-convert) —
# чтение фото HEIC с iPhone, которое не умеет готовая сборка sharp.
RUN apt-get update \
 && apt-get install -y --no-install-recommends ffmpeg libheif-examples \
 && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    NEXT_TELEMETRY_DISABLED=1 \
    MEDIA_DIR=/app/media

WORKDIR /app

COPY --chown=node:node .next/standalone ./
COPY --chown=node:node .next/static ./.next/static
COPY --chown=node:node public ./public
# Миграции базы: применяются при старте (src/instrumentation.ts).
COPY --chown=node:node drizzle ./drizzle

# Папка файлов из админки. На сервере сюда монтируется постоянный каталог
# (Coolify → Persistent Storage), иначе файлы пропадут при деплое.
RUN mkdir -p /app/media && chown node:node /app/media

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s \
  CMD node -e "fetch('http://127.0.0.1:3000/icon.svg').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
