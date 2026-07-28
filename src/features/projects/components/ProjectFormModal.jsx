import { useId, useState } from 'react';
import { Modal } from '@/components/shared/Modal';
import Button from '@/components/shared/Button';
import { Toggle } from '@/components/shared/Toggle';
import { TagInput } from '@/components/shared/TagInput';
import { CATEGORIES } from '@/features/projects/constants';
import formStyles from '@/components/admin/AdminForm.module.css';
import fieldStyles from '@/components/admin/FormControl.module.css';

const EMPTY_FORM = {
  title: '',
  team: '',
  members: 1,
  category: CATEGORIES[0],
  description: '',
  tech: [],
  github: '',
  demo: '',
  stars: 0,
  forks: 0,
  achieved: false,
};

function toFormState(project) {
  if (!project) return EMPTY_FORM;
  return {
    title: project.title || '',
    team: project.team || '',
    members: project.members ?? 1,
    category: project.category || CATEGORIES[0],
    description: project.description || '',
    tech: project.tech || [],
    github: project.github || '',
    demo: project.demo || '',
    stars: project.stars ?? 0,
    forks: project.forks ?? 0,
    achieved: !!project.achieved,
  };
}

/**
 * Admin-only. Used by features/projects/admin/Projects.jsx for both flows:
 *   project=null       — "Add New Project"
 *   project={...}       — "Edit — <title>"
 */
export default function ProjectFormModal({ project, onClose, onSubmit }) {
  const isEdit = !!project;

  const titleId = useId();
  const teamId = useId();
  const membersId = useId();
  const categoryId = useId();
  const descriptionId = useId();
  const githubId = useId();
  const demoId = useId();
  const starsId = useId();
  const forksId = useId();

  const [form, setForm] = useState(() => toFormState(project));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const setField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = form.title.trim();
    const team = form.team.trim();
    const github = form.github.trim();

    if (!title || !team || !github) {
      setError('Title, team name, and GitHub link are all required.');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        title,
        team,
        github,
        demo: form.demo.trim(),
        description: form.description.trim(),
        members: Math.max(1, Number(form.members) || 1),
        stars: Math.max(0, Number(form.stars) || 0),
        forks: Math.max(0, Number(form.forks) || 0),
      });
      onClose();
    } catch (err) {
      console.error(`Failed to ${isEdit ? 'update' : 'create'} project:`, err);
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title={isEdit ? `Edit — ${project.title}` : 'Add New Project'} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit} noValidate>
        <div className={formStyles.grid}>
          <div className={formStyles.row}>
            <label htmlFor={titleId} className={formStyles.label}>Title</label>
            <input
              id={titleId}
              className={`${fieldStyles.input} ${formStyles.fullWidth}`}
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
              autoFocus
              disabled={submitting}
            />
          </div>
          <div className={formStyles.row}>
            <label htmlFor={teamId} className={formStyles.label}>Team Name</label>
            <input
              id={teamId}
              className={`${fieldStyles.input} ${formStyles.fullWidth}`}
              value={form.team}
              onChange={(e) => setField('team', e.target.value)}
              disabled={submitting}
            />
          </div>
        </div>

        <div className={formStyles.grid}>
          <div className={formStyles.row}>
            <label htmlFor={membersId} className={formStyles.label}>Members</label>
            <input
              id={membersId}
              type="number"
              min="1"
              className={`${fieldStyles.input} ${formStyles.fullWidth}`}
              value={form.members}
              onChange={(e) => setField('members', e.target.value)}
              disabled={submitting}
            />
          </div>
          <div className={formStyles.row}>
            <label htmlFor={categoryId} className={formStyles.label}>Category</label>
            <select
              id={categoryId}
              className={`${fieldStyles.select} ${formStyles.fullWidth}`}
              value={form.category}
              onChange={(e) => setField('category', e.target.value)}
              disabled={submitting}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={formStyles.row}>
          <label htmlFor={descriptionId} className={formStyles.label}>Description</label>
          <textarea
            id={descriptionId}
            className={fieldStyles.textarea}
            value={form.description}
            onChange={(e) => setField('description', e.target.value)}
            disabled={submitting}
          />
        </div>

        <div className={formStyles.row}>
          <span className={formStyles.label}>Tech Stack</span>
          <TagInput value={form.tech} onChange={(tech) => setField('tech', tech)} placeholder="Add a technology & press Enter" />
        </div>

        <div className={formStyles.grid}>
          <div className={formStyles.row}>
            <label htmlFor={githubId} className={formStyles.label}>GitHub Link</label>
            <input
              id={githubId}
              className={`${fieldStyles.input} ${formStyles.fullWidth}`}
              value={form.github}
              onChange={(e) => setField('github', e.target.value)}
              placeholder="https://github.com/..."
              disabled={submitting}
            />
          </div>
          <div className={formStyles.row}>
            <label htmlFor={demoId} className={formStyles.label}>Demo Link (optional)</label>
            <input
              id={demoId}
              className={`${fieldStyles.input} ${formStyles.fullWidth}`}
              value={form.demo}
              onChange={(e) => setField('demo', e.target.value)}
              placeholder="https://..."
              disabled={submitting}
            />
          </div>
        </div>

        <div className={formStyles.grid}>
          <div className={formStyles.row}>
            <label htmlFor={starsId} className={formStyles.label}>Stars</label>
            <input
              id={starsId}
              type="number"
              min="0"
              className={`${fieldStyles.input} ${formStyles.fullWidth}`}
              value={form.stars}
              onChange={(e) => setField('stars', e.target.value)}
              disabled={submitting}
            />
          </div>
          <div className={formStyles.row}>
            <label htmlFor={forksId} className={formStyles.label}>Forks</label>
            <input
              id={forksId}
              type="number"
              min="0"
              className={`${fieldStyles.input} ${formStyles.fullWidth}`}
              value={form.forks}
              onChange={(e) => setField('forks', e.target.value)}
              disabled={submitting}
            />
          </div>
        </div>

        <div className={formStyles.row}>
          <Toggle 
            checked={form.achieved} 
            onChange={(v) => setField('achieved', v)} 
            label="Mark as Achieved" 
            disabled={submitting} 
          />
        </div>

        {error && <p className={formStyles.error} role="alert">{error}</p>}

        <div className={formStyles.actions}>
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" isLoading={submitting}>
            {isEdit ? 'Save Changes' : 'Add Project'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
