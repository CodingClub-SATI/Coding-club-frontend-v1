import { useState } from 'react';
import { Modal } from '@/components/shared/Modal';
import Button from '@/components/shared/Button';
import formStyles from '@/components/admin/AdminForm.module.css';
import controlStyles from '@/components/admin/FormControl.module.css';

export default function AlbumFormModal({ mode, initialTitle = '', onClose, onSubmit }) {
  const [title, setTitle] = useState(initialTitle);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit({ title: title.trim() });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal 
     title={mode === 'create' ? 'Create Album' : 'Rename Album'} 
     onClose={onClose} 
     size="sm" 
     variant="glow"
    >
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