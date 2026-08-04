import { useState } from 'react';
import { Modal } from '@/components/shared/Modal';
import Button from '@/components/shared/Button';
import { TagInput } from '@/components/shared/TagInput';
import ImageDrop from '@/components/shared/ImageDrop';
import { Toggle } from '@/components/shared/Toggle';
import { eventsApi } from '@/features/events/api';
import { cleanupReplacedImages } from '@/services/upload';
import { EVENT_CATEGORIES, EVENT_STATUSES } from '@/features/events/constants';
import { isValidUrl } from '@/utils/validation';
import formStyles from '@/components/admin/AdminForm.module.css';
import controlStyles from '@/components/admin/FormControl.module.css';
import styles from './Events.module.css';

const EMPTY_FORM = {
  title: '',
  date: '',
  time: '',
  reportingTime: '',
  venue: '',
  description: '',
  type: EVENT_CATEGORIES[0],
  tags: [],
  bannerUrl: null,
  logoUrl: null,
  featured: false,
  registrationLink: '',
  status: 'upcoming',
};

function toFormState(event) {
  if (!event) return EMPTY_FORM;
  return {
    title: event.title || '',
    // Backend stores/returns a full ISO datetime (e.g. midnight UTC); a
    // native date input wants just the yyyy-MM-dd portion. Slicing the
    // string directly avoids any local-timezone shifting a `new Date(...)`
    // round trip could introduce.
    date: event.date ? event.date.slice(0, 10) : '',
    time: event.time || '',
    reportingTime: event.reportingTime || '',
    venue: event.venue || '',
    description: event.description || '',
    type: event.type || EVENT_CATEGORIES[0],
    tags: event.tags || [],
    bannerUrl: event.bannerUrl || null,
    logoUrl: event.logoUrl || null,
    featured: !!event.featured,
    registrationLink: event.registrationLink || '',
    status: event.status || 'upcoming',
  };
}

export default function EventFormModal({ mode, event, onClose, onSaved }) {
  const [form, setForm] = useState(() => toFormState(mode === 'edit' ? event : null));
  const [isSaving, setIsSaving] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const updateField = (field, fieldValue) => setForm((prev) => ({ ...prev, [field]: fieldValue }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Event name is required.');
      return;
    }
    if (form.registrationLink.trim() && !isValidUrl(form.registrationLink.trim())) {
      setFieldErrors({ registrationLink: 'Must start with http:// or https://' });
      setError('Fix the highlighted fields before saving.');
      return;
    }

    setIsSaving(true);
    setError(null);
    setFieldErrors({});
    try {
      const payload = {
        title: form.title.trim(),
        date: form.date,
        time: form.time,
        reportingTime: form.reportingTime,
        venue: form.venue,
        description: form.description,
        type: form.type,
        tags: form.tags,
        bannerUrl: form.bannerUrl,
        logoUrl: form.logoUrl,
        featured: form.featured,
        registrationLink: form.registrationLink,
        status: form.status,
      };
      const saved = mode === 'new' ? await eventsApi.create(payload) : await eventsApi.update(event.id, payload);
      if (mode === 'edit') {
        // Fire-and-forget: don't hold up closing the modal for a
        // storage-cleanup call the admin doesn't need to wait on.
        cleanupReplacedImages(event, saved, ['bannerUrl', 'logoUrl']);
      }
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
              type="date"
              className={`${controlStyles.input} ${controlStyles.fullWidth}`}
              value={form.date}
              onChange={(e) => updateField('date', e.target.value)}
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
            <label className={formStyles.label} htmlFor="event-reporting-time">Reporting Time</label>
            <input
              id="event-reporting-time"
              className={`${controlStyles.input} ${controlStyles.fullWidth}`}
              value={form.reportingTime}
              onChange={(e) => updateField('reportingTime', e.target.value)}
              placeholder="e.g. 9:30 AM"
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
          <label className={formStyles.label} htmlFor="event-tags">Tags</label>
          <TagInput id="event-tags" value={form.tags} onChange={(tags) => updateField('tags', tags)} placeholder="Add a tag & press Enter" />
        </div>

        <div className={formStyles.grid}>
          <div className={formStyles.row}>
            <span className={formStyles.label}>Poster Image</span>
            <ImageDrop
              value={form.bannerUrl}
              onChange={(bannerUrl) => updateField('bannerUrl', bannerUrl)}
              onUploadingChange={setIsImageUploading}
            />
          </div>
          <div className={formStyles.row}>
            <span className={formStyles.label}>Event Logo</span>
            <ImageDrop
              value={form.logoUrl}
              onChange={(logoUrl) => updateField('logoUrl', logoUrl)}
              aspect="1/1"
              onUploadingChange={setIsImageUploading}
            />
          </div>
        </div>

        <div className={formStyles.grid}>
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
            {fieldErrors.registrationLink && <p className={styles.formError} role="alert">{fieldErrors.registrationLink}</p>}
          </div>
          <div className={formStyles.row}>
            <Toggle
              checked={!!form.featured}
              onChange={(featured) => updateField('featured', featured)}
              label="Feature this event on the homepage"
              disabled={isSaving || isImageUploading}
            />
          </div>
        </div>

        {error && <p className={styles.formError} role="alert">{error}</p>}

        <div className={formStyles.actions}>
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>Cancel</Button>
          <Button type="submit" isLoading={isSaving} disabled={isImageUploading}>
            {mode === 'new' ? 'Add Event' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}