import { useCallback, useEffect, useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { Modal } from '@/components/shared/Modal';
import Button from '@/components/shared/Button';
import IconButton from '@/components/shared/IconButton';
import Spinner from '@/components/shared/Spinner';
import { teamApi } from '@/features/teams/api';
import formStyles from '@/components/admin/AdminForm.module.css';
import controlStyles from '@/components/admin/FormControl.module.css';
import styles from './LeadershipModal.module.css';

export default function LeadershipModal({ batches, onClose, onSaved }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const [convenorBatch, setConvenorBatch] = useState('');
  const [convenors, setConvenors] = useState(['', '']);

  const [coConvenorBatch, setCoConvenorBatch] = useState('');
  const [coConvenors, setCoConvenors] = useState(['', '']);

  const [deptHeads, setDeptHeads] = useState([]);

  const unarchivedBatches = batches.filter(b => !b.archived);

  const getBatchForMember = useCallback((memberId) => {
    if (!memberId) return '';
    for (const b of batches) {
      if (b.members.some(m => m.id === memberId)) return b.batch;
    }
    return '';
  }, [batches]);

  useEffect(() => {
    teamApi.getLeadership().then(mapping => {
      const c1 = mapping.convenors?.[0] || '';
      const c2 = mapping.convenors?.[1] || '';
      setConvenors([c1, c2]);
      setConvenorBatch(getBatchForMember(c1) || getBatchForMember(c2) || '');

      const cc1 = mapping.coConvenors?.[0] || '';
      const cc2 = mapping.coConvenors?.[1] || '';
      setCoConvenors([cc1, cc2]);
      setCoConvenorBatch(getBatchForMember(cc1) || getBatchForMember(cc2) || '');

      const depts = [];
      if (mapping.departmentLeads) {
        Object.entries(mapping.departmentLeads).forEach(([dept, memberId]) => {
          depts.push({ id: crypto.randomUUID(), dept, batch: getBatchForMember(memberId), memberId });
        });
      }
      setDeptHeads(depts);
      setIsLoading(false);
    }).catch(err => {
      console.error('Failed to load leadership configuration:', err);
      setError('Failed to load current leadership configuration.');
      setIsLoading(false);
    });
  }, [batches, getBatchForMember]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const deptMapping = {};
    deptHeads.forEach(d => {
      if (d.dept.trim() && d.memberId) {
        deptMapping[d.dept.trim()] = d.memberId;
      }
    });

    const payload = {
      convenors: convenors.filter(Boolean),
      coConvenors: coConvenors.filter(Boolean),
      departmentLeads: deptMapping
    };

    try {
      await teamApi.updateLeadership(payload);
      onSaved();
    } catch (err) {
      console.error('Failed to save leadership updates:', err);
      setError('Failed to save leadership updates.');
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Modal title="Manage Leadership" onClose={onClose} size="lg" variant="glow">
        <div className={styles.loadingWrap}><Spinner /></div>
      </Modal>
    );
  }

  const renderMemberOptions = (selectedBatch) => {
    const batchObj = batches.find(b => b.batch === selectedBatch);
    if (!batchObj || batchObj.members.length === 0) return <option value="" disabled>No members found</option>;
    return (
      <>
        <option value="">-- Select Member --</option>
        {batchObj.members.map(m => (
          <option key={m.id} value={m.id}>{m.fullName}</option>
        ))}
      </>
    );
  };

  return (
    <Modal title="Manage Leadership" onClose={onClose} size="lg" variant="glow">
      <form onSubmit={handleSubmit} noValidate>

        <div className={`${formStyles.row} ${styles.section}`}>
          <label className={`${formStyles.label} ${styles.sectionLabelPrimary}`}>Convenors</label>
          <div className={styles.grid3}>
            <select
              className={controlStyles.select}
              value={convenorBatch}
              onChange={(e) => { setConvenorBatch(e.target.value); setConvenors(['', '']); }}
            >
              <option value="">-- Select Batch --</option>
              {unarchivedBatches.map(b => <option key={b.batch} value={b.batch}>{b.batch}</option>)}
            </select>
            <select className={controlStyles.select} value={convenors[0]} onChange={(e) => setConvenors([e.target.value, convenors[1]])} disabled={!convenorBatch}>
              {renderMemberOptions(convenorBatch)}
            </select>
            <select className={controlStyles.select} value={convenors[1]} onChange={(e) => setConvenors([convenors[0], e.target.value])} disabled={!convenorBatch}>
              {renderMemberOptions(convenorBatch)}
            </select>
          </div>
        </div>

        <div className={`${formStyles.row} ${styles.section}`}>
          <label className={`${formStyles.label} ${styles.sectionLabelPrimary}`}>Co-Convenors</label>
          <div className={styles.grid3}>
            <select
              className={controlStyles.select}
              value={coConvenorBatch}
              onChange={(e) => { setCoConvenorBatch(e.target.value); setCoConvenors(['', '']); }}
            >
              <option value="">-- Select Batch --</option>
              {unarchivedBatches.map(b => <option key={b.batch} value={b.batch}>{b.batch}</option>)}
            </select>
            <select className={controlStyles.select} value={coConvenors[0]} onChange={(e) => setCoConvenors([e.target.value, coConvenors[1]])} disabled={!coConvenorBatch}>
              {renderMemberOptions(coConvenorBatch)}
            </select>
            <select className={controlStyles.select} value={coConvenors[1]} onChange={(e) => setCoConvenors([coConvenors[0], e.target.value])} disabled={!coConvenorBatch}>
              {renderMemberOptions(coConvenorBatch)}
            </select>
          </div>
        </div>

        <div className={formStyles.row}>
          <div className={styles.deptHeader}>
            <label className={`${formStyles.label} ${styles.sectionLabelAccent}`}>Department Heads</label>
            <Button type="button" variant="ghost" size="sm" onClick={() => setDeptHeads([...deptHeads, { id: crypto.randomUUID(), dept: '', batch: '', memberId: '' }])}>
              <Plus size={14} /> Add Department
            </Button>
          </div>

          <div className={styles.deptList}>
            {deptHeads.length === 0 && <p className={styles.emptyHint}>No department heads assigned.</p>}

            {deptHeads.map((deptItem, index) => (
              <div key={deptItem.id} className={styles.deptRow}>
                <input
                  className={controlStyles.input}
                  placeholder="Department (e.g. Technical)"
                  value={deptItem.dept}
                  onChange={(e) => {
                    const next = [...deptHeads];
                    next[index].dept = e.target.value;
                    setDeptHeads(next);
                  }}
                />
                <select
                  className={controlStyles.select}
                  value={deptItem.batch}
                  onChange={(e) => {
                    const next = [...deptHeads];
                    next[index].batch = e.target.value;
                    next[index].memberId = '';
                    setDeptHeads(next);
                  }}
                >
                  <option value="">-- Batch --</option>
                  {unarchivedBatches.map(b => <option key={b.batch} value={b.batch}>{b.batch}</option>)}
                </select>
                <select
                  className={controlStyles.select}
                  value={deptItem.memberId}
                  disabled={!deptItem.batch}
                  onChange={(e) => {
                    const next = [...deptHeads];
                    next[index].memberId = e.target.value;
                    setDeptHeads(next);
                  }}
                >
                  {renderMemberOptions(deptItem.batch)}
                </select>
                <IconButton className={styles.deleteBtn} onClick={() => setDeptHeads(deptHeads.filter(d => d.id !== deptItem.id))}>
                  <Trash2 size={16} />
                </IconButton>
              </div>
            ))}
          </div>
        </div>

        {error && <p className={styles.formError}>{error}</p>}

        <div className={`${formStyles.actions} ${styles.actions}`}>
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>Cancel</Button>
          <Button type="submit" isLoading={isSaving}>Save Leadership</Button>
        </div>
      </form>
    </Modal>
  );
}
