import Link from 'next/link';
import { Section } from './Section';
import { cities, footerNav, legalNav, site } from '@/config/site';
import styles from './Footer.module.css';

/** Подвал: навигация, контакты обоих городов, реквизиты. */
export function Footer() {
  return (
    <Section as="footer" bg="inverse" padding="sm">
      <div className={styles.top}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoName}>{site.name}</span>
            <span className={styles.logoTagline}>{site.tagline}</span>
          </Link>
          <p className={styles.about}>
            Студия дизайна, ремонта и комплектации интерьеров. Москва · Сочи.
          </p>
          <div className={styles.social}>
            {site.social.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={styles.socialLink}
                rel="noopener noreferrer"
                target="_blank"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {footerNav.map((column) => (
          <nav key={column.title} className={styles.column} aria-label={column.title}>
            <span className={styles.columnTitle}>{column.title}</span>
            {column.links.map((link) => (
              <Link key={link.label} href={link.href} className={styles.columnLink}>
                {link.label}
              </Link>
            ))}
          </nav>
        ))}

        <div className={styles.contacts}>
          {Object.values(cities).map((item) => (
            <div key={item.id} className={styles.contactBlock}>
              <span className={styles.contactCity}>{item.name}</span>
              <a href={`tel:${item.phoneHref}`} className={styles.contactPhone}>
                {item.phone}
              </a>
              <span className={styles.contactAddress}>{item.address}</span>
            </div>
          ))}
          <a href={`mailto:${site.email}`} className={styles.email}>
            {site.email}
          </a>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>
          © {new Date().getFullYear()} {site.name}. {site.legal}
        </span>
        <div className={styles.legal}>
          {legalNav.map((link) => (
            <Link key={link.href} href={link.href} className={styles.legalLink}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </Section>
  );
}
