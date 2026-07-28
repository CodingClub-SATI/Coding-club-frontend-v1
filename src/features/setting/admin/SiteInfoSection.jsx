import { useState } from 'react';
import { Pencil } from 'lucide-react';
import Button from '@/components/shared/Button';
import { siteInfoApi } from '@/features/setting/api';
import formStyles from '@/components/admin/AdminForm.module.css';
import controlStyles from '@/components/admin/FormControl.module.css';
import detailStyles from '@/components/admin/DetailPanel.module.css';
import styles from './Settings.module.css';

const SOCIAL_FIELDS = [
  { key: 'github', label: 'GitHub' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'x', label: 'X (Twitter)' },
  { key: 'discord', label: 'Discord' },
  { key: 'youtube', label: 'YouTube' },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_PATTERN = /^https?:\/\/.+/i;

function buildForm(siteInfo) {
  return {
    email: siteInfo?.email || '',
    phone: siteInfo?.phone || '',
    tagline: siteInfo?.tagline || '',
    description: siteInfo?.description || '',
    socials: SOCIAL_FIELDS.reduce((acc, { key }) => {
      acc[key] = siteInfo?.socials?.[key] || '';
      return acc;
    }, {}),
  };
}

export default function SiteInfoSection({ siteInfo, error, onUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(() => buildForm(siteInfo));
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = () => {
    setForm(buildForm(siteInfo));
    setFieldErrors({});
    setFormError(null);
    setIsEditing(true);
  };

  const updateField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const updateSocial = (key) => (e) =>
    setForm((f) => ({ ...f, socials: { ...f.socials, [key]: e.target.value } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const nextErrors = {};
    if (!EMAIL_PATTERN.test(form.email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }
    SOCIAL_FIELDS.forEach(({ key }) => {
      const value = form.socials[key].trim();
      if (value && !URL_PATTERN.test(value)) {
        nextErrors[`socials.${key}`] = 'Must start with http:// or https://';
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
        tagline: form.tagline.trim(),
        description: form.description.trim(),
        socials: SOCIAL_FIELDS.reduce((acc, { key }) => {
          acc[key] = form.socials[key].trim();
          return acc;
        }, {}),
      };
      await siteInfoApi.update(payload);
      setIsEditing(false);
      onUpdated();
    } catch (err) {
      console.error('Failed to update site info:', err);
      setFormError('Could not save your changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (error) {
    return (
      <section className={`${styles.card} ${styles.cardWide}`}>
        <h2 className={styles.cardTitle}>Site Info</h2>
        <p className={styles.formError}>{error}</p>
      </section>
    );
  }

  if (!isEditing) {
    return (
      <section className={`${styles.card} ${styles.cardWide}`}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Site Info</h2>
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Pencil size={14} aria-hidden="true" /> Edit
          </Button>
        </div>

        <div className={formStyles.row}>
          <span className={formStyles.label}>Email</span>
          <div>{siteInfo?.email || '—'}</div>
        </div>
        <div className={formStyles.row}>
          <span className={formStyles.label}>Phone</span>
          <div>{siteInfo?.phone || '—'}</div>
        </div>
        <div className={formStyles.row}>
          <span className={formStyles.label}>Tagline</span>
          <div>{siteInfo?.tagline || '—'}</div>
        </div>
        <div className={formStyles.row}>
          <span className={formStyles.label}>Description</span>
          <p className={styles.description}>{siteInfo?.description || '—'}</p>
        </div>
        <div className={formStyles.row}>
          <span className={formStyles.label}>Social Links</span>
          <div className={styles.socialList}>
            {SOCIAL_FIELDS.map(({ key, label }) => (
              <div key={key} className={styles.socialItem}>
                <span className={styles.socialLabel}>{label}</span>
                <span className={styles.socialValue}>{siteInfo?.socials?.[key] || '—'}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${styles.card} ${styles.cardWide}`}>
      <h2 className={styles.cardTitle}>Site Info</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className={formStyles.grid}>
          <div className={formStyles.row}>
            <label className={formStyles.label} htmlFor="site-email">Email</label>
            <input
              id="site-email"
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
            <label className={formStyles.label} htmlFor="site-phone">Phone</label>
            <input
              id="site-phone"
              type="tel"
              className={`${controlStyles.input} ${controlStyles.fullWidth}`}
              value={form.phone}
              onChange={updateField('phone')}
              disabled={isSaving}
            />
          </div>
        </div>

        <div className={formStyles.row}>
          <label className={formStyles.label} htmlFor="site-tagline">Tagline</label>
          <input
            id="site-tagline"
            type="text"
            className={`${controlStyles.input} ${controlStyles.fullWidth}`}
            value={form.tagline}
            onChange={updateField('tagline')}
            disabled={isSaving}
          />
        </div>

        <div className={formStyles.row}>
          <label className={formStyles.label} htmlFor="site-description">Description</label>
          <textarea
            id="site-description"
            className={controlStyles.textarea}
            rows={3}
            value={form.description}
            onChange={updateField('description')}
            disabled={isSaving}
          />
        </div>

        <div className={formStyles.grid}>
          {SOCIAL_FIELDS.map(({ key, label }) => (
            <div key={key} className={formStyles.row}>
              <label className={formStyles.label} htmlFor={`site-social-${key}`}>{label}</label>
              <input
                id={`site-social-${key}`}
                type="url"
                placeholder="https://…"
                className={`${controlStyles.input} ${controlStyles.fullWidth}`}
                value={form.socials[key]}
                onChange={updateSocial(key)}
                disabled={isSaving}
              />
              {fieldErrors[`socials.${key}`] && (
                <p className={styles.fieldError} role="alert">{fieldErrors[`socials.${key}`]}</p>
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
