'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { city, mainNav, otherCity, site } from '@/config/site';
import { cx } from '@/lib/cx';
import styles from './Header.module.css';

/**
 * Шапка сайта.
 *
 * Переключатель города физически ведёт на другой поддомен —
 * так страницы Москвы и Сочи не конкурируют в выдаче.
 * Адреса поддоменов заданы в src/config/site.ts.
 */
export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoName}>{site.name}</span>
          <span className={styles.logoTagline}>{site.tagline}</span>
        </Link>

        <nav className={styles.nav} aria-label="Основное меню">
          {mainNav.map((item) => (
            <Link key={item.href} href={item.href} className={styles.navLink}>
              {item.label}
              {'children' in item && <span className={styles.caret}>⌄</span>}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <a
            href={otherCity.origin}
            className={styles.cityToggle}
            title={`Перейти на сайт: ${otherCity.name}`}
          >
            <span className={styles.cityDot} aria-hidden="true" />
            <span>{city.name}</span>
            <span aria-hidden="true">⌄</span>
          </a>

          <div className={styles.contact}>
            <a href={`tel:${city.phoneHref}`} className={styles.phone}>
              {city.phone}
            </a>
            <span className={styles.hours}>{site.workingHours}</span>
          </div>

          <Button href="/#zayavka" size="sm">
            Обсудить проект
          </Button>
        </div>

        <button
          type="button"
          className={cx(styles.burger, menuOpen && styles.burgerOpen)}
          aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className={styles.burgerLine} />
          <span className={styles.burgerLine} />
          <span className={styles.burgerLine} />
        </button>
      </div>

      <div className={cx(styles.mobileMenu, menuOpen && styles.mobileMenuOpen)}>
        {mainNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={styles.mobileLink}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </Link>
        ))}

        <div className={styles.mobileFooter}>
          <a href={`tel:${city.phoneHref}`} className={styles.phone}>
            {city.phone}
          </a>
          <a href={otherCity.origin} className={styles.cityToggle}>
            <span className={styles.cityDot} aria-hidden="true" />
            <span>Перейти в город: {otherCity.name}</span>
          </a>
          <Button href="/#zayavka" size="sm" fullWidth>
            Обсудить проект
          </Button>
        </div>
      </div>
    </header>
  );
}
