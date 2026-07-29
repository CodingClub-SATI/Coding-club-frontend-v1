import { useEffect, useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { Modal } from '@/components/shared/Modal';
import Button from '@/components/shared/Button';
import IconButton from '@/components/shared/IconButton';
import Spinner from '@/components/shared/Spinner';
import { teamApi } from '@/features/teams/api';
import formStyles from '@/components/admin/AdminForm.module.css';
import controlStyles from '@/components/admin/FormControl.module.css';

export default function LeadershipModal({ batches, onClose, onSaved }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const [convenorBatch, setConvenorBatch] = useState('');
  const [convenors, setConvenors] = useState(['', '']);

  const [coConvenorBatch, setCoConvenorBatch] = useState('');
  const [coConvenors, setCoConvenors] = useState(['', '']);

  const [deptHeads, setDeptHeads] = useState([]);

  // Only allow selecting from unarchived batches
  const unarchivedBatches = batches.filter(b => !b.archived);

  // Helper to find which batch a specific member ID belongs to
  const getBatchForMember = (memberId) => {
    if (!memberId) return '';
    for (const b of batches) {
      if (b.members.some(m => m.id === memberId)) return b.batch;
    }
    return '';
  };

  useEffect(() => {
    teamApi.getLeadership().then(mapping => {
      // Setup Convenors
      const c1 = mapping.convenors?.[0] || '';
      const c2 = mapping.convenors?.[1] || '';
      setConvenors([c1, c2]);
      setConvenorBatch(getBatchForMember(c1) || getBatchForMember(c2) || '');

      // Setup Co-Convenors
      const cc1 = mapping.coConvenors?.[0] || '';
      const cc2 = mapping.coConvenors?.[1] || '';
      setCoConvenors([cc1, cc2]);
      setCoConvenorBatch(getBatchForMember(cc1) || getBatchForMember(cc2) || '');

      // Setup Department Heads
      const depts = [];
      if (mapping.departmentHeads) {
        Object.entries(mapping.departmentHeads).forEach(([dept, memberId]) => {
          depts.push({ id: crypto.randomUUID(), dept, batch: getBatchForMember(memberId), memberId });
        });
      }
      setDeptHeads(depts);
      setIsLoading(false);
    }).catch(err => {
      setError('Failed to load current leadership configuration.');
      setIsLoading(false);
    });
  }, [batches]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    // Format Department Heads back into an object mapping: { "Technical": "m1", "Management": "m2" }
    const deptMapping = {};
    deptHeads.forEach(d => {
      if (d.dept.trim() && d.memberId) {
        deptMapping[d.dept.trim()] = d.memberId;
      }
    });

    const payload = {
      convenors: convenors.filter(Boolean),
      coConvenors: coConvenors.filter(Boolean),
      departmentHeads: deptMapping
    };

    try {
      await teamApi.updateLeadership(payload);
      onSaved(); // Triggers a revalidation in Teams.jsx to update the UI
    } catch (err) {
      setError('Failed to save leadership updates.');
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Modal title="Manage Leadership" onClose={onClose} size="lg" variant="glow">
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--brand-primary)' }}><Spinner /></div>
      </Modal>
    );
  }

  // Helper to render the member dropdown options based on the selected batch
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
      <form onSubmit={handleSubmit}>
        
        {/* CONVENORS */}
        <div className={formStyles.row} style={{ marginBottom: '24px' }}>
          <label className={formStyles.label} style={{ color: 'var(--brand-primary)' }}>Convenors</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
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

        {/* CO-CONVENORS */}
        <div className={formStyles.row} style={{ marginBottom: '32px' }}>
          <label className={formStyles.label} style={{ color: 'var(--brand-primary)' }}>Co-Convenors</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
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

        {/* DEPARTMENT HEADS */}
        <div className={formStyles.row}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid var(--border-dim)', paddingBottom: '8px' }}>
            <label className={formStyles.label} style={{ color: 'var(--brand-accent)', margin: 0 }}>Department Heads</label>
            <Button type="button" variant="ghost" size="sm" onClick={() => setDeptHeads([...deptHeads, { id: crypto.randomUUID(), dept: '', batch: '', memberId: '' }])}>
              <Plus size={14} /> Add Department
            </Button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {deptHeads.length === 0 && <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>No department heads assigned.</p>}
            
            {deptHeads.map((deptItem, index) => (
              <div key={deptItem.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '12px', alignItems: 'center' }}>
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
                <IconButton onClick={() => setDeptHeads(deptHeads.filter(d => d.id !== deptItem.id))} style={{ color: 'var(--brand-destructive)' }}>
                  <Trash2 size={16} />
                </IconButton>
              </div>
            ))}
          </div>
        </div>

        {error && <p style={{ color: 'var(--brand-destructive)', fontSize: 'var(--text-sm)', marginTop: '16px' }}>{error}</p>}
        
        <div className={formStyles.actions} style={{ marginTop: '32px' }}>
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isSaving}>Save Leadership</Button>
        </div>
      </form>
    </Modal>
  );
}