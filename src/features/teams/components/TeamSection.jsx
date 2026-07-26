import MemberCard from './MemberCard';
import styles from './TeamSection.module.css';

export default function TeamSection({ title, members, onSelectMember }) {
  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <span className={styles.line} aria-hidden="true" />
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.line} aria-hidden="true" />
      </div>
      <div className={styles.grid}>
        {members.map((member) => (
          <MemberCard key={member.id} member={member} onClick={onSelectMember} />
        ))}
      </div>
    </div>
  );
}
