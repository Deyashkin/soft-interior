import { Section } from '@/components/layout/Section';
import { advantages } from '@/content/home';
import styles from './Advantages.module.css';

/** Тёмная полоса доверия: договор, смета, сроки, гарантия. */
export function Advantages() {
  return (
    <Section bg="inverse" padding="none" flush>
      <div className={styles.grid}>
        {advantages.map((item) => (
          <div key={item.title} className={styles.item}>
            <span className={styles.title}>{item.title}</span>
            <p className={styles.text}>{item.text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
