# Деплой soft-interior

Сайт — статика (`output: 'export'`), серверной части нет.

## Как это работает

1. Push в `main` → GitHub Actions (`.github/workflows/deploy.yml`) собирает сайт
   дважды (`NEXT_PUBLIC_CITY=moscow|sochi`), упаковывает `out/` в nginx-образ
   и пушит в GHCR:
   - `ghcr.io/deyashkin/soft-interior-moscow:latest`
   - `ghcr.io/deyashkin/soft-interior-sochi:latest`
2. Coolify (deploy.lime-os.ru) тянет образ из GHCR и перезапускает контейнер.
3. Прокси Coolify выпускает Let's Encrypt и отдаёт сайт наружу (80/443).

## Настройка один раз

GitHub → Settings → Variables → Actions:
- `LEAD_ENDPOINT` — URL приёма заявок CRM LIME//OS (после фазы 02).
  Пока пуст: форма показывает «не удалось отправить, позвоните».

Coolify → New resource → Docker Image (по одному на город):
- image `ghcr.io/deyashkin/soft-interior-moscow`, tag `latest`, порт 80;
- домен `msk.softinterior.ru`;
- реестр GHCR: если пакет приватный — добавить PAT с `read:packages`;
- Webhook деплоя вставить в конец workflow (шаг `curl`) — либо включить
  автообновление по расписанию.

## Перенос домена

0. Заранее (за 1–2 дня): снизить TTL записей до 300 с.
1. Выложить оба контейнера в Coolify, проверить по временным адресам
   (`curl --resolve msk.softinterior.ru:443:153.76.169.48 …` или hosts) —
   все страницы, `/sitemap.xml`, `/robots.txt`, 404.
2. Заменить в `src/config/site.ts` плейсхолдеры (телефоны, адреса, ИНН,
   email, соцсети) — иначе в прод уйдут тестовые данные.
3. Переключить A-записи `msk` и `sochi` на 153.76.169.48 (AAAA удалить,
   если указывают на Vercel). Coolify выпустит сертификат на 80-м порту —
   сначала DNS, потом домен в Coolify.
4. Проверить https, редиректы `/x` → `/x/`, Яндекс.Вебмастер: переиндексация
   sitemap. Если был старый домен/адреса — 301 с них на новые.
5. Vercel держать ещё 3–7 дней как откат (вернуть DNS), затем удалить проект.

## Заявки и ПДн

Форма отправляет данные только на `LEAD_ENDPOINT`, который должен быть на
сервере в РФ. Сторонних сервисов (аналитика, шрифты, капча) на сайте нет:
шрифты скачиваются при сборке и раздаются со своего домена.
