'use client';

import { useState } from 'react';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { cities, currentCityId, type CityId } from '@/config/site';
import { cx } from '@/lib/cx';
import styles from './ContactMap.module.css';

const cityList = Object.values(cities);

/** Виджет Яндекс.Карт с меткой на офисе. */
function widgetUrl(lat: number, lon: number) {
  const point = `${lon},${lat}`;
  return `https://yandex.ru/map-widget/v1/?ll=${lon}%2C${lat}&z=16&pt=${point},pm2rdm`;
}

/** Полная карта — для маршрута в приложении Яндекса. */
function externalUrl(lat: number, lon: number) {
  return `https://yandex.ru/maps/?ll=${lon}%2C${lat}&z=16&pt=${lon},${lat}`;
}

/**
 * Карта офисов.
 *
 * Показываем один город за раз: два виджета грузили бы Яндекс.Карты дважды.
 * Сам iframe с loading="lazy" — карта ниже первого экрана и не тормозит
 * загрузку страницы.
 */
export function ContactMap() {
  const [active, setActive] = useState<CityId>(currentCityId);
  const city = cities[active];

  return (
    <Section bg="default">
      <div className={styles.header}>
        <div className={styles.heading}>
          <Eyebrow>На карте</Eyebrow>
          <h2 className={styles.title}>Где нас найти</h2>
        </div>

        <div className={styles.switch}>
          {cityList.map((item) => (
            <button
              key={item.id}
              type="button"
              className={cx(
                styles.switchButton,
                item.id === active && styles.switchActive,
              )}
              aria-pressed={item.id === active}
              onClick={() => setActive(item.id)}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.frame}>
        <iframe
          // key заставляет браузер перезагрузить виджет при смене города
          key={city.id}
          src={widgetUrl(city.coords.lat, city.coords.lon)}
          title={`Офис студии Soft Interior — ${city.name}, ${city.address}`}
          className={styles.map}
          loading="lazy"
          allowFullScreen
        />
      </div>

      <div className={styles.caption}>
        <p className={styles.address}>
          <span className={styles.addressCity}>{city.name}</span> — {city.address}
        </p>
        <Button
          href={externalUrl(city.coords.lat, city.coords.lon)}
          variant="link"
          external
        >
          Построить маршрут <span aria-hidden="true">→</span>
        </Button>
      </div>
    </Section>
  );
}
