# Образ статического сайта: nginx раздаёт готовую папку out/.
# Сборка Next.js идёт в GitHub Actions (npm run build) — здесь только упаковка.
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY out /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
