import { useMemo, useState } from 'react';
import { useLoaderData, useRevalidator } from 'react-router';
import { AlertTriangle, Archive, ArchiveRestore, ArrowLeft, Plus, Trash2, Users, Shield } from 'lucide-react';
import AdminTitle from '@/components/admin/AdminTitle';
import Button from '@/components/shared/Button';
import EmptyState from '@/components/shared/EmptyState';
import { Modal } from '@/components/shared/Modal';
import { ConfirmButton } from '@/components/shared/ConfirmButton';
import MemberAvatar from '@/features/teams/components/MemberAvatar';
import MemberFormModal from './MemberFormModal';
import MemberDetailPanel from './MemberDetailPanel';
import LeadershipModal from './LeadershipModal';
import { teamApi } from '@/features/teams/api';
import formStyles from '@/components/admin/AdminForm.module.css';
import controlStyles from '@/components/admin/FormControl.module.css';
import badgeStyles from '@/components/admin/Badge.module.css';
import tileStyles from '@/components/admin/Tile.module.css';
import styles from './Teams.module.css';

export default function Teams() {
  const { batches: initialBatches, error: loadError } = useLoaderData();
  const revalidator = useRevalidator();
  
  const [batches, setBatches] = useState(initialBatches);

  const [prevInitialBatches, setPrevInitialBatches] = useState(initialBatches);
  if (initialBatches !== prevInitialBatches) {
    setPrevInitialBatches(initialBatches);
    setBatches(initialBatches);
  }

  const [openBatchName, setOpenBatchName] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [editingMember, setEditingMember] = useState(null); 
  const [managingLeadership, setManagingLeadership] = useState(false);
  const [addingBatch, setAddingBatch] = useState(false);
  const [batchInput, setBatchInput] = useState('');
  const [batchError, setBatchError] = useState(null);
  const [isSavingBatch, setIsSavingBatch] = useState(false);
  const [actionError, setActionError] = useState('');
  const [busyBatch, setBusyBatch] = useState(null);

  const openBatch = batches.find((b) => b.batch === openBatchName) || null;

  const totalMembers = useMemo(
    () => batches.reduce((sum, b) => sum + (b.memberCount ?? b.members?.length ?? 0), 0),
    [batches]
  );
  const availableBatches = useMemo(() => batches.map((b) => b.batch), [batches]);

  // ===============
  // Batches
  // ================
  const handleAddBatch = async (e) => {
    e.preventDefault();
    if (!batchInput.trim()) {
      setBatchError('Enter a batch (passing year), e.g. 2028.');
      return;
    }
    setIsSavingBatch(true);
    setBatchError(null);
    try {
      const created = await teamApi.createBatch(batchInput.trim());
      setBatches((prev) => [created, ...prev]);
      setAddingBatch(false);
      setBatchInput('');
    } catch (err) {
      console.error('Failed to add batch:', err);
      setBatchError(err.message || 'Could not add this batch. Try again.');
    } finally {
      setIsSavingBatch(false);
    }
  };

  const handleToggleArchive = async (batch) => {
    setActionError('');
    setBusyBatch(batch.batch);
    try {
      const updated = await teamApi.setBatchArchived(batch.batch, !batch.archived);
      setBatches((prev) => prev.map((b) => (b.batch === batch.batch ? { ...b, ...updated } : b)));
    } catch (err) {
      console.error('Failed to update batch:', err);
      setActionError('Could not update this batch. Please try again.');
    } finally {
      setBusyBatch(null);
    }
  };

  const handleDeleteBatch = async (batch) => {
    setActionError('');
    setBusyBatch(batch.batch);
    try {
      await teamApi.removeBatch(batch.batch);
      setBatches((prev) => prev.filter((b) => b.batch !== batch.batch));
      if (openBatchName === batch.batch) setOpenBatchName(null);
    } catch (err) {
      console.error('Failed to delete batch:', err);
      setActionError(err.message || 'Could not delete this batch. It may still have members in it.');
      setBusyBatch(null);
    }
  };

  // =================
  // Members
  // =================
  const openNewMember = () => setEditingMember({ mode: 'new', member: null });
  const openEditMember = (member) => {
    setSelectedMember(null);
    setEditingMember({ mode: 'edit', member });
  };

  const handleMemberSaved = (saved) => {
    const wasEditing = editingMember?.mode === 'edit';
    const previousBatch = editingMember?.member?.batch;
    setEditingMember(null);

    setBatches((prev) => {
      if (wasEditing && previousBatch && previousBatch !== saved.batch) {
        return prev.map((b) => {
          if (b.batch === previousBatch) {
            const members = b.members.filter((m) => m.id !== saved.id);
            return { ...b, members, memberCount: members.length };
          }
          if (b.batch === saved.batch) {
            const members = [...b.members, saved];
            return { ...b, members, memberCount: members.length };
          }
          return b;
        });
      }
      if (wasEditing) {
        return prev.map((b) =>
          b.batch === saved.batch
            ? { ...b, members: b.members.map((m) => (m.id === saved.id ? saved : m)) }
            : b
        );
      }
      return prev.map((b) =>
        b.batch === saved.batch
          ? { ...b, members: [...b.members, saved], memberCount: b.members.length + 1 }
          : b
      );
    });
  };

  const handleMemberDeleted = (member) => {
    setSelectedMember(null);
    setBatches((prev) =>
      prev.map((b) =>
        b.batch === member.batch
          ? {
              ...b,
              members: b.members.filter((m) => m.id !== member.id),
              memberCount: Math.max(0, (b.memberCount ?? b.members.length) - 1),
            }
          : b
      )
    );
  };

  const handleMemberRowKeyDown = (e, member) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedMember(member);
    }
  };

  // ==============
  // Batch detail view
  // ==================
  if (openBatch) {
    return (
      <div>
        <Button variant="ghost" size="sm" className={styles.backBtn} onClick={() => setOpenBatchName(null)}>
          <ArrowLeft size={16} /> Back to Batches
        </Button>
        <AdminTitle
          title={`Batch ${openBatch.batch}`}
          subtitle={`${openBatch.members.length} member${openBatch.members.length === 1 ? '' : 's'}${openBatch.archived ? ' • Archived (hidden from public site)' : ''}`}
        >
          <Button onClick={openNewMember}><Plus size={16} aria-hidden="true" /> Add Member</Button>
        </AdminTitle>
        
        {actionError && <p className={formStyles.error} role="alert">{actionError}</p>}
        
        {openBatch.members.length === 0 ? (
          <EmptyState icon={Users} title="No members yet" subtitle='Use "Add Member" to add someone to this batch.' />
        ) : (
          <div className={styles.tileGrid}>
            {openBatch.members.map((member) => (
              <div
                key={member.id}
                className={tileStyles.tile}
                onClick={() => setSelectedMember(member)}
                onKeyDown={(e) => handleMemberRowKeyDown(e, member)}
                role="button"
                tabIndex={0}
                aria-label={`View ${member.fullName}'s profile`}
              >
                <div className={`${tileStyles.tileThumb} ${styles.squareThumb}`}>
                  <MemberAvatar member={member} size={64} />
                  {member.isLeadership && (
                    <span className={`${badgeStyles.badge} ${badgeStyles.featured} ${styles.leadershipBadge}`}>Leadership</span>
                  )}
                </div>
                <div className={tileStyles.tileBody}>
                  <div className={tileStyles.tileTitle}>{member.fullName}</div>
                  <div className={tileStyles.tileSub}>{member.clubPosition}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedMember && (
          <MemberDetailPanel
            member={selectedMember}
            onClose={() => setSelectedMember(null)}
            onEdit={() => openEditMember(selectedMember)}
            onDeleted={handleMemberDeleted}
          />
        )}

        {editingMember && (
          <MemberFormModal
            mode={editingMember.mode}
            batch={openBatch.batch}
            availableBatches={availableBatches}
            member={editingMember.member}
            onClose={() => setEditingMember(null)}
            onSaved={handleMemberSaved}
          />
        )}
      </div>
    );
  }

  // =======================
  // Batch grid view
  // =======================
  return (
    <div>
      <AdminTitle
        title="Team"
        subtitle={`${batches.length} batch${batches.length === 1 ? '' : 'es'} • ${totalMembers} member${totalMembers === 1 ? '' : 's'} total`}
      >
        <div className={styles.headerActions}>
          <Button variant="outline" tone="secondary" onClick={() => setManagingLeadership(true)}>
            <Shield size={16} aria-hidden="true" /> Manage Leadership
          </Button>
          <Button onClick={() => setAddingBatch(true)}>
            <Plus size={16} aria-hidden="true" /> Add Batch
          </Button>
        </div>
      </AdminTitle>
      
      {actionError && <p className={formStyles.error} role="alert">{actionError}</p>}
      
      {loadError ? (
        <EmptyState icon={AlertTriangle} title={loadError} subtitle="Try refreshing the page in a moment." />
      ) : batches.length === 0 ? (
        <EmptyState icon={Users} title="No batches yet" subtitle='Use "Add Batch" to start building your team roster.' />
      ) : (
        <div className={styles.batchGrid}>
          {batches.map((batch) => {
            const count = batch.memberCount ?? batch.members?.length ?? 0;
            return (
              <div key={batch.batch} className={tileStyles.tile}>
                <button
                  type="button"
                  className={styles.tileOpenBtn}
                  onClick={() => setOpenBatchName(batch.batch)}
                  aria-label={`Open batch ${batch.batch}`}
                >
                  <div className={tileStyles.tileThumb}>
                    <Users size={26} aria-hidden="true" />
                    {batch.archived && (
                      <span className={`${badgeStyles.badge} ${badgeStyles.archived} ${styles.batchBadge}`}>Archived</span>
                    )}
                  </div>
                  <div className={tileStyles.tileBody}>
                    <div className={tileStyles.tileTitle}>{batch.batch}</div>
                    <div className={tileStyles.tileSub}>{count} member{count === 1 ? '' : 's'}</div>
                  </div>
                </button>
                <div className={styles.tileActions}>
                  <Button variant="ghost" size="sm" disabled={busyBatch === batch.batch} onClick={() => handleToggleArchive(batch)}>
                    {batch.archived ? <><ArchiveRestore size={12} aria-hidden="true" /> Unarchive</> : <><Archive size={12} aria-hidden="true" /> Archive</>}
                  </Button>
                  <ConfirmButton
                    label={<><Trash2 size={12} aria-hidden="true" /> Delete</>}
                    confirmLabel="Delete batch?"
                    danger
                    onConfirm={() => handleDeleteBatch(batch)}
                    disabled={busyBatch === batch.batch}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {addingBatch && (
        <Modal title="Add New Batch" onClose={() => setAddingBatch(false)}>
          <form onSubmit={handleAddBatch} noValidate>
            <div className={formStyles.row}>
              <label className={formStyles.label} htmlFor="new-batch">Batch (Passing Year)</label>
              <input
                id="new-batch"
                className={`${controlStyles.input} ${controlStyles.fullWidth}`}
                value={batchInput}
                onChange={(e) => setBatchInput(e.target.value)}
                placeholder="e.g. 2028"
                autoFocus
              />
            </div>
            {batchError && <p className={styles.formError} role="alert">{batchError}</p>}
            <div className={formStyles.actions}>
              <Button type="button" variant="ghost" onClick={() => setAddingBatch(false)}>Cancel</Button>
              <Button type="submit" isLoading={isSavingBatch}>Add Batch</Button>
            </div>
          </form>
        </Modal>
      )}

      {managingLeadership && (
        <LeadershipModal 
           batches={batches} 
           onClose={() => setManagingLeadership(false)} 
           onSaved={() => {
              setManagingLeadership(false);
              revalidator.revalidate(); // Re-fetch all batch/leadership data
           }} 
        />
      )}
    </div>
  );
}