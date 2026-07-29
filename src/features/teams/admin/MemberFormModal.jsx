import { useState } from 'react';
import { Modal } from '@/components/shared/Modal';
import Button from '@/components/shared/Button';
import { TagInput } from '@/components/shared/TagInput';
import ImageDrop from '@/components/shared/ImageDrop';
import { teamApi } from '@/features/teams/api';
import { DEFAULT_CLUB_POSITION, POSITION_SUGGESTIONS } from '@/features/teams/constants';
import formStyles from '@/components/admin/AdminForm.module.css';
import controlStyles from '@/components/admin/FormControl.module.css';
import styles from './Teams.module.css';

const DEPARTMENT_LEAD_PREFIX = 'Department Lead';

// A member coming from the API only has a single `clubPosition` string
// (e.g. "Department Lead - Technical"). Split it back into
// { isDeptLead, position, department } so the form can pre-fill correctly.
function splitClubPosition(clubPosition) {
  const value = (clubPosition || '').trim();
  if (value.toLowerCase().startsWith(DEPARTMENT_LEAD_PREFIX.toLowerCase())) {
    const rest = value.slice(DEPARTMENT_LEAD_PREFIX.length).replace(/^[\s-–—]+/, '');
    return { isDeptLead: true, position: DEFAULT_CLUB_POSITION, department: rest };
  }
  return { isDeptLead: false, position: value || DEFAULT_CLUB_POSITION, department: '' };
}

const buildEmptyForm = (batch) => ({
  fullName: '',
  isDeptLead: false,
  position: DEFAULT_CLUB_POSITION,
  department: '',
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
      const { isDeptLead, position, department } = splitClubPosition(member.clubPosition);
      return {
        fullName: member.fullName || '',
        isDeptLead,
        position,
        department,
        specialization: member.specialization || '',
        batch: member.batch || batch,
        skills: member.skills || [],
        avatarUrl: member.avatarUrl || null,
        github: member.socials?.github || '',
        linkedin: member.socials?.linkedin || '',
        instagram: member.socials?.instagram || '',
        x: member.socials?.x || '',
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
    if (form.isDeptLead && !form.department.trim()) {
      setError('Enter the department this lead is responsible for.');
      return;
    }
    if (!form.batch) {
      setError('Select a batch.');
      return;
    }

    const clubPosition = form.isDeptLead
      ? `${DEPARTMENT_LEAD_PREFIX} - ${form.department.trim()}`
      : (form.position.trim() || DEFAULT_CLUB_POSITION);

    setIsSaving(true);
    setError(null);
    try {
      const payload = {
        fullName: form.fullName.trim(),
        clubPosition,
        specialization: form.specialization.trim(),
        batch: form.batch,
        skills: form.skills,
        avatarUrl: form.avatarUrl,
        socials: {
          github: form.github.trim(),
          linkedin: form.linkedin.trim(),
          instagram: form.instagram.trim(),
          x: form.x.trim(),
        },
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
      title={mode === 'new' ? `Add Member — Batch ${batch}` : `Edit — ${member.fullName}`}
      onClose={onClose}
      size="lg"
      variant="glow"
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className={formStyles.grid}>
          <div className={formStyles.row}>
            <label className={formStyles.label} htmlFor="member-name">Full Name</label>
            <input
              id="member-name"
              className={`${controlStyles.input} ${controlStyles.fullWidth}`}
              value={form.fullName}
              onChange={(e) => updateField('fullName', e.target.value)}
              required
            />
          </div>
          <div className={formStyles.row}>
            <label className={formStyles.label} htmlFor="member-batch">Batch (Passing Year)</label>
            <select
              id="member-batch"
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
            <label className={formStyles.label} htmlFor="member-specialization">Specialization</label>
            <input
              id="member-specialization"
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

        <div className={styles.positionBlock}>
          <label className={styles.deptLeadToggle}>
            <input
              type="checkbox"
              checked={form.isDeptLead}
              onChange={(e) => updateField('isDeptLead', e.target.checked)}
            />
            This member is a Department Lead
          </label>

          {form.isDeptLead ? (
            <div className={formStyles.row}>
              <label className={formStyles.label} htmlFor="member-department">Department</label>
              <input
                id="member-department"
                className={`${controlStyles.input} ${controlStyles.fullWidth}`}
                value={form.department}
                onChange={(e) => updateField('department', e.target.value)}
                placeholder="e.g. Technical, Design, Events"
              />
              <p className={formStyles.hint}>Will be shown on the public site as "Department Lead - {form.department || '…'}".</p>
            </div>
          ) : (
            <div className={formStyles.row}>
              <label className={formStyles.label} htmlFor="member-position">Position</label>
              <input
                id="member-position"
                className={`${controlStyles.input} ${controlStyles.fullWidth}`}
                value={form.position}
                onChange={(e) => updateField('position', e.target.value)}
                placeholder={DEFAULT_CLUB_POSITION}
                list="member-position-suggestions"
              />
              <datalist id="member-position-suggestions">
                {POSITION_SUGGESTIONS.map((p) => <option key={p} value={p} />)}
              </datalist>
              <p className={formStyles.hint}>
                Defaults to "{DEFAULT_CLUB_POSITION}". Set to "Convenor" or "Co-Convenor" to feature this
                member above the batch roster on the public site.
              </p>
            </div>
          )}
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
            <label className={formStyles.label} htmlFor="member-x">X (Twitter)</label>
            <input
              id="member-x"
              type="url"
              className={`${controlStyles.input} ${controlStyles.fullWidth}`}
              value={form.x}
              onChange={(e) => updateField('x', e.target.value)}
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
