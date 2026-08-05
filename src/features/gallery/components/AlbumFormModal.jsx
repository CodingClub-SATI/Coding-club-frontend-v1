import { useState } from 'react';
import { Modal } from '@/components/shared/Modal';
import Button from '@/components/shared/Button';
import CoverPicker from '@/features/gallery/components/CoverPicker';
import formStyles from '@/components/admin/AdminForm.module.css';
import controlStyles from '@/components/admin/FormControl.module.css';

export default function AlbumFormModal({
  mode,
  initialTitle = '',
  initialDate = '',
  initialCover = '',
  images = [],
  onClose,
  onSubmit,
}) {
  const [title, setTitle] = useState(initialTitle);
  const [date, setDate] = useState(initialDate);
  const [cover, setCover] = useState(initialCover);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setError('');
    setIsSubmitting(true);
    try {
      const payload = { title: title.trim(), date: date.trim() };
      // The backend only allows a cover once it references a photo that's
      // already in the album — a brand-new album has none yet, so this
      // isn't offered (and isn't sent) during create at all.
      if (mode !== 'create') payload.cover = cover;
      await onSubmit(payload);
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

        {mode === 'create' ? (
          <p className={formStyles.hint}>
            You can set a cover photo once you've added pictures to the album.
          </p>
        ) : (
          <div className={formStyles.row}>
            <span className={formStyles.label}>Cover Image</span>
            <CoverPicker images={images} value={cover} onChange={setCover} />
          </div>
        )}

        {error && <p className={formStyles.error} role="alert">{error}</p>}

        <div className={formStyles.actions}>
          <Button variant="ghost" onClick={onClose} type="button" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {mode === 'create' ? 'Create Album' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}