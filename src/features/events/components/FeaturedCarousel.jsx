import { useState } from 'react';
import Glasscard from '@/components/shared/Glasscard';
import Tag from '@/components/shared/Tag';
import Button from '@/components/shared/Button';
import styles from './FeaturedCarousel.module.css';

export default function FeaturedCarousel({ items, onSelect }) {
  const [active, setActive] = useState(0);
  const event = items[active];

  if (!event) {
    return (
      <Glasscard className={styles.empty}>
        <p>No featured events right now — check back soon.</p>
      </Glasscard>
    );
  }

  return (
    <Glasscard className={styles.carousel}>
      <div className={styles.content}>
        <div className={styles.left}>
          <Tag tone="accent">Featured Event</Tag>
          <h2 className={styles.title}>{event.title}</h2>
          <p className={styles.desc}>{event.description}</p>
          <div className={styles.meta}>
            <span>📅 {event.date}</span>
            <span>📍 {event.venue}</span>
          </div>
          <div className={styles.actions}>
            {event.registrationLink && (
              <Button Component="a" href={event.registrationLink} target="_blank" rel="noreferrer">
                Register Now →
              </Button>
            )}
            <Button variant="outline" onClick={() => onSelect(event)}>View Details</Button>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.visual}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--brand-accent)" strokeWidth="1">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <div className={styles.typeLabel}>{event.type}</div>
          </div>
        </div>
      </div>

      <div className={styles.dots}>
        {items.map((_, i) => (
          <button
            key={i}
            aria-label={`Show featured event ${i + 1}`}
            className={`${styles.dot} ${i === active ? styles.dotActive : ''}`}
            onClick={() => setActive(i)}
          />
        ))}
      </div>

      <button className={`${styles.arrow} ${styles.arrowLeft}`} aria-label="Previous featured event" onClick={() => setActive((a) => (a - 1 + items.length) % items.length)}>‹</button>
      <button className={`${styles.arrow} ${styles.arrowRight}`} aria-label="Next featured event" onClick={() => setActive((a) => (a + 1) % items.length)}>›</button>
    </Glasscard>
  );
}
