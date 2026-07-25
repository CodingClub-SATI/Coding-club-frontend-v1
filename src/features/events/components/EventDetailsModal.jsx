import { Modal } from '@/components/shared/Modal';
import Tag from '@/components/shared/Tag';
import Button from '@/components/shared/Button';
import styles from './EventDetailsModal.module.css';

const TYPE_TONES = {
  Hackathon: 'secondary',
  Workshop: 'accent',
  Competition: 'primary',
  Seminar: 'accent',
};

export default function EventDetailsModal({ event, onClose }) {
  if (!event) return null;

  return (
    <Modal title={event.title} onClose={onClose} size="md" variant="glow">
      <div className={styles.header}>
        <Tag tone={TYPE_TONES[event.type] || 'accent'}>{event.type}</Tag>
        {event.status === 'upcoming' && <Tag tone="accent">Upcoming</Tag>}
      </div>
      <div className={styles.meta}>
        <div>📅 {event.date}</div>
        <div>🕐 {event.time}</div>
        <div>📍 {event.venue}</div>
      </div>
      <p className={styles.desc}>{event.description}</p>
      <div className={styles.tags}>
        {event.tags.map((tag) => <Tag key={tag} tone="secondary">{tag}</Tag>)}
      </div>
      {event.registrationLink && (
        <Button Component="a" href={event.registrationLink} target="_blank" rel="noreferrer" className={styles.registerBtn}>
          Register for this Event →
        </Button>
      )}
    </Modal>
  );
}
