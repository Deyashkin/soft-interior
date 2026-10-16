# Деплой soft-interior

Сайт — статика (`output: 'export'`), серверной части нет. Живёт на VDS
153.76.169.48 (1VDS, Москва), выкладывается через Coolify (deploy.lime-os.ru).

| Адрес | Сборка | Приложение в Coolify |
|---|---|---|
| `soft-interior.ru` (+ `www` → редирект) | `NEXT_PUBLIC_CITY=moscow` | `soft-interior-msk` |
| `sochi.soft-interior.ru` | `NEXT_PUBLIC_CITY=sochi` | `soft-interior-sochi` |

## Как это работает

1. Push в `main` → GitHub Actions (`.github/workflows/deploy.yml`) собирает сайт
   дважды (moscow, sochi), упаковывает `out/` в nginx-образ и пушит в GHCR:
   - `ghcr.io/deyashkin/soft-interior-moscow:latest`
   - `ghcr.io/deyashkin/soft-interior-sochi:latest`
2. Последний шаг workflow вызывает Deploy Webhook Coolify (POST), Coolify
   скачивает новый `latest` и перезапускает контейнер. От пуша до сайта ~2 мин.
3. Прокси Coolify (Traefik) выпускает Let's Encrypt и отдаёт сайт на 80/443.

## Что уже настроено

- Сервер вошёл в GHCR от root (`docker login ghcr.io`, PAT `read:packages`,
  истекает 14.01.2027 — до этой даты выпустить новый и повторить вход).
- Секреты репозитория: `COOLIFY_TOKEN`, `COOLIFY_WEBHOOK_MSK`,
  `COOLIFY_WEBHOOK_SOCHI`.
- SSH на сервер: `ssh -i ~/.ssh/lime_vds deploy@153.76.169.48`
  (root по ключу закрыт, у `deploy` есть sudo).

Позже: GitHub → Settings → Variables → Actions → `LEAD_ENDPOINT` — URL приёма
заявок CRM LIME//OS. Пока пуст, форма пишет «не удалось отправить, позвоните».

## Подключение домена

DNS домена обслуживает Timeweb (ns1–ns4.timeweb). До подключения у домена не
было A-записей, сайт нигде не работал — переносить и откатывать нечего.

1. Timeweb → Домены → soft-interior.ru → DNS: A-записи на 153.76.169.48 для
   `@`, `www`, `sochi`. Записи AAAA не создавать (IPv6 на сервере нет).
2. Дождаться, пока `nslookup soft-interior.ru 8.8.8.8` вернёт 153.76.169.48.
3. Coolify → `soft-interior-msk` → Domains:
   `https://soft-interior.ru,https://www.soft-interior.ru`, редирект на
   вариант без www. `soft-interior-sochi` → `https://sochi.soft-interior.ru`.
   Save → Redeploy. Сертификаты выпускаются по HTTP, поэтому порядок именно
   такой: сначала DNS, потом домен в Coolify.
4. Проверить https, редирект www и `/x` → `/x/`, `/sitemap.xml`, `/robots.txt`.
5. Яндекс.Вебмастер и Google Search Console: добавить сайт, отправить sitemap.

## Заявки и ПДн

Форма отправляет данные только на `LEAD_ENDPOINT`, который должен быть на
сервере в РФ. На странице контактов — карта Яндекса (iframe). Других внешних
сервисов нет: шрифты скачиваются при сборке и раздаются со своего домена.
