import { useState } from 'react';
import { Modal } from '@/components/shared/Modal';
import Button from '@/components/shared/Button';
import { Toggle } from '@/components/shared/Toggle';
import formStyles from '@/components/admin/AdminForm.module.css';
import controlStyles from '@/components/admin/FormControl.module.css';

export default function PhotoEditModal({ photo, featuredLimitReached, onClose, onSubmit }) {
  const [caption, setCaption] = useState(photo.caption || '');
  const [featured, setFeatured] = useState(photo.featured || false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If it isn't currently featured and the limit is reached, disable the toggle
  const isToggleDisabled = !photo.featured && featuredLimitReached;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({ caption: caption.trim(), featured });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title="Edit Photo Details" onClose={onClose} size="sm" variant="glow">
      <form onSubmit={handleSubmit} noValidate>
        <div className={formStyles.row}>
          <label className={formStyles.label} htmlFor="photo-caption">Caption</label>
          <textarea
            id="photo-caption"
            className={`${controlStyles.textarea} ${controlStyles.fullWidth}`}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={3}
            disabled={isSubmitting}
          />
        </div>
        <div className={formStyles.row}>
          <Toggle
            checked={featured}
            onChange={setFeatured}
            label="Feature this photo in the gallery slider"
            disabled={isSubmitting || isToggleDisabled}
          />
          {isToggleDisabled && (
            <p className={formStyles.hint}>
              Maximum featured limit reached. Unfeature another photo to feature this one.
            </p>
          )}
        </div>
        <div className={formStyles.actions}>
          <Button variant="ghost" onClick={onClose} type="button" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}