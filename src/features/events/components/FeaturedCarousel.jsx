import { useState } from 'react';
import Glasscard from '@/components/shared/Glasscard';
import Tag from '@/components/shared/Tag';
import Button from '@/components/shared/Button';
import styles from './FeaturedCarousel.module.css';

function EventIcon() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--brand-accent)"
      strokeWidth="1"
    >
      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

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

  const {
    title,
    description,
    date,
    venue,
    type,
    registrationLink,
  } = event;

  const showPrevious = () => {
    setActive((current) => (current - 1 + items.length) % items.length);
  };

  const showNext = () => {
    setActive((current) => (current + 1) % items.length);
  };

  const selectDot = (index) => {
    setActive(index);
  };

  const openDetails = () => {
    onSelect(event);
  };

  return (
    <Glasscard className={styles.carousel}>
      {/* Content */}
      <div className={styles.content}>
        {/* Left */}
        <div className={styles.left}>
          <Tag tone="accent">Featured Event</Tag>

          <h2 className={styles.title}>{title}</h2>

          <p className={styles.desc}>{description}</p>

          <div className={styles.meta}>
            <span>📅 {date}</span>
            <span>📍 {venue}</span>
          </div>

          <div className={styles.actions}>
            {registrationLink && (
              <Button
                Component="a"
                href={registrationLink}
                target="_blank"
                rel="noreferrer"
              >
                Register Now →
              </Button>
            )}

            <Button
              variant="outline"
              onClick={openDetails}
            >
              View Details
            </Button>
          </div>
        </div>

        {/* Right */}
        <div className={styles.right}>
          <div className={styles.visual}>
            <EventIcon />

            <div className={styles.typeLabel}>
              {type}
            </div>
          </div>
        </div>
      </div>

      {/* Indicators */}
      <div className={styles.dots}>
        {items.map((_, index) => {
          const dotClass = `${styles.dot} ${
            index === active ? styles.dotActive : ''
          }`;

          return (
            <button
              key={index}
              type="button"
              className={dotClass}
              aria-label={`Show featured event ${index + 1}`}
              onClick={() => selectDot(index)}
            />
          );
        })}
      </div>

      {/* Navigation */}
      <button
        type="button"
        className={`${styles.arrow} ${styles.arrowLeft}`}
        aria-label="Previous featured event"
        onClick={showPrevious}
      >
        ‹
      </button>

      <button
        type="button"
        className={`${styles.arrow} ${styles.arrowRight}`}
        aria-label="Next featured event"
        onClick={showNext}
      >
        ›
      </button>
    </Glasscard>
  );
}