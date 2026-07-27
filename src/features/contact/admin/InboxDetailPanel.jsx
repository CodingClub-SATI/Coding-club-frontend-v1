import { useState } from 'react';
import { CheckCircle2, RotateCcw } from 'lucide-react';
import { Modal } from '@/components/shared/Modal';
import Button from '@/components/shared/Button';
import { ConfirmButton } from '@/components/shared/ConfirmButton';
import { contactApi } from '@/features/contact/api';
import formStyles from '@/components/admin/AdminForm.module.css';
import badgeStyles from '@/components/admin/Badge.module.css';
import detailStyles from '@/components/admin/DetailPanel.module.css';
import styles from './Inbox.module.css';

export default function InboxDetailPanel({ contact, onClose, onChanged, onDeleted }) {
  const [actionError, setActionError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const isNew = contact.status === 'New';

  const handleToggleStatus = async () => {
    setIsUpdating(true);
    setActionError(null);
    try {
      const updated = await contactApi.updateStatus(contact.id, isNew ? 'Responded' : 'New');
      onChanged(updated);
    } catch (err) {
      console.error('Failed to update contact status:', err);
      setActionError('Could not update the status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setActionError(null);
    try {
      await contactApi.remove(contact.id);
      onDeleted(contact.id);
    } catch (err) {
      console.error('Failed to delete contact request:', err);
      setActionError('Could not delete this request. Please try again.');
    }
  };

  return (
    <Modal title={contact.name} onClose={onClose}>
      <div className={styles.badgeRow}>
        <span className={`${badgeStyles.badge} ${isNew ? badgeStyles.new : badgeStyles.responded}`}>
          {contact.status}
        </span>
      </div>

      <div className={formStyles.grid}>
        <div className={formStyles.row}>
          <span className={formStyles.label}>Email</span>
          <div className={styles.breakAll}>{contact.email}</div>
        </div>
        <div className={formStyles.row}>
          <span className={formStyles.label}>Request Type</span>
          <div>{contact.requestType}</div>
        </div>
        <div className={formStyles.row}>
          <span className={formStyles.label}>Date</span>
          <div>{contact.date}</div>
        </div>
      </div>

      <div className={formStyles.row}>
        <span className={formStyles.label}>Message</span>
        <p className={styles.message}>{contact.message}</p>
      </div>

      {actionError && <p className={styles.formError} role="alert">{actionError}</p>}

      <div className={detailStyles.actions}>
        <Button variant="outline" size="sm" disabled={isUpdating} onClick={handleToggleStatus}>
          {isNew ? (
            <><CheckCircle2 size={14} aria-hidden="true" /> Mark as Responded</>
          ) : (
            <><RotateCcw size={14} aria-hidden="true" /> Mark as New</>
          )}
        </Button>
        <ConfirmButton label="Delete" confirmLabel="Delete for good?" danger onConfirm={handleDelete} />
      </div>
    </Modal>
  );
}
