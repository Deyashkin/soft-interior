'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useCity } from '@/config/city-context';
import { mainNav, otherCityOf, site } from '@/config/site';
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
  const city = useCity();
  const otherCity = otherCityOf(city);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoName}>{site.name}</span>
          <span className={styles.logoTagline}>{site.tagline}</span>
        </Link>

        <nav className={styles.nav} aria-label="Основное меню">
          {mainNav.map((item) =>
            'children' in item ? (
              <div
                key={item.label}
                className={styles.navGroup}
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <button
                  type="button"
                  className={styles.navLink}
                  aria-expanded={servicesOpen}
                  onClick={() => setServicesOpen((open) => !open)}
                >
                  {item.label}
                  <span className={styles.caret} aria-hidden="true">
                    ⌄
                  </span>
                </button>

                <div
                  className={cx(styles.dropdown, servicesOpen && styles.dropdownOpen)}
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={styles.dropdownLink}
                      onClick={() => setServicesOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link key={item.href} href={item.href} className={styles.navLink}>
                {item.label}
              </Link>
            ),
          )}
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
        {mainNav.map((item) =>
          'children' in item ? (
            <div key={item.label} className={styles.mobileGroup}>
              <span className={styles.mobileGroupTitle}>{item.label}</span>
              {item.children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className={styles.mobileSubLink}
                  onClick={() => setMenuOpen(false)}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className={styles.mobileLink}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ),
        )}

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
