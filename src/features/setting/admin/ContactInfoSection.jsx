import { useState } from 'react';
import { Pencil } from 'lucide-react';
import Button from '@/components/shared/Button';
import { contactInfoApi } from '@/features/setting/api';
import { PLATFORMS } from '@/data/socialLinks';
import formStyles from '@/components/admin/AdminForm.module.css';
import controlStyles from '@/components/admin/FormControl.module.css';
import detailStyles from '@/components/admin/DetailPanel.module.css';
import styles from './Settings.module.css';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_PATTERN = /^https?:\/\/.+/i;

function buildForm(contactInfo) {
  return {
    email: contactInfo?.email || '',
    phone: contactInfo?.phone || '',
    ...PLATFORMS.reduce((acc, { key }) => {
      acc[key] = contactInfo?.[key] || '';
      return acc;
    }, {}),
  };
}

export default function ContactInfoSection({ contactInfo, error, onUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(() => buildForm(contactInfo));
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = () => {
    setForm(buildForm(contactInfo));
    setFieldErrors({});
    setFormError(null);
    setIsEditing(true);
  };

  const updateField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const nextErrors = {};
    if (!EMAIL_PATTERN.test(form.email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }
    PLATFORMS.forEach(({ key }) => {
      const value = form[key].trim();
      if (value && !URL_PATTERN.test(value)) {
        nextErrors[key] = 'Must start with http:// or https://';
      }
    });
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});
    setIsSaving(true);
    try {
      const payload = {
        email: form.email.trim(),
        phone: form.phone.trim(),
        ...PLATFORMS.reduce((acc, { key }) => {
          acc[key] = form[key].trim();
          return acc;
        }, {}),
      };
      await contactInfoApi.update(payload);
      setIsEditing(false);
      onUpdated();
    } catch (err) {
      console.error('Failed to update contact info:', err);
      setFormError('Could not save your changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (error) {
    return (
      <section className={`${styles.card} ${styles.cardWide}`}>
        <h2 className={styles.cardTitle}>Contact Info</h2>
        <p className={styles.formError}>{error}</p>
      </section>
    );
  }

  if (!isEditing) {
    return (
      <section className={`${styles.card} ${styles.cardWide}`}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Contact Info</h2>
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Pencil size={14} aria-hidden="true" /> Edit
          </Button>
        </div>
        <div className={formStyles.row}>
          <span className={formStyles.label}>Email</span>
          <div>{contactInfo?.email || '—'}</div>
        </div>
        <div className={formStyles.row}>
          <span className={formStyles.label}>Phone</span>
          <div>{contactInfo?.phone || '—'}</div>
        </div>
        <div className={formStyles.row}>
          <span className={formStyles.label}>Social Links</span>
          <div className={styles.socialList}>
            {PLATFORMS.map(({ key, label }) => (
              <div key={key} className={styles.socialItem}>
                <span className={styles.socialLabel}>{label}</span>
                <span className={styles.socialValue}>{contactInfo?.[key] || '—'}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${styles.card} ${styles.cardWide}`}>
      <h2 className={styles.cardTitle}>Contact Info</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className={formStyles.grid}>
          <div className={formStyles.row}>
            <label className={formStyles.label} htmlFor="contact-email">Email</label>
            <input
              id="contact-email"
              type="email"
              className={`${controlStyles.input} ${controlStyles.fullWidth}`}
              value={form.email}
              onChange={updateField('email')}
              disabled={isSaving}
              required
            />
            {fieldErrors.email && <p className={styles.fieldError} role="alert">{fieldErrors.email}</p>}
          </div>
          <div className={formStyles.row}>
            <label className={formStyles.label} htmlFor="contact-phone">Phone</label>
            <input
              id="contact-phone"
              type="tel"
              className={`${controlStyles.input} ${controlStyles.fullWidth}`}
              value={form.phone}
              onChange={updateField('phone')}
              disabled={isSaving}
            />
          </div>
        </div>
        <div className={formStyles.grid}>
          {PLATFORMS.map(({ key, label }) => (
            <div key={key} className={formStyles.row}>
              <label className={formStyles.label} htmlFor={`contact-social-${key}`}>{label}</label>
              <input
                id={`contact-social-${key}`}
                type="url"
                placeholder="https://"
                className={`${controlStyles.input} ${controlStyles.fullWidth}`}
                value={form[key]}
                onChange={updateField(key)}
                disabled={isSaving}
              />
              {fieldErrors[key] && (
                <p className={styles.fieldError} role="alert">{fieldErrors[key]}</p>
              )}
            </div>
          ))}
        </div>
        {formError && <p className={styles.formError} role="alert">{formError}</p>}
        <div className={detailStyles.actions}>
          <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" size="sm" isLoading={isSaving}>
            {isSaving ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </section>
  );
}
