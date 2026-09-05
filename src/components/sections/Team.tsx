import { Section } from '@/components/layout/Section';
import { ImageSlot } from '@/components/ui/ImageSlot';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { team, teamIntro } from '@/content/team';
import styles from './Team.module.css';

/** Команда, которая ведёт объект. */
export function Team() {
  return (
    <Section bg="sunken">
      <SectionHeader
        eyebrow="Команда"
        title={
          <>
            Люди, которые ведут
            <br />
            ваш объект
          </>
        }
        text={teamIntro}
      />

      <div className={styles.grid}>
        {team.map((member) => (
          <article key={member.name} className={styles.member}>
            <div className={styles.photo}>
              <ImageSlot
                alt={`${member.name} — ${member.role}`}
                label="Фото"
                sizes="(max-width: 560px) 100vw, (max-width: 1000px) 50vw, 25vw"
              />
            </div>
            <div className={styles.info}>
              <h3 className={styles.name}>{member.name}</h3>
              <span className={styles.role}>{member.role}</span>
              <p className={styles.bio}>{member.bio}</p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
