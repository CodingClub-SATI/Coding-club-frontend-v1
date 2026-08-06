import { useState } from 'react';
import { useLoaderData } from 'react-router';
import { AlertTriangle, FolderGit2, Pencil, Plus, Trash2 } from 'lucide-react';
import AdminTitle from '@/components/admin/AdminTitle';
import EmptyState from '@/components/shared/EmptyState';
import Button from '@/components/shared/Button';
import { ConfirmButton } from '@/components/shared/ConfirmButton';
import Tag from '@/components/shared/Tag';
import { projectsApi } from '@/features/projects/api';
import { CATEGORY_TONES } from '@/features/projects/constants';
import ProjectFormModal from '@/features/projects/components/ProjectFormModal';
import tableStyles from '@/components/admin/Table.module.css';
import statStyles from '@/components/admin/StatStrip.module.css';
import formStyles from '@/components/admin/AdminForm.module.css';
import styles from './Projects.module.css';

export default function Projects() {
  const { projects: initialProjects, error: loadError } = useLoaderData();

  const [projects, setProjects] = useState(initialProjects);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null); // null while modalOpen => "add new"
  const [actionError, setActionError] = useState('');
  const [busyProjectId, setBusyProjectId] = useState(null);

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
      </div>

      {actionError && <p className={formStyles.error} role="alert">{actionError}</p>}

      {loadError ? (
        <EmptyState icon={AlertTriangle} title={loadError} subtitle="Try refreshing the page in a moment." />
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderGit2}
          title="No projects yet"
          subtitle='Use "Add New Project" to create the first one.'
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
                <th className={tableStyles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => {
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
                      <div className={styles.rowActions} onClick={(e) => e.stopPropagation()}>
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
