import { useState } from 'react';
import { Modal } from '@/components/shared/Modal';
import Button from '@/components/shared/Button';
import { TagInput } from '@/components/shared/TagInput';
import ImageDrop from '@/components/shared/ImageDrop';
import { Toggle } from '@/components/shared/Toggle';
import { eventsApi } from '@/features/events/api';
import { EVENT_CATEGORIES, EVENT_STATUSES } from '@/features/events/constants';
import formStyles from '@/components/admin/AdminForm.module.css';
import controlStyles from '@/components/admin/FormControl.module.css';
import styles from './Events.module.css';

const EMPTY_FORM = {
  title: '',
  date: '',
  time: '',
  venue: '',
  description: '',
  type: EVENT_CATEGORIES[0],
  tags: [],
  image: null,
  featured: false,
  registrationLink: '',
  status: 'upcoming',
};

export default function EventFormModal({ mode, event, onClose, onSaved }) {
  const [form, setForm] = useState(() => (mode === 'edit' && event ? { ...EMPTY_FORM, ...event } : EMPTY_FORM));
  const [isSaving, setIsSaving] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [error, setError] = useState(null);

  const updateField = (field, fieldValue) => setForm((prev) => ({ ...prev, [field]: fieldValue }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Event name is required.');
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      const payload = { ...form, title: form.title.trim() };
      const saved = mode === 'new' ? await eventsApi.create(payload) : await eventsApi.update(event.id, payload);
      onSaved(saved);
    } catch (err) {
      console.error(`Failed to ${mode === 'new' ? 'create' : 'update'} event:`, err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal title={mode === 'new' ? 'Add New Event' : `Edit — ${event.title}`} onClose={onClose} size="lg" variant="glow">
      <form onSubmit={handleSubmit} noValidate>
        <div className={formStyles.grid}>
          <div className={formStyles.row}>
            <label className={formStyles.label} htmlFor="event-title">Name</label>
            <input
              id="event-title"
              className={`${controlStyles.input} ${controlStyles.fullWidth}`}
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Event name"
              required
            />
          </div>

          <div className={formStyles.row}>
            <label className={formStyles.label} htmlFor="event-category">Category</label>
            <select
              id="event-category"
              className={`${controlStyles.select} ${controlStyles.fullWidth}`}
              value={form.type}
              onChange={(e) => updateField('type', e.target.value)}
            >
              {EVENT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className={formStyles.row}>
            <label className={formStyles.label} htmlFor="event-date">Date</label>
            <input
              id="event-date"
              className={`${controlStyles.input} ${controlStyles.fullWidth}`}
              value={form.date}
              onChange={(e) => updateField('date', e.target.value)}
              placeholder="e.g. July 15, 2026"
            />
          </div>

          <div className={formStyles.row}>
            <label className={formStyles.label} htmlFor="event-time">Time</label>
            <input
              id="event-time"
              className={`${controlStyles.input} ${controlStyles.fullWidth}`}
              value={form.time}
              onChange={(e) => updateField('time', e.target.value)}
              placeholder="e.g. 10:00 AM"
            />
          </div>

          <div className={formStyles.row}>
            <label className={formStyles.label} htmlFor="event-venue">Venue</label>
            <input
              id="event-venue"
              className={`${controlStyles.input} ${controlStyles.fullWidth}`}
              value={form.venue}
              onChange={(e) => updateField('venue', e.target.value)}
            />
          </div>

          <div className={formStyles.row}>
            <label className={formStyles.label} htmlFor="event-status">Status</label>
            <select
              id="event-status"
              className={`${controlStyles.select} ${controlStyles.fullWidth}`}
              value={form.status}
              onChange={(e) => updateField('status', e.target.value)}
            >
              {EVENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className={formStyles.row}>
          <label className={formStyles.label} htmlFor="event-description">Description</label>
          <textarea
            id="event-description"
            className={controlStyles.textarea}
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
          />
        </div>

        <div className={formStyles.row}>
          <span className={formStyles.label}>Tags</span>
          <TagInput value={form.tags} onChange={(tags) => updateField('tags', tags)} placeholder="Add a tag & press Enter" />
        </div>

        <div className={formStyles.grid}>
          <div className={formStyles.row}>
            <span className={formStyles.label}>Poster Image</span>
            <ImageDrop
              value={form.image}
              onChange={(image) => updateField('image', image)}
              onUploadingChange={setIsImageUploading}
            />
          </div>
          <div>
            <div className={formStyles.row}>
              <label className={formStyles.label} htmlFor="event-reg-link">Registration Form Link</label>
              <input
                id="event-reg-link"
                type="url"
                className={`${controlStyles.input} ${controlStyles.fullWidth}`}
                value={form.registrationLink}
                onChange={(e) => updateField('registrationLink', e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className={formStyles.row}>
              <Toggle
                checked={!!form.featured}
                onChange={(featured) => updateField('featured', featured)}
                label="Feature this event on the homepage"
              />
            </div>
          </div>
        </div>

        {error && <p className={styles.formError} role="alert">{error}</p>}

        <div className={formStyles.actions}>
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isSaving} disabled={isImageUploading}>
            {mode === 'new' ? 'Add Event' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
