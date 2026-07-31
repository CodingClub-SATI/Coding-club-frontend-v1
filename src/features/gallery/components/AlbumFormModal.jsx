import { useState } from 'react';
import { Modal } from '@/components/shared/Modal';
import Button from '@/components/shared/Button';
import ImageDrop from '@/components/shared/ImageDrop';
import formStyles from '@/components/admin/AdminForm.module.css';
import controlStyles from '@/components/admin/FormControl.module.css';

export default function AlbumFormModal({
  mode,
  initialTitle = '',
  initialDate = '',
  initialCover = '',
  onClose,
  onSubmit,
}) {
  const [title, setTitle] = useState(initialTitle);
  const [date, setDate] = useState(initialDate);
  const [cover, setCover] = useState(initialCover);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setError('');
    setIsSubmitting(true);
    try {
      await onSubmit({ title: title.trim(), date: date.trim(), cover });
      onClose();
    } catch (err) {
      console.error(`Failed to ${mode === 'create' ? 'create' : 'update'} album:`, err);
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title={mode === 'create' ? 'Create Album' : 'Edit Album'} onClose={onClose} size="sm" variant="glow">
      <form onSubmit={handleSubmit} noValidate>
        <div className={formStyles.row}>
          <label className={formStyles.label} htmlFor="album-title">Album Title</label>
          <input
            id="album-title"
            className={`${controlStyles.input} ${controlStyles.fullWidth}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
            disabled={isSubmitting}
          />
        </div>

        <div className={formStyles.row}>
          <label className={formStyles.label} htmlFor="album-date">Date</label>
          <input
            id="album-date"
            className={`${controlStyles.input} ${controlStyles.fullWidth}`}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="e.g. March 2026"
            disabled={isSubmitting}
          />
        </div>

        <div className={formStyles.row}>
          <span className={formStyles.label}>Cover Image</span>
          <ImageDrop
            value={cover}
            onChange={setCover}
            onUploadingChange={setIsImageUploading}
          />
        </div>

        {error && <p className={formStyles.error} role="alert">{error}</p>}

        <div className={formStyles.actions}>
          <Button variant="ghost" onClick={onClose} type="button" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting} disabled={isImageUploading}>
            {mode === 'create' ? 'Create Album' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
