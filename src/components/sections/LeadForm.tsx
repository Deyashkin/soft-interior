'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
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

/**
 * Форма заявки — главная точка захвата.
 *
 * Сейчас отправка только имитируется. Чтобы подключить приём заявок,
 * замените тело handleSubmit на запрос к своему API или CRM.
 */
export function LeadForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <Section id="zayavka" bg="default" padding="none" flush>
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

          <Button type="submit" size="lg" fullWidth className={styles.submit}>
            Получить расчёт
          </Button>

          {sent && (
            <p className={styles.success} role="status">
              Заявка отправлена — ответим в течение рабочего дня.
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
