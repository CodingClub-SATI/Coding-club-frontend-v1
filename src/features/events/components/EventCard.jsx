import Glasscard from '@/components/shared/Glasscard';
import Tag from '@/components/shared/Tag';
import Button from '@/components/shared/Button';
import { TYPE_TONES } from '../constants';
import styles from './EventCard.module.css';

const TYPE_ICONS = {
  Hackathon: <path d="M13 10V3L4 14h7v7l9-11h-7z" />,
  Workshop: (
    <>
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3-3a1 1 0 000-1.4l-1.6-1.6a1 1 0 00-1.4 0l-3 3z" />
      <path d="M5 21l8.5-8.5M14 8L10 12" />
    </>
  ),
  Competition: (
    <>
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
    </>
  ),
  Seminar: (
    <>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </>
  ),
};

export default function EventCard({ event, onClick }) {
  // Enables keyboard users to activate the card with Enter or Space
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(event);
    }
  };

  return (
    <Glasscard
      className={styles.eventCard}
      onClick={() => onClick(event)}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`View details for ${event.title}`}
    >
      <div className={styles.cover}>
        <div className={styles.coverIcon}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {TYPE_ICONS[event.type]}
          </svg>
        </div>
        <Tag tone={TYPE_TONES[event.type] || 'accent'} className={styles.typeTag}>{event.type}</Tag>
        {event.status === 'upcoming' && (
          <Tag tone="accent" className={styles.upcomingBadge}>Upcoming</Tag>
        )}
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{event.title}</h3>
        <div className={styles.meta}>
          <span>📅 {event.date}</span>
          <span>🕐 {event.time}</span>
        </div>
        <div className={styles.meta}><span>📍 {event.venue}</span></div>
        <p className={styles.desc}>{event.description}</p>
        <div className={styles.tags}>
          {event.tags.map((tag) => (
            <Tag key={tag} tone="accent" className={styles.cardTag}>{tag}</Tag>
          ))}
        </div>
        <Button Component="span" className={styles.viewBtn} aria-hidden="true">
          View Details →
        </Button>
      </div>
    </Glasscard>
  );
}