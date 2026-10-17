'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useCity } from '@/config/city-context';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ImageSlot } from '@/components/ui/ImageSlot';
import styles from './LeadForm.module.css';

const benefits = [
  'ответим в мессенджере, если так удобнее',
  'выезд на объект в Москве и Сочи бесплатный',
  'не передаём контакты третьим лицам',
];

const cityOptions = ['Москва', 'Сочи', 'Московская область', 'Другой город'];
const objectOptions = ['Квартира', 'Дом', 'Апартаменты', 'Коммерческое помещение'];
const serviceOptions = [
  'Полный цикл: проект + ремонт + мебель',
  'Дизайн-проект',
  'Ремонт под ключ',
  'Комплектация',
  'Авторский надзор',
  'Пока не определились',
];
const channelOptions = ['Telegram', 'WhatsApp', 'Звонок', 'Email'];

/** Адрес приёма заявок в CRM (сервер в РФ). Задаётся при сборке. */
const LEAD_ENDPOINT = process.env.NEXT_PUBLIC_LEAD_ENDPOINT;

type Status = 'idle' | 'sending' | 'sent' | 'error';

/**
 * Форма заявки — главная точка захвата.
 *
 * Данные уходят POST-запросом (JSON) на NEXT_PUBLIC_LEAD_ENDPOINT — это
 * приёмник CRM LIME//OS. Пока адрес не задан, форма честно говорит,
 * что заявка не отправлена, и предлагает позвонить.
 */
export function LeadForm() {
  const city = useCity();
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;
    if (!LEAD_ENDPOINT) {
      setStatus('error');
      return;
    }
    const form = event.currentTarget;
    setStatus('sending');
    try {
      const response = await fetch(LEAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...Object.fromEntries(new FormData(form)),
          site: window.location.origin,
          page: window.location.pathname,
          consent: true,
        }),
      });
      if (!response.ok) throw new Error(String(response.status));
      form.reset();
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  return (
    <Section id="zayavka" bg="default" flush>
      <div className={styles.layout}>
        <div className={styles.content}>
          <Eyebrow>Заявка</Eyebrow>
          <h2 className={styles.title}>
            Расчёт стоимости
            <br />
            за один рабочий день
          </h2>
          <p className={styles.text}>
            Пришлём вилку по бюджету и срокам по вашему объекту, примеры похожих
            проектов и образец сметы. Без звонков «просто узнать, актуально ли».
          </p>

          <div className={styles.benefits}>
            {benefits.map((benefit) => (
              <span key={benefit} className={styles.benefit}>
                <span className={styles.benefitMark} aria-hidden="true">
                  —
                </span>
                {benefit}
              </span>
            ))}
          </div>

          <div className={styles.manager}>
            <div className={styles.managerPhoto}>
              <ImageSlot
                alt="Мария, основатель студии"
                label="Фото"
                circle
                sizes="56px"
              />
            </div>
            <div className={styles.managerInfo}>
              <span className={styles.managerName}>Мария, основатель студии</span>
              <span className={styles.managerRole}>разбирает заявки лично</span>
            </div>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <label className={styles.field}>
              <span className={styles.label}>Имя</span>
              <input
                type="text"
                name="name"
                required
                placeholder="Как к вам обращаться"
                className={styles.input}
              />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Телефон</span>
              <input
                type="tel"
                name="phone"
                required
                placeholder="+7 (___) ___-__-__"
                className={styles.input}
              />
            </label>
          </div>

          <div className={styles.row}>
            <label className={styles.field}>
              <span className={styles.label}>Город</span>
              <select name="city" className={styles.input}>
                {cityOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Тип объекта</span>
              <select name="objectType" className={styles.input}>
                {objectOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>

          <div className={styles.row}>
            <label className={styles.field}>
              <span className={styles.label}>Площадь, м²</span>
              <input
                type="number"
                name="area"
                min={1}
                placeholder="например, 96"
                className={styles.input}
              />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Услуга</span>
              <select name="service" className={styles.input}>
                {serviceOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>

          <label className={styles.field}>
            <span className={styles.label}>Куда удобнее ответить</span>
            <select name="channel" className={styles.input}>
              {channelOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>

          <Button
            type="submit"
            size="lg"
            fullWidth
            className={styles.submit}
          >
            {status === 'sending' ? 'Отправляем…' : 'Получить расчёт'}
          </Button>

          {status === 'sent' && (
            <p className={styles.success} role="status">
              Заявка отправлена — ответим в течение рабочего дня.
            </p>
          )}
          {status === 'error' && (
            <p className={styles.success} role="alert">
              Не удалось отправить заявку. Позвоните нам: {city.phone}
            </p>
          )}

          <p className={styles.consent}>
            Нажимая кнопку, вы соглашаетесь с{' '}
            <Link href="/politika-konfidencialnosti/" className={styles.consentLink}>
              политикой обработки данных
            </Link>
            .
          </p>
        </form>
      </div>
    </Section>
  );
}
