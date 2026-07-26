import Glasscard from '@/components/shared/Glasscard';
import Button from '@/components/shared/Button';
import MemberAvatar from './MemberAvatar';
import styles from './MemberCard.module.css';

export default function MemberCard({ member, onClick }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(member);
    }
  };

  return (
    <Glasscard
      className={styles.memberCard}
      onClick={() => onClick(member)}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`View ${member.name}'s profile`}
    >
      <MemberAvatar member={member} />
      <h3 className={styles.name}>{member.name}</h3>
      <p className={styles.role}>{member.role}</p>
      {/* Decorative only — rendered as a span (not a real button) so the
          whole card stays a single keyboard/screen-reader stop, not two. */}
      <Button Component="span" variant="outline" size="sm" className={styles.viewBtn} aria-hidden="true">
        View Profile
      </Button>
    </Glasscard>
  );
}
