import { useMemo, useState } from 'react';
import { useLoaderData, useRevalidator } from 'react-router';
import { Plus, Users, AlertTriangle } from 'lucide-react';
import AdminTitle from '@/components/admin/AdminTitle';
import Button from '@/components/shared/Button';
import EmptyState from '@/components/shared/EmptyState';
import { Modal } from '@/components/shared/Modal';
import MemberAvatar from '@/features/teams/components/MemberAvatar';
import MemberFormModal from './MemberFormModal';
import MemberDetailPanel from './MemberDetailPanel';
import { teamApi } from '@/features/teams/api';
import { TEAM_GROUPS } from '@/features/teams/constants';
import formStyles from '@/components/admin/AdminForm.module.css';
import controlStyles from '@/components/admin/FormControl.module.css';
import badgeStyles from '@/components/admin/Badge.module.css';
import yearStyles from '@/components/admin/YearGroup.module.css';
import tileStyles from '@/components/admin/Tile.module.css';
import styles from './Teams.module.css';

export default function Teams() {
  const { years, byYear, currentYear, error } = useLoaderData();
  const revalidator = useRevalidator();

  const [selected, setSelected] = useState(null); // { year, group, member }
  const [editing, setEditing] = useState(null); // { mode, year, group, member }
  const [addingYear, setAddingYear] = useState(false);
  const [yearInput, setYearInput] = useState('');
  const [yearError, setYearError] = useState(null);
  const [isSavingYear, setIsSavingYear] = useState(false);

  const { currentYearMembers, totalMembers } = useMemo(() => {
    const countYear = (groups) => TEAM_GROUPS.reduce((sum, g) => sum + (groups?.[g.key]?.length || 0), 0);
    const total = years.reduce((sum, y) => sum + countYear(byYear[y]), 0);
    return { currentYearMembers: countYear(byYear[currentYear]), totalMembers: total };
  }, [years, byYear, currentYear]);

  const openNewMember = (year, group) => setEditing({ mode: 'new', year, group, member: null });
  const openEditMember = (year, group, member) => {
    setSelected(null);
    setEditing({ mode: 'edit', year, group, member });
  };

  const handleMemberSaved = () => {
    setEditing(null);
    revalidator.revalidate();
  };

  const handleMemberDeleted = () => {
    setSelected(null);
    revalidator.revalidate();
  };

  const handleRowKeyDown = (e, year, group, member) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelected({ year, group, member });
    }
  };

  const handleAddYear = async (e) => {
    e.preventDefault();
    if (!yearInput.trim()) {
      setYearError('Enter a year, e.g. 2026-27.');
      return;
    }

    setIsSavingYear(true);
    setYearError(null);
    try {
      await teamApi.addYear(yearInput.trim());
      setAddingYear(false);
      setYearInput('');
      revalidator.revalidate();
    } catch (err) {
      console.error('Failed to add team year:', err);
      setYearError(err.message || 'Could not add this year. Try again.');
    } finally {
      setIsSavingYear(false);
    }
  };

  return (
    <div>
      <AdminTitle
        title="Team"
        subtitle={`${currentYearMembers} current members (${currentYear ?? '—'}) · ${totalMembers} across all years`}
      >
        <Button onClick={() => setAddingYear(true)}><Plus size={16} aria-hidden="true" /> Add Year</Button>
      </AdminTitle>

      {error ? (
        <EmptyState icon={AlertTriangle} title={error} subtitle="Try refreshing the page in a moment." />
      ) : years.length === 0 ? (
        <EmptyState icon={Users} title="No team years yet" subtitle="Add a year to start building your team roster." />
      ) : (
        years.map((year) => (
          <div key={year} className={yearStyles.yearGroup}>
            <h2 className={yearStyles.yearHeading}>
              {year}
              {year === currentYear && (
                <span className={`${badgeStyles.badge} ${badgeStyles.featured}`}>Current</span>
              )}
            </h2>

            {TEAM_GROUPS.map(({ key, label }) => {
              const members = byYear[year]?.[key] || [];
              return (
                <div key={key}>
                  <div className={styles.groupHeader}>
                    <h3 className={yearStyles.subgroupLabel}>{label} ({members.length})</h3>
                    <Button variant="ghost" size="sm" onClick={() => openNewMember(year, key)}>
                      <Plus size={12} aria-hidden="true" /> Add Member
                    </Button>
                  </div>

                  {members.length === 0 ? (
                    <p className={styles.emptyGroup}>No members in this group yet.</p>
                  ) : (
                    <div className={styles.tileGrid}>
                      {members.map((member) => (
                        <div
                          key={member.id}
                          className={tileStyles.tile}
                          onClick={() => setSelected({ year, group: key, member })}
                          onKeyDown={(e) => handleRowKeyDown(e, year, key, member)}
                          role="button"
                          tabIndex={0}
                          aria-label={`View ${member.name}'s profile`}
                        >
                          <div className={`${tileStyles.tileThumb} ${styles.squareThumb}`}>
                            <MemberAvatar member={member} size={64} />
                          </div>
                          <div className={tileStyles.tileBody}>
                            <div className={tileStyles.tileTitle}>{member.name}</div>
                            <div className={tileStyles.tileSub}>{member.role || member.designation}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))
      )}

      {selected && (
        <MemberDetailPanel
          year={selected.year}
          group={selected.group}
          member={selected.member}
          onClose={() => setSelected(null)}
          onEdit={() => openEditMember(selected.year, selected.group, selected.member)}
          onDeleted={handleMemberDeleted}
        />
      )}

      {editing && (
        <MemberFormModal
          mode={editing.mode}
          year={editing.year}
          group={editing.group}
          member={editing.member}
          onClose={() => setEditing(null)}
          onSaved={handleMemberSaved}
        />
      )}

      {addingYear && (
        <Modal title="Add New Team Year" onClose={() => setAddingYear(false)}>
          <form onSubmit={handleAddYear} noValidate>
            <div className={formStyles.row}>
              <label className={formStyles.label} htmlFor="new-year">Year (e.g. 2026-27)</label>
              <input
                id="new-year"
                className={`${controlStyles.input} ${controlStyles.fullWidth}`}
                value={yearInput}
                onChange={(e) => setYearInput(e.target.value)}
                autoFocus
              />
            </div>
            {yearError && <p className={styles.formError} role="alert">{yearError}</p>}
            <div className={formStyles.actions}>
              <Button type="button" variant="ghost" onClick={() => setAddingYear(false)}>Cancel</Button>
              <Button type="submit" isLoading={isSavingYear}>Add Year</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
