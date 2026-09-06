import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ImageSlot } from '@/components/ui/ImageSlot';
import { instagram } from '@/content/instagram';
import { site } from '@/config/site';
import styles from './InstagramFeed.module.css';

const telegram = site.social.find((item) => item.label === 'Telegram');

/**
 * Лента Instagram* на странице блога.
 *
 * Все превью — наши собственные файлы из /public/images/instagram/, никаких
 * запросов к серверам Meta. Поэтому лента одинаково видна и с VPN, и без него;
 * без VPN не откроются только сами ссылки на посты — об этом честно сказано
 * в подписи под лентой. Подробности — в комментарии к src/content/instagram.ts.
 */
export function InstagramFeed() {
  return (
    <Section bg="default">
      <div className={styles.header}>
        <div className={styles.heading}>
          <Eyebrow>{instagram.eyebrow}</Eyebrow>
          <h2 className={styles.title}>
            {instagram.title}
            <span className={styles.star} aria-hidden="true">
              *
            </span>
          </h2>
          <p className={styles.lead}>{instagram.lead}</p>
        </div>

        <Button href={instagram.profileUrl} variant="outline" size="sm" external>
          {instagram.handle}
        </Button>
      </div>

      <ul className={styles.grid}>
        {instagram.posts.map((post) => (
          <li key={post.id} className={styles.item}>
            <a
              href={post.href}
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className={styles.media}>
                <ImageSlot
                  src={post.image}
                  alt={post.alt}
                  label={post.label}
                  sizes="(max-width: 700px) 50vw, (max-width: 1000px) 33vw, 25vw"
                />
                {post.kind && <span className={styles.kind}>{post.kind}</span>}
              </div>
              <span className={styles.caption}>{post.caption}</span>
            </a>
          </li>
        ))}
      </ul>

      <div className={styles.note}>
        <p className={styles.noteText}>
          {instagram.vpnNote}
          {telegram && (
            <>
              {' '}
              <a
                href={telegram.href}
                className={styles.noteLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Открыть Telegram-канал →
              </a>
            </>
          )}
        </p>
        <p className={styles.disclaimer}>{instagram.disclaimer}</p>
      </div>
    </Section>
  );
}
