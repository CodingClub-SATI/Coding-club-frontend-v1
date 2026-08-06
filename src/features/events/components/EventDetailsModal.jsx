import { useEffect } from 'react';
import { Modal } from '@/components/shared/Modal';
import Tag from '@/components/shared/Tag';
import Button from '@/components/shared/Button';
import { eventsApi } from '../api';
import { TYPE_TONES } from '../constants';
import { formatDate } from '@/utils/date';
import styles from './EventDetailsModal.module.css';

export default function EventDetailsModal({ event, onClose }) {
  useEffect(() => {
    if (!event) return;
    // Fire the real detail fetch in the background purely to trigger the
    // backend's view-count increment (it dedupes per-IP over 12h on its
    // own). We deliberately keep rendering the already-fetched `event`
    // prop rather than swapping in this response, so the modal still
    // opens instantly instead of waiting on a network round trip.
    eventsApi.get(event.id).catch((err) => {
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
        <div>📅 {formatDate(event.date)}</div>
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
