import { useState } from 'react';
import { Star, Archive, ArchiveRestore, Pencil, Eye, MousePointerClick } from 'lucide-react';
import { Modal } from '@/components/shared/Modal';
import Button from '@/components/shared/Button';
import { ConfirmButton } from '@/components/shared/ConfirmButton';
import Tag from '@/components/shared/Tag';
import { eventsApi } from '@/features/events/api';
import formStyles from '@/components/admin/AdminForm.module.css';
import badgeStyles from '@/components/admin/Badge.module.css';
import detailStyles from '@/components/admin/DetailPanel.module.css';
import styles from './Events.module.css';

export default function EventDetailPanel({ event, onClose, onEdit, onChanged, onDeleted }) {
  const [actionError, setActionError] = useState(null);
  const [isToggling, setIsToggling] = useState(false);

  const toggleField = async (field) => {
    setIsToggling(true);
    setActionError(null);
    try {
      const updated = await eventsApi.update(event.id, { [field]: !event[field] });
      onChanged(updated);
    } catch (err) {
      console.error(`Failed to update event ${field}:`, err);
      setActionError('Could not update the event. Please try again.');
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    setActionError(null);
    try {
      await eventsApi.remove(event.id);
      onDeleted(event.id);
    } catch (err) {
      console.error('Failed to delete event:', err);
      setActionError('Could not delete the event. Please try again.');
    }
  };

  return (
    <Modal title={event.title} onClose={onClose} size="lg" variant="glow">
      {event.image ? (
        <img className={detailStyles.poster} src={event.image} alt={event.title} />
      ) : (
        <div className={`${detailStyles.poster} ${styles.posterPlaceholder}`}>No poster uploaded</div>
      )}

      <div className={styles.badgeRow}>
        <span className={`${badgeStyles.badge} ${badgeStyles[event.status] || ''}`}>{event.status}</span>
        {event.featured && <span className={`${badgeStyles.badge} ${badgeStyles.featured}`}>Featured</span>}
        {event.archived && <span className={`${badgeStyles.badge} ${badgeStyles.archived}`}>Archived</span>}
      </div>

      <div className={formStyles.grid}>
        <div className={formStyles.row}>
          <span className={formStyles.label}>Category</span>
          <div>{event.type}</div>
        </div>
        <div className={formStyles.row}>
          <span className={formStyles.label}>Date</span>
          <div>{event.date}</div>
        </div>
        <div className={formStyles.row}>
          <span className={formStyles.label}>Time</span>
          <div>{event.time}</div>
        </div>
        <div className={formStyles.row}>
          <span className={formStyles.label}>Venue</span>
          <div>{event.venue}</div>
        </div>
        <div className={formStyles.row}>
          <span className={formStyles.label}>Registration Link</span>
          <div className={styles.breakAll}>{event.registrationLink || '—'}</div>
        </div>
      </div>

      <div className={formStyles.row}>
        <span className={formStyles.label}>Description</span>
        <p className={styles.description}>{event.description}</p>
      </div>

      {event.tags?.length > 0 && (
        <div className={formStyles.row}>
          <span className={formStyles.label}>Tags</span>
          <div className={styles.tagList}>
            {event.tags.map((tag) => <Tag key={tag} tone="secondary">{tag}</Tag>)}
          </div>
        </div>
      )}

      <div className={detailStyles.metrics}>
        <div>
          <div className={detailStyles.metricValue}>
            <Eye size={14} className={styles.metricIcon} aria-hidden="true" />
            {event.viewCount ?? 0}
          </div>
          <div className={detailStyles.metricLabel}>Detail Views</div>
        </div>
        <div>
          <div className={detailStyles.metricValue}>
            <MousePointerClick size={14} className={styles.metricIcon} aria-hidden="true" />
            {event.registerClickCount ?? 0}
          </div>
          <div className={detailStyles.metricLabel}>Register Clicks</div>
        </div>
      </div>

      {actionError && <p className={styles.formError} role="alert">{actionError}</p>}

      <div className={detailStyles.actions}>
        <Button variant="outline" size="sm" disabled={isToggling} onClick={() => toggleField('featured')}>
          <Star size={14} aria-hidden="true" /> {event.featured ? 'Unfeature' : 'Mark as Featured'}
        </Button>
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Pencil size={14} aria-hidden="true" /> Edit Info
        </Button>
        <Button variant="outline" size="sm" disabled={isToggling} onClick={() => toggleField('archived')}>
          {event.archived ? (
            <><ArchiveRestore size={14} aria-hidden="true" /> Restore</>
          ) : (
            <><Archive size={14} aria-hidden="true" /> Archive Event</>
          )}
        </Button>
        <ConfirmButton label="Delete" confirmLabel="Delete for good?" danger onConfirm={handleDelete} />
      </div>
    </Modal>
  );
}
