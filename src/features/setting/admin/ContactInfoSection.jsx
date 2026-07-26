import { useState } from 'react';
import { Pencil } from 'lucide-react';
import Button from '@/components/shared/Button';
import Tag from '@/components/shared/Tag';
import { Toggle } from '@/components/shared/Toggle';
import { contactInfoApi } from '@/features/setting/api';
import { PLATFORMS } from '@/data/socialLinks';
import { isValidEmail, isValidUrl } from '@/utils/validation';
import formStyles from '@/components/admin/AdminForm.module.css';
import controlStyles from '@/components/admin/FormControl.module.css';
import detailStyles from '@/components/admin/DetailPanel.module.css';
import styles from './Settings.module.css';

function buildForm(contactInfo) {
  return {
    email: contactInfo?.email || '',
    phone: contactInfo?.phone || '',
    youtube: contactInfo?.youtube || '',
    ...PLATFORMS.reduce((acc, { key }) => {
      const entry = contactInfo?.[key] || {};
      acc[key] = {
        url: entry.url || '',
        showOnSidebar: Boolean(entry.showOnSidebar),
        showOnFooter: Boolean(entry.showOnFooter),
      };
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

  const updatePlatformUrl = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: { ...f[key], url: e.target.value } }));

  const updatePlatformFlag = (key, flag) => (checked) =>
    setForm((f) => ({ ...f, [key]: { ...f[key], [flag]: checked } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const nextErrors = {};
    if (!isValidEmail(form.email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }
    if (form.youtube.trim() && !isValidUrl(form.youtube.trim())) {
      nextErrors.youtube = 'Must start with http:// or https://';
    }
    PLATFORMS.forEach(({ key }) => {
      const value = form[key].url.trim();
      if (value && !isValidUrl(value)) {
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
        youtube: form.youtube.trim(),
        ...PLATFORMS.reduce((acc, { key }) => {
          acc[key] = {
            url: form[key].url.trim(),
            showOnSidebar: form[key].showOnSidebar,
            showOnFooter: form[key].showOnFooter,
          };
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
            <div className={styles.socialItem}>
              <span className={styles.socialLabel}>YouTube</span>
              <span className={styles.socialValue}>{contactInfo?.youtube || '—'}</span>
            </div>
            {PLATFORMS.map(({ key, label }) => {
              const entry = contactInfo?.[key];
              return (
                <div key={key} className={styles.socialItem}>
                  <span className={styles.socialLabel}>{label}</span>
                  <span className={styles.socialValue}>{entry?.url || '—'}</span>
                  {entry?.url && (
                    <span className={styles.socialFlags}>
                      {entry.showOnSidebar && <Tag tone="muted">Sidebar</Tag>}
                      {entry.showOnFooter && <Tag tone="muted">Footer</Tag>}
                    </span>
                  )}
                </div>
              );
            })}
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

        <div className={formStyles.row}>
          <span className={formStyles.label}>Social Platforms</span>
          <div className={styles.socialList}>
            <div className={styles.platformRow}>
              <label className={formStyles.label} htmlFor="contact-social-youtube">YouTube</label>
              <input
                id="contact-social-youtube"
                type="url"
                placeholder="https://"
                className={`${controlStyles.input} ${controlStyles.fullWidth}`}
                value={form.youtube}
                onChange={updateField('youtube')}
                disabled={isSaving}
              />
              {fieldErrors.youtube && (
                <p className={styles.fieldError} role="alert">{fieldErrors.youtube}</p>
              )}
            </div>
            {PLATFORMS.map(({ key, label }) => (
              <div key={key} className={styles.platformRow}>
                <label className={formStyles.label} htmlFor={`contact-social-${key}`}>{label}</label>
                <input
                  id={`contact-social-${key}`}
                  type="url"
                  placeholder="https://"
                  className={`${controlStyles.input} ${controlStyles.fullWidth}`}
                  value={form[key].url}
                  onChange={updatePlatformUrl(key)}
                  disabled={isSaving}
                />
                {fieldErrors[key] && (
                  <p className={styles.fieldError} role="alert">{fieldErrors[key]}</p>
                )}
                <div className={styles.platformToggles}>
                  <Toggle
                    checked={form[key].showOnSidebar}
                    onChange={updatePlatformFlag(key, 'showOnSidebar')}
                    label="Show on sidebar"
                    disabled={isSaving}
                  />
                  <Toggle
                    checked={form[key].showOnFooter}
                    onChange={updatePlatformFlag(key, 'showOnFooter')}
                    label="Show on footer"
                    disabled={isSaving}
                  />
                </div>
              </div>
            ))}
          </div>
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
