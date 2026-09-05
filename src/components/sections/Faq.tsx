import { Section } from '@/components/layout/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { faq } from '@/content/faq';
import styles from './Faq.module.css';

/**
 * Частые вопросы.
 *
 * Сделано на нативных <details>/<summary>: раскрывается без JavaScript,
 * а весь текст ответов сразу присутствует в HTML — поисковик его видит.
 * Микроразметка FAQPage добавляется отдельно, в JsonLd.
 */
export function Faq() {
  return (
    <Section bg="sunken" padding="sm">
      <div className={styles.layout}>
        <div className={styles.intro}>
          <Eyebrow>Вопросы</Eyebrow>
          <h2 className={styles.title}>
            Спрашивают
            <br />
            чаще всего
          </h2>
          <p className={styles.introText}>
            Не нашли ответ — напишите в Telegram, отвечаем в течение часа в рабочее
            время.
          </p>
        </div>

        <div className={styles.list}>
          {faq.map((item, index) => (
            <details
              key={item.question}
              className={styles.item}
              open={index === 0}
              name="faq"
            >
              <summary className={styles.question}>
                <span>{item.question}</span>
                <span className={styles.sign} aria-hidden="true" />
              </summary>
              <p className={styles.answer}>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}
