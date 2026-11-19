import { Link } from 'react-router';
import { Modal } from '@/components/shared/Modal';
import Spinner from '@/components/shared/Spinner';
import Button from '@/components/shared/Button';
import { useUpdates } from '@/hooks/useUpdates';
import { formatDate } from '@/utils/date';
import { ArrowUpRight, Radio, Bell } from 'lucide-react';
import { DEMO_UPDATES } from '../demoUpdates';
import styles from './Updates.module.css';

// Set to true only for local offline UI mockup preview; false in production & staging
const ENABLE_DEMO_FALLBACK = false;

function formatTimestamp(input) {
  if (!input) return '';
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return '';

  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) {
    const diffMins = Math.max(1, Math.floor(diffMs / (1000 * 60)));
    return `${diffMins}m ago`;
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  if (diffDays === 1) {
    return 'Yesterday';
  }
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }
  return formatDate(input);
}

function getUrgencyMeta(message = '') {
  const text = message.toLowerCase();
  if (/\b(live|ongoing|started|now|happening|stream)\b/i.test(text)) {
    return {
      label: 'Live Now',
      badgeClass: styles.badgeLive,
      borderClass: styles.borderLive,
    };
  }
  if (/\b(deadline|closing|urgent|hurry|last day|expires|final)\b/i.test(text)) {
    return {
      label: 'Closing Soon',
      badgeClass: styles.badgeUrgent,
      borderClass: styles.borderUrgent,
    };
  }
  if (/\b(event|hackathon|workshop|bootcamp|contest|challenge)\b/i.test(text)) {
    return {
      label: 'Event',
      badgeClass: styles.badgeEvent,
      borderClass: styles.borderEvent,
    };
  }
  return {
    label: 'Notice',
    badgeClass: styles.badgeNotice,
    borderClass: styles.borderNotice,
  };
}

function cleanMessage(msg = '') {
  return msg.replace(/^(live now|closing soon|urgent|notice|announcement|event|upcoming event)(\s*:\s*|\s*-\s*|\s*—\s*)/i, '').trim();
}

export default function Updates({ onClose }) {
  const { updates, isLoading, error } = useUpdates();

  // If real API returns records, prioritize them. Otherwise fallback to DEMO_UPDATES when enabled.
  const activeUpdates = (Array.isArray(updates) && updates.length > 0)
    ? updates
    : (ENABLE_DEMO_FALLBACK ? DEMO_UPDATES : []);

  const hasData = activeUpdates.length > 0;

  return (
    <Modal 
      title={
        <span className={styles.modalTitleRow}>
          <Bell size={18} className="text-primary-glow" />
          <span>Club Announcements</span>
        </span>
      } 
      onClose={onClose} 
      size="md" 
      variant="glow"
    >
      <div className={styles.container} role="status" aria-live="polite">
        
        {/* Header Status Bar */}
        <div className={styles.headerBar}>
          <div className={styles.statusPill}>
            <span className={styles.statusPulseDot} />
            <span className={styles.statusTitle}>Active Notices</span>
          </div>
          <span className={styles.statusSub}>Club updates, events & deadlines</span>
        </div>

        {/* Loading State */}
        {isLoading && !hasData && (
          <div className={styles.statusBox}>
            <Spinner className={styles.spinnerAccent} />
            <p>Loading club announcements...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && !hasData && (
          <div className={styles.statusBox}>
            <p className={styles.errorText}>{error}</p>
            <Button Component={Link} to="/events" onClick={onClose} variant="outline" tone="primary" size="sm">
              Browse Upcoming Events →
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && !hasData && (
          <div className={styles.statusBox}>
            <Radio size={26} className="text-primary-glow" />
            <div className={styles.emptyTitle}>No Active Announcements</div>
            <p className={styles.emptyText}>
              There are no new notices or deadlines at the moment. Check back soon or browse upcoming events!
            </p>
            <Button Component={Link} to="/events" onClick={onClose} variant="outline" tone="primary" size="sm">
              Explore All Club Events →
            </Button>
          </div>
        )}

        {/* Data State */}
        {hasData && (
          <div className={styles.list}>
            {activeUpdates.map((update) => {
              const meta = getUrgencyMeta(update.message);
              const isExternal = Boolean(update.link && /^https?:\/\//i.test(update.link));
              const displayMsg = cleanMessage(update.message);

              return (
                <article key={update.id} className={`${styles.item} ${meta.borderClass}`}>
                  <div className={styles.itemHeader}>
                    <span className={`${styles.urgencyBadge} ${meta.badgeClass}`}>
                      <span className={styles.badgeDot} />
                      {meta.label}
                    </span>
                    <span className={styles.date}>
                      {formatTimestamp(update.createdAt)}
                    </span>
                  </div>

                  <p className={styles.text}>{displayMsg}</p>

                  {update.link && (
                    <div className={styles.actionRow}>
                      {isExternal ? (
                        <a
                          href={update.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.actionBtn}
                        >
                          <span>View Details</span>
                          <ArrowUpRight size={13} />
                        </a>
                      ) : (
                        <Link
                          to={update.link}
                          onClick={onClose}
                          className={styles.actionBtn}
                        >
                          <span>View Details</span>
                          <ArrowUpRight size={13} />
                        </Link>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {/* Modal Footer */}
        <div className={styles.modalFooter}>
          <span className={styles.footerNote}>
            Coding Club SATI · Notice Board
          </span>
          <div className={styles.footerActions}>
            <Button 
              Component={Link} 
              to="/events" 
              onClick={onClose} 
              variant="filled" 
              tone="primary" 
              size="sm"
            >
              View All Events
            </Button>
          </div>
        </div>

      </div>
    </Modal>
  );
}