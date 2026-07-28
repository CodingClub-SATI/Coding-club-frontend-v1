import { useState } from 'react';
import { Modal } from '@/components/shared/Modal';
import Button from '@/components/shared/Button';
import { TagInput } from '@/components/shared/TagInput';
import ImageDrop from '@/components/shared/ImageDrop';
import { teamApi } from '@/features/teams/api';
import { TEAM_GROUPS } from '@/features/teams/constants';
import formStyles from '@/components/admin/AdminForm.module.css';
import controlStyles from '@/components/admin/FormControl.module.css';
import styles from './Teams.module.css';

const EMPTY_FORM = {
  name: '',
  role: '',
  designation: '',
  shortDescription: '',
  skills: [],
  github: '',
  linkedin: '',
  instagram: '',
  twitter: '',
  image: null,
};

export default function MemberFormModal({ mode, year, group, member, onClose, onSaved }) {
  const [form, setForm] = useState(() => (mode === 'edit' && member ? { ...EMPTY_FORM, ...member } : EMPTY_FORM));
  const [isSaving, setIsSaving] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [error, setError] = useState(null);

  const updateField = (field, fieldValue) => setForm((prev) => ({ ...prev, [field]: fieldValue }));
  const groupLabel = TEAM_GROUPS.find((g) => g.key === group)?.label || group;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Name is required.');
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      const payload = { ...form, name: form.name.trim() };
      const saved = mode === 'new'
        ? await teamApi.addMember(year, group, payload)
        : await teamApi.updateMember(year, group, member.id, payload);
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
      title={mode === 'new' ? `Add Member — ${year} / ${groupLabel}` : `Edit — ${member.name}`}
      onClose={onClose}
      size="lg"
      variant="glow"
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className={formStyles.grid}>
          <div className={formStyles.row}>
            <label className={formStyles.label} htmlFor="member-name">Name</label>
            <input
              id="member-name"
              className={`${controlStyles.input} ${controlStyles.fullWidth}`}
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              required
            />
          </div>
          <div className={formStyles.row}>
            <label className={formStyles.label} htmlFor="member-role">Role (e.g. President)</label>
            <input
              id="member-role"
              className={`${controlStyles.input} ${controlStyles.fullWidth}`}
              value={form.role}
              onChange={(e) => updateField('role', e.target.value)}
            />
          </div>
          <div className={formStyles.row}>
            <label className={formStyles.label} htmlFor="member-designation">Designation</label>
            <input
              id="member-designation"
              className={`${controlStyles.input} ${controlStyles.fullWidth}`}
              value={form.designation}
              onChange={(e) => updateField('designation', e.target.value)}
              placeholder="e.g. Full Stack Developer"
            />
          </div>
          <div className={formStyles.row}>
            <span className={formStyles.label}>Photo</span>
            <ImageDrop
              value={form.image}
              onChange={(image) => updateField('image', image)}
              aspect="1/1"
              onUploadingChange={setIsImageUploading}
            />
          </div>
        </div>

        <div className={formStyles.row}>
          <label className={formStyles.label} htmlFor="member-bio">Short Description</label>
          <textarea
            id="member-bio"
            className={controlStyles.textarea}
            value={form.shortDescription}
            onChange={(e) => updateField('shortDescription', e.target.value)}
            placeholder="One or two lines about this member"
          />
        </div>

        <div className={formStyles.row}>
          <span className={formStyles.label}>Skills</span>
          <TagInput value={form.skills} onChange={(skills) => updateField('skills', skills)} placeholder="Add a skill & press Enter" />
        </div>

        <div className={formStyles.grid}>
          <div className={formStyles.row}>
            <label className={formStyles.label} htmlFor="member-github">GitHub</label>
            <input
              id="member-github"
              type="url"
              className={`${controlStyles.input} ${controlStyles.fullWidth}`}
              value={form.github}
              onChange={(e) => updateField('github', e.target.value)}
              placeholder="https://github.com/..."
            />
          </div>
          <div className={formStyles.row}>
            <label className={formStyles.label} htmlFor="member-linkedin">LinkedIn</label>
            <input
              id="member-linkedin"
              type="url"
              className={`${controlStyles.input} ${controlStyles.fullWidth}`}
              value={form.linkedin}
              onChange={(e) => updateField('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          <div className={formStyles.row}>
            <label className={formStyles.label} htmlFor="member-instagram">Instagram</label>
            <input
              id="member-instagram"
              type="url"
              className={`${controlStyles.input} ${controlStyles.fullWidth}`}
              value={form.instagram}
              onChange={(e) => updateField('instagram', e.target.value)}
              placeholder="https://instagram.com/..."
            />
          </div>
          <div className={formStyles.row}>
            <label className={formStyles.label} htmlFor="member-twitter">X (Twitter)</label>
            <input
              id="member-twitter"
              type="url"
              className={`${controlStyles.input} ${controlStyles.fullWidth}`}
              value={form.twitter}
              onChange={(e) => updateField('twitter', e.target.value)}
              placeholder="https://x.com/..."
            />
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
