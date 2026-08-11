import { useId, useState } from 'react';
import { Modal } from '@/components/shared/Modal';
import Button from '@/components/shared/Button';
import { isValidUrl } from '@/utils/validation';
import formStyles from '@/components/admin/AdminForm.module.css';
import controlStyles from '@/components/admin/FormControl.module.css';

/**
 * Admin-only. Used by features/updates/admin/Updates.jsx for both flows:
 *   update=null      — "Add New Alert"
 *   update={...}     — "Edit Alert"
 */
export default function UpdateFormModal({ update, onClose, onSubmit }) {
  const isEdit = !!update;

  const messageId = useId();
  const linkId = useId();

  const [message, setMessage] = useState(update?.message || '');
  const [link, setLink] = useState(update?.link || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [linkError, setLinkError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = message.trim();
    const trimmedLink = link.trim();

    if (!trimmed) {
      setError('Alert message is required.');
      return;
    }
    if (trimmedLink && !isValidUrl(trimmedLink)) {
      setLinkError('Must start with http:// or https://');
      return;
    }

    setError('');
    setLinkError('');
    setSubmitting(true);
    try {
      await onSubmit({ message: trimmed, link: trimmedLink });
      onClose();
    } catch (err) {
      console.error(`Failed to ${isEdit ? 'update' : 'create'} alert:`, err);
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title={isEdit ? 'Edit Alert' : 'Add New Alert'} onClose={onClose} size="md" variant="glow">
      <form onSubmit={handleSubmit} noValidate>
        <div className={formStyles.row}>
          <label htmlFor={messageId} className={formStyles.label}>Message</label>
          <textarea
            id={messageId}
            className={`${controlStyles.textarea} ${formStyles.fullWidth}`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. Registrations for CodeSprint close this Friday!"
            autoFocus
            disabled={submitting}
          />
        </div>

        <div className={formStyles.row}>
          <label htmlFor={linkId} className={formStyles.label}>Link (optional)</label>
          <input
            id={linkId}
            type="url"
            className={`${controlStyles.input} ${formStyles.fullWidth}`}
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://..."
            disabled={submitting}
          />
          {linkError && <p className={formStyles.error} role="alert">{linkError}</p>}
        </div>

        {error && <p className={formStyles.error} role="alert">{error}</p>}

        <div className={formStyles.actions}>
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" isLoading={submitting}>
            {isEdit ? 'Save Changes' : 'Add Alert'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}