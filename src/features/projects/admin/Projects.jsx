import { useId, useMemo, useState } from 'react';
import { useLoaderData } from 'react-router';
import { AlertTriangle, FolderGit2, Pencil, Plus, Trash2, Trophy } from 'lucide-react';
import AdminTitle from '@/components/admin/AdminTitle';
import EmptyState from '@/components/shared/EmptyState';
import Button from '@/components/shared/Button';
import { ConfirmButton } from '@/components/shared/ConfirmButton';
import Tag from '@/components/shared/Tag';
import { projectsApi } from '@/features/projects/api';
import { CATEGORY_TONES } from '@/features/projects/constants';
import ProjectFormModal from '@/features/projects/components/ProjectFormModal';
import tableStyles from '@/components/admin/Table.module.css';
import filterStyles from '@/components/admin/FilterBar.module.css';
import statStyles from '@/components/admin/StatStrip.module.css';
import badgeStyles from '@/components/admin/Badge.module.css';
import fieldStyles from '@/components/admin/FormControl.module.css';
import formStyles from '@/components/admin/AdminForm.module.css';
import styles from './Projects.module.css';

const STATUS_FILTERS = [
  { value: 'all', label: 'All Projects' },
  { value: 'active', label: 'Active' },
  { value: 'achieved', label: 'Achieved' },
];

export default function Projects() {
  const { projects: initialProjects, error: loadError } = useLoaderData();
  const filterId = useId();

  const [projects, setProjects] = useState(initialProjects);
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null); // null while modalOpen => "add new"
  const [actionError, setActionError] = useState('');
  const [busyProjectId, setBusyProjectId] = useState(null);

  const achievedCount = useMemo(() => projects.filter((p) => p.achieved).length, [projects]);

  const filtered = useMemo(() => {
    if (statusFilter === 'achieved') return projects.filter((p) => p.achieved);
    if (statusFilter === 'active') return projects.filter((p) => !p.achieved);
    return projects;
  }, [projects, statusFilter]);

  const openCreate = () => {
    setEditingProject(null);
    setModalOpen(true);
  };

  const openEdit = (project) => {
    setEditingProject(project);
    setModalOpen(true);
  };

  const handleCreate = async (values) => {
    const newProject = await projectsApi.create(values);
    setProjects((prev) => [newProject, ...prev]);
  };

  const handleUpdate = async (project, values) => {
    const updated = await projectsApi.update(project.id, values);
    setProjects((prev) => prev.map((p) => (p.id === project.id ? updated : p)));
  };

  const handleToggleAchieved = async (project) => {
    setActionError('');
    setBusyProjectId(project.id);
    try {
      const updated = await projectsApi.update(project.id, { achieved: !project.achieved });
      setProjects((prev) => prev.map((p) => (p.id === project.id ? updated : p)));
    } catch (err) {
      console.error('Failed to update achieved status:', err);
      setActionError('Could not update this project. Please try again.');
    } finally {
      setBusyProjectId(null);
    }
  };

  const handleDelete = async (project) => {
    setActionError('');
    setBusyProjectId(project.id);
    try {
      await projectsApi.remove(project.id);
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
    } catch (err) {
      console.error('Failed to delete project:', err);
      setActionError('Could not delete this project. Please try again.');
      setBusyProjectId(null);
    }
  };

  return (
    <div>
      <AdminTitle title="Projects" subtitle="Manage submitted projects and the public leaderboard.">
        <Button onClick={openCreate}>
          <Plus size={16} /> Add New Project
        </Button>
      </AdminTitle>

      <div className={statStyles.statStrip}>
        <div className={statStyles.statPill}>
          <div className={statStyles.statValue}>{projects.length}</div>
          <div className={statStyles.statLabel}>Total Projects</div>
        </div>
        <div className={statStyles.statPill}>
          <div className={statStyles.statValue}>{achievedCount}</div>
          <div className={statStyles.statLabel}>Achieved</div>
        </div>
      </div>

      <div className={filterStyles.filterBar}>
        <label htmlFor={filterId} className={styles.filterLabel}>Status</label>
        <select
          id={filterId}
          className={fieldStyles.select}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {STATUS_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>

      {actionError && <p className={formStyles.error} role="alert">{actionError}</p>}

      {loadError ? (
        <EmptyState icon={AlertTriangle} title={loadError} subtitle="Try refreshing the page in a moment." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FolderGit2}
          title={projects.length === 0 ? 'No projects yet' : 'No projects match this filter'}
          subtitle={projects.length === 0 ? 'Use "Add New Project" to create the first one.' : 'Try a different status filter.'}
        />
      ) : (
        <div className={tableStyles.tableWrap}>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th className={tableStyles.th}>Project</th>
                <th className={tableStyles.th}>Category</th>
                <th className={tableStyles.th}>Tech</th>
                <th className={tableStyles.th}>Stats</th>
                <th className={tableStyles.th}>Status</th>
                <th className={tableStyles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((project) => {
                const tech = project.tech || [];
                const visibleTech = tech.slice(0, 3);
                const overflowCount = tech.length - visibleTech.length;

                return (
                  <tr key={project.id} className={tableStyles.tr} onClick={() => openEdit(project)}>
                    <td className={tableStyles.td}>
                      <div className={styles.projectTitle}>{project.title}</div>
                      <div className={styles.projectMeta}>
                        {project.team} · {project.members} {project.members === 1 ? 'member' : 'members'}
                      </div>
                    </td>
                    <td className={tableStyles.td}>
                      <Tag tone={CATEGORY_TONES[project.category] || 'muted'}>{project.category}</Tag>
                    </td>
                    <td className={tableStyles.td}>
                      <div className={styles.techCell}>
                        {visibleTech.map((t) => (
                          <Tag key={t} tone="muted">{t}</Tag>
                        ))}
                        {overflowCount > 0 && <span className={styles.techMore}>+{overflowCount}</span>}
                      </div>
                    </td>
                    <td className={tableStyles.td}>
                      <span className={styles.stats}>⭐ {project.stars} · 🍴 {project.forks}</span>
                    </td>
                    <td className={tableStyles.td}>
                      {project.achieved ? (
                        <span className={`${badgeStyles.badge} ${badgeStyles.featured}`}>
                          <Trophy size={10} /> Achieved
                        </span>
                      ) : (
                        <span className={`${badgeStyles.badge} ${badgeStyles.archived}`}>Active</span>
                      )}
                    </td>
                    <td className={tableStyles.td}>
                      <div className={styles.rowActions} onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" disabled={busyProjectId === project.id} onClick={() => handleToggleAchieved(project)}>
                          <Trophy size={12} /> {project.achieved ? 'Unmark' : 'Mark Achieved'}
                        </Button>
                        <Button variant="ghost" size="sm" disabled={busyProjectId === project.id} onClick={() => openEdit(project)}>
                          <Pencil size={12} /> Edit
                        </Button>
                        <ConfirmButton
                          label={<><Trash2 size={12} /> Delete</>}
                          confirmLabel="Delete?"
                          danger
                          onConfirm={() => handleDelete(project)}
                          disabled={busyProjectId === project.id}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <ProjectFormModal
          project={editingProject}
          onClose={() => setModalOpen(false)}
          onSubmit={(values) => (editingProject ? handleUpdate(editingProject, values) : handleCreate(values))}
        />
      )}
    </div>
  );
}
