import { useEffect } from 'react';
import { Modal } from '@/components/shared/Modal';
import Tag from '@/components/shared/Tag';
import Button from '@/components/shared/Button';
import { eventsApi } from '../api';
import { TYPE_TONES } from '../constants';
import styles from './EventDetailsModal.module.css';

export default function EventDetailsModal({ event, onClose }) {
  useEffect(() => {
    if (!event) return;
    eventsApi.trackView(event.id).catch((err) => {
      console.error('Failed to record event view:', err);
    });
  }, [event]);

  if (!event) return null;

  const handleRegisterClick = () => {
    eventsApi.trackRegisterClick(event.id).catch((err) => {
      console.error('Failed to record registration click:', err);
    });
  };

  return (
    <Modal title={event.title} onClose={onClose} size="md" variant="glow">
      {event.bannerUrl && (
        <img className={styles.poster} src={event.bannerUrl} alt={event.title} />
      )}
      <div className={styles.header}>
        {event.logoUrl && <img className={styles.logo} src={event.logoUrl} alt="" aria-hidden="true" />}
        <Tag tone={TYPE_TONES[event.type] || 'accent'}>{event.type}</Tag>
        {event.status === 'upcoming' && <Tag tone="accent">Upcoming</Tag>}
      </div>
      <div className={styles.meta}>
        <div>📅 {event.date}</div>
        <div>🕐 {event.time}</div>
        {event.reportingTime && <div>⏰ Reporting: {event.reportingTime}</div>}
        <div>📍 {event.venue}</div>
      </div>
      <p className={styles.desc}>{event.description}</p>
      {event.tags?.length > 0 && (
        <div className={styles.tags}>
          {event.tags.map((tag) => <Tag key={tag} tone="secondary">{tag}</Tag>)}
        </div>
      )}
      {event.registrationLink && (
        <Button
          Component="a"
          href={event.registrationLink}
          target="_blank"
          rel="noreferrer"
          className={styles.registerBtn}
          onClick={handleRegisterClick}
        >
          Register for this Event →
        </Button>
      )}
    </Modal>
  );
}
