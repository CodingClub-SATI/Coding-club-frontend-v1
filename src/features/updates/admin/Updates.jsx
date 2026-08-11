import { useState } from 'react';
import { useLoaderData, useRevalidator } from 'react-router';
import { AlertTriangle, Link as LinkIcon, Megaphone, Pencil, Plus, Trash2 } from 'lucide-react';
import AdminTitle from '@/components/admin/AdminTitle';
import Button from '@/components/shared/Button';
import { ConfirmButton } from '@/components/shared/ConfirmButton';
import EmptyState from '@/components/shared/EmptyState';
import Pagination from '@/components/shared/Pagination';
import UpdateFormModal from '@/features/updates/admin/UpdateFormModal';
import { updatesApi } from '@/features/updates/api';
import { usePageParam } from '@/hooks/useSearchParamsState';
import { formatDate } from '@/utils/date';
import formStyles from '@/components/admin/AdminForm.module.css';
import styles from './Updates.module.css';

export default function Updates() {
  const { updates, page, totalPages, total, error: loadError } = useLoaderData();
  const revalidator = useRevalidator();
  const [, setPage] = usePageParam();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState(null); // null while modalOpen => "add new"
  const [actionError, setActionError] = useState('');
  const [busyUpdateId, setBusyUpdateId] = useState(null);

  const openCreate = () => {
    setEditingUpdate(null);
    setModalOpen(true);
  };

  const openEdit = (update) => {
    setEditingUpdate(update);
    setModalOpen(true);
  };

  const handleCreate = async (payload) => {
    await updatesApi.create(payload);
    revalidator.revalidate();
  };

  const handleUpdate = async (update, payload) => {
    await updatesApi.update(update.id, payload);
    revalidator.revalidate();
  };

  const handleDelete = async (update) => {
    setActionError('');
    setBusyUpdateId(update.id);
    try {
      await updatesApi.remove(update.id);
      revalidator.revalidate();
    } catch (err) {
      console.error('Failed to delete alert:', err);
      setActionError('Could not delete this alert. Please try again.');
    } finally {
      setBusyUpdateId(null);
    }
  };

  return (
    <div>
      <AdminTitle
        title="Alerts"
        subtitle={`${total} total · shown in the public site's System Alerts banner`}
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
        <>
          <ul className={styles.list} aria-label="Current alerts">
            {updates.map((update) => (
              <li key={update.id} className={styles.item}>
                <div className={styles.itemBody}>
                  <p className={styles.message}>{update.message}</p>
                  {update.link && (
                    <a href={update.link} target="_blank" rel="noreferrer" className={styles.linkPreview}>
                      <LinkIcon size={12} aria-hidden="true" /> {update.link}
                    </a>
                  )}
                  <span className={styles.date}>{formatDate(update.createdAt)}</span>
                </div>
                <div className={styles.itemActions}>
                  <Button variant="ghost" size="sm" disabled={busyUpdateId === update.id} onClick={() => openEdit(update)}>
                    <Pencil size={12} aria-hidden="true" /> Edit
                  </Button>
                  <ConfirmButton
                    label={<><Trash2 size={12} aria-hidden="true" /> Delete</>}
                    confirmLabel="Delete?"
                    danger
                    onConfirm={() => handleDelete(update)}
                    disabled={busyUpdateId === update.id}
                  />
                </div>
              </li>
            ))}
          </ul>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
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