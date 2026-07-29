import { useState } from 'react';
import { useLoaderData } from 'react-router';
import { AlertTriangle, Megaphone, Pencil, Plus, Trash2 } from 'lucide-react';
import AdminTitle from '@/components/admin/AdminTitle';
import Button from '@/components/shared/Button';
import { ConfirmButton } from '@/components/shared/ConfirmButton';
import EmptyState from '@/components/shared/EmptyState';
import UpdateFormModal from '@/features/updates/admin/UpdateFormModal';
import { updatesApi } from '@/features/updates/api';
import formStyles from '@/components/admin/AdminForm.module.css';
import styles from './Updates.module.css';

function formatPublishDate(publishDate) {
  if (!publishDate) return '—';
  return new Date(publishDate).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function sortByPublishDateDesc(list) {
  return [...list].sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
}

export default function Updates() {
  const { updates: initialUpdates, error: loadError } = useLoaderData();

  const [updates, setUpdates] = useState(initialUpdates);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState(null); // null while modalOpen => "add new"
  const [actionError, setActionError] = useState('');

  const openCreate = () => {
    setEditingUpdate(null);
    setModalOpen(true);
  };

  const openEdit = (update) => {
    setEditingUpdate(update);
    setModalOpen(true);
  };

  const handleCreate = async (payload) => {
    const created = await updatesApi.create(payload);
    setUpdates((prev) => sortByPublishDateDesc([created, ...prev]));
  };

  const handleUpdate = async (update, payload) => {
    const saved = await updatesApi.update(update.id, payload);
    setUpdates((prev) => sortByPublishDateDesc(prev.map((u) => (u.id === update.id ? saved : u))));
  };

  const handleDelete = async (update) => {
    setActionError('');
    try {
      await updatesApi.remove(update.id);
      setUpdates((prev) => prev.filter((u) => u.id !== update.id));
    } catch (err) {
      console.error('Failed to delete alert:', err);
      setActionError('Could not delete this alert. Please try again.');
    }
  };

  return (
    <div>
      <AdminTitle
        title="Alerts"
        subtitle={`${updates.length} total · shown in the public site's System Alerts banner`}
      >
        <Button onClick={openCreate}>
          <Plus size={16} aria-hidden="true" /> Add New Alert
        </Button>
      </AdminTitle>

      {actionError && <p className={formStyles.error} role="alert">{actionError}</p>}

      {loadError ? (
        <EmptyState icon={AlertTriangle} title={loadError} subtitle="Try refreshing the page in a moment." />
      ) : updates.length === 0 ? (
        <EmptyState icon={Megaphone} title="No alerts yet" subtitle='Use "Add New Alert" to publish the first one.' />
      ) : (
        <ul className={styles.list} aria-label="Current alerts">
          {updates.map((update) => (
            <li key={update.id} className={styles.item}>
              <div className={styles.itemBody}>
                <p className={styles.message}>{update.message}</p>
                <span className={styles.date}>{formatPublishDate(update.publishDate)}</span>
              </div>
              <div className={styles.itemActions}>
                <Button variant="ghost" size="sm" onClick={() => openEdit(update)}>
                  <Pencil size={12} aria-hidden="true" /> Edit
                </Button>
                <ConfirmButton
                  label={<><Trash2 size={12} aria-hidden="true" /> Delete</>}
                  confirmLabel="Delete?"
                  danger
                  onConfirm={() => handleDelete(update)}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      {modalOpen && (
        <UpdateFormModal
          update={editingUpdate}
          onClose={() => setModalOpen(false)}
          onSubmit={(payload) => (editingUpdate ? handleUpdate(editingUpdate, payload) : handleCreate(payload))}
        />
      )}
    </div>
  );
}
