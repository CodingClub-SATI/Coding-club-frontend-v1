import { useId, useState } from 'react';
import { Modal } from '@/components/shared/Modal';
import Button from '@/components/shared/Button';
import { TagInput } from '@/components/shared/TagInput';
import ImageDrop from '@/components/shared/ImageDrop';
import { teamApi } from '@/features/teams/api';
import { isValidUrl } from '@/utils/validation';
import { fieldErrorsFromApiError } from '@/utils/apiErrors';

// Keep in sync with the backend's teamModel.js: skills: stringArray(3)
const MAX_SKILLS = 3;
import formStyles from '@/components/admin/AdminForm.module.css';
import controlStyles from '@/components/admin/FormControl.module.css';
import styles from './Teams.module.css';

const buildEmptyForm = (batch) => ({
  fullName: '',
  enrollmentNumber: '',
  specialization: '',
  batch,
  skills: [],
  avatarUrl: null,
  github: '',
  linkedin: '',
  instagram: '',
  x: '',
});

export default function MemberFormModal({ mode, batch, availableBatches, member, onClose, onSaved }) {
  const [form, setForm] = useState(() => {
    if (mode === 'edit' && member) {
      return {
        fullName: member.fullName || '',
        enrollmentNumber: member.enrollmentNumber || '',
        specialization: member.specialization || '',
        batch: member.batch || batch,
        skills: member.skills || [],
        avatarUrl: member.avatarUrl || null,
        github: member.github || '',
        linkedin: member.linkedin || '',
        instagram: member.instagram || '',
        x: member.x || '',
      };
    }
    return buildEmptyForm(batch);
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const uid = useId();

  const updateField = (field, fieldValue) => setForm((prev) => ({ ...prev, [field]: fieldValue }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!form.enrollmentNumber.trim()) {
      setError('Enrollment number is required.');
      return;
    }
    if (!form.batch) {
      setError('Select a batch.');
      return;
    }

    const nextFieldErrors = {};
    [['github', form.github], ['linkedin', form.linkedin], ['instagram', form.instagram], ['x', form.x]]
      .forEach(([key, value]) => {
        if (value.trim() && !isValidUrl(value.trim())) {
          nextFieldErrors[key] = 'Must start with http:// or https://';
        }
      });

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      setError('Fix the highlighted fields before saving.');
      return;
    }

    setIsSaving(true);
    setError(null);
    setFieldErrors({});

    try {
      const payload = {
        fullName: form.fullName.trim(),
        enrollmentNumber: form.enrollmentNumber.trim(),
        specialization: form.specialization.trim(),
        batch: form.batch,
        skills: form.skills,
        avatarUrl: form.avatarUrl,
        github: form.github.trim(),
        linkedin: form.linkedin.trim(),
        instagram: form.instagram.trim(),
        x: form.x.trim(),
      };

      const saved = mode === 'new'
        ? await teamApi.addMember(payload)
        : await teamApi.updateMember(member.id, payload);

      onSaved(saved);
    } catch (err) {
      console.error(`Failed to ${mode === 'new' ? 'add' : 'update'} team member:`, err);
      const apiFieldErrors = fieldErrorsFromApiError(err);
      if (Object.keys(apiFieldErrors).length > 0) {
        setFieldErrors((prev) => ({ ...prev, ...apiFieldErrors }));
        setError('Fix the highlighted fields before saving.');
      } else {
        setError(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      title={mode === 'new' ? `Add Member - Batch ${batch}` : `Edit - ${member.fullName}`}
      onClose={onClose}
      size="lg"
      variant="glow"
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className={formStyles.grid}>
          <div className={formStyles.row}>
            <label className={formStyles.label} htmlFor={`${uid}-fullName`}>Full Name</label>
            <input
              id={`${uid}-fullName`}
              className={`${controlStyles.input} ${controlStyles.fullWidth}`}
              value={form.fullName}
              onChange={(e) => updateField('fullName', e.target.value)}
              required
            />
          </div>
          <div className={formStyles.row}>
            <label className={formStyles.label} htmlFor={`${uid}-enrollmentNumber`}>Enrollment Number</label>
            <input
              id={`${uid}-enrollmentNumber`}
              className={`${controlStyles.input} ${controlStyles.fullWidth}`}
              value={form.enrollmentNumber}
              onChange={(e) => updateField('enrollmentNumber', e.target.value)}
              placeholder="e.g. 0801CS221045"
              required
            />
          </div>
          <div className={formStyles.row}>
            <label className={formStyles.label} htmlFor={`${uid}-batch`}>Batch (Passing Year)</label>
            <select
              id={`${uid}-batch`}
              className={`${controlStyles.select} ${controlStyles.fullWidth}`}
              value={form.batch}
              onChange={(e) => updateField('batch', e.target.value)}
              required
            >
              {availableBatches.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div className={formStyles.row}>
            <label className={formStyles.label} htmlFor={`${uid}-specialization`}>Specialization</label>
            <input
              id={`${uid}-specialization`}
              className={`${controlStyles.input} ${controlStyles.fullWidth}`}
              value={form.specialization}
              onChange={(e) => updateField('specialization', e.target.value)}
              placeholder="e.g. Full Stack Developer"
            />
          </div>
          <div className={formStyles.row}>
            <span className={formStyles.label}>Photo</span>
            <ImageDrop
              value={form.avatarUrl}
              onChange={(avatarUrl) => updateField('avatarUrl', avatarUrl)}
              aspect="1/1"
              onUploadingChange={setIsImageUploading}
            />
          </div>
        </div>

        <div className={formStyles.row}>
          <label className={formStyles.label} htmlFor={`${uid}-skills`}>Skills</label>
          <TagInput
            id={`${uid}-skills`}
            value={form.skills}
            onChange={(skills) => updateField('skills', skills)}
            placeholder="Add a skill & press Enter"
            maxTags={MAX_SKILLS}
          />
          {fieldErrors.skills && <p className={styles.formError} role="alert">{fieldErrors.skills}</p>}
        </div>

        <div className={formStyles.grid}>
          <div className={formStyles.row}>
            <label className={formStyles.label} htmlFor={`${uid}-github`}>GitHub</label>
            <input id={`${uid}-github`} type="url" className={`${controlStyles.input} ${controlStyles.fullWidth}`} value={form.github} onChange={(e) => updateField('github', e.target.value)} placeholder="https://github.com/..." />
            {fieldErrors.github && <p className={styles.formError} role="alert">{fieldErrors.github}</p>}
          </div>
          <div className={formStyles.row}>
            <label className={formStyles.label} htmlFor={`${uid}-linkedin`}>LinkedIn</label>
            <input id={`${uid}-linkedin`} type="url" className={`${controlStyles.input} ${controlStyles.fullWidth}`} value={form.linkedin} onChange={(e) => updateField('linkedin', e.target.value)} placeholder="https://linkedin.com/in/..." />
            {fieldErrors.linkedin && <p className={styles.formError} role="alert">{fieldErrors.linkedin}</p>}
          </div>
          <div className={formStyles.row}>
            <label className={formStyles.label} htmlFor={`${uid}-instagram`}>Instagram</label>
            <input id={`${uid}-instagram`} type="url" className={`${controlStyles.input} ${controlStyles.fullWidth}`} value={form.instagram} onChange={(e) => updateField('instagram', e.target.value)} placeholder="https://instagram.com/..." />
            {fieldErrors.instagram && <p className={styles.formError} role="alert">{fieldErrors.instagram}</p>}
          </div>
          <div className={formStyles.row}>
            <label className={formStyles.label} htmlFor={`${uid}-x`}>X (Twitter)</label>
            <input id={`${uid}-x`} type="url" className={`${controlStyles.input} ${controlStyles.fullWidth}`} value={form.x} onChange={(e) => updateField('x', e.target.value)} placeholder="https://x.com/..." />
            {fieldErrors.x && <p className={styles.formError} role="alert">{fieldErrors.x}</p>}
          </div>
        </div>

        {error && <p className={styles.formError} role="alert">{error}</p>}
        
        <div className={formStyles.actions}>
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>Cancel</Button>
          <Button type="submit" isLoading={isSaving} disabled={isImageUploading}>
            {mode === 'new' ? 'Add Member' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}