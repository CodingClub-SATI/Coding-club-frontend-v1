import { useState } from 'react';
import { Modal } from '@/components/shared/Modal';
import Button from '@/components/shared/Button';
import { TagInput } from '@/components/shared/TagInput';
import ImageDrop from '@/components/shared/ImageDrop';
import { teamApi } from '@/features/teams/api';
import formStyles from '@/components/admin/AdminForm.module.css';
import controlStyles from '@/components/admin/FormControl.module.css';
import styles from './Teams.module.css';

const buildEmptyForm = (batch) => ({
  fullName: '',
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

  const updateField = (field, fieldValue) => setForm((prev) => ({ ...prev, [field]: fieldValue }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!form.batch) {
      setError('Select a batch.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const payload = {
        fullName: form.fullName.trim(),
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
      setError(err.message || 'Something went wrong. Please try again.');
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
            <label className={formStyles.label}>Full Name</label>
            <input
              className={`${controlStyles.input} ${controlStyles.fullWidth}`}
              value={form.fullName}
              onChange={(e) => updateField('fullName', e.target.value)}
              required
            />
          </div>
          <div className={formStyles.row}>
            <label className={formStyles.label}>Batch (Passing Year)</label>
            <select
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
            <label className={formStyles.label}>Specialization</label>
            <input
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
          <span className={formStyles.label}>Skills</span>
          <TagInput value={form.skills} onChange={(skills) => updateField('skills', skills)} placeholder="Add a skill & press Enter" />
        </div>

        <div className={formStyles.grid}>
          <div className={formStyles.row}>
            <label className={formStyles.label}>GitHub</label>
            <input type="url" className={`${controlStyles.input} ${controlStyles.fullWidth}`} value={form.github} onChange={(e) => updateField('github', e.target.value)} placeholder="https://github.com/..." />
          </div>
          <div className={formStyles.row}>
            <label className={formStyles.label}>LinkedIn</label>
            <input type="url" className={`${controlStyles.input} ${controlStyles.fullWidth}`} value={form.linkedin} onChange={(e) => updateField('linkedin', e.target.value)} placeholder="https://linkedin.com/in/..." />
          </div>
          <div className={formStyles.row}>
            <label className={formStyles.label}>Instagram</label>
            <input type="url" className={`${controlStyles.input} ${controlStyles.fullWidth}`} value={form.instagram} onChange={(e) => updateField('instagram', e.target.value)} placeholder="https://instagram.com/..." />
          </div>
          <div className={formStyles.row}>
            <label className={formStyles.label}>X (Twitter)</label>
            <input type="url" className={`${controlStyles.input} ${controlStyles.fullWidth}`} value={form.x} onChange={(e) => updateField('x', e.target.value)} placeholder="https://x.com/..." />
          </div>
        </div>

        {error && <p className={styles.formError} role="alert">{error}</p>}
        
        <div className={formStyles.actions}>
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isSaving} disabled={isImageUploading}>
            {mode === 'new' ? 'Add Member' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}