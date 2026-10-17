# Образ сервера Next.js (output: 'standalone').
# Сборка `npm run build` идёт в GitHub Actions — здесь только упаковка готового
# .next/standalone, чтобы не собирать Next.js на сервере рядом с магазином.
#
# Debian (glibc), а не Alpine: бинарники sharp ставятся в CI на Ubuntu
# и должны совпадать по libc с образом.
FROM node:22-bookworm-slim

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

COPY --chown=node:node .next/standalone ./
COPY --chown=node:node .next/static ./.next/static
COPY --chown=node:node public ./public

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s \
  CMD node -e "fetch('http://127.0.0.1:3000/icon.svg').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
