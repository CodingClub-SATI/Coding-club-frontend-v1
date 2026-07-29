import { request } from '@/services/api';

export const teamApi = {
  // ---- Public ----
  getPublicRoster: () => request('/api/team/public'),

  // ---- Admin: batches ----
  getAdminBatches: () => request('/api/team/admin/batches'),
  createBatch: (batch) => request('/api/team/admin/batches', { method: 'POST', body: { batch } }),
  setBatchArchived: (batch, archived) =>
    request(`/api/team/admin/batches/${encodeURIComponent(batch)}`, { method: 'PATCH', body: { archived } }),
  removeBatch: (batch) =>
    request(`/api/team/admin/batches/${encodeURIComponent(batch)}`, { method: 'DELETE' }),

  // ---- Admin: members ----
  addMember: (member) => request('/api/team/admin/members', { method: 'POST', body: member }),
  updateMember: (id, patch) => request(`/api/team/admin/members/${id}`, { method: 'PATCH', body: patch }),
  removeMember: (id) => request(`/api/team/admin/members/${id}`, { method: 'DELETE' }),

  // ---- Admin: Leadership Mapping ----
  getLeadership: () => request('/api/team/admin/leadership'),
  updateLeadership: (mapping) => request('/api/team/admin/leadership', { method: 'PUT', body: mapping }),
};

export async function teamPublicLoader() {
  try {
    const data = await teamApi.getPublicRoster();
    return {
      leadership: data?.leadership || { convenors: [], coConvenors: [], departmentLeads: [] },
      batches: Array.isArray(data?.batches) ? data.batches : [],
      error: null,
    };
  } catch (err) {
    console.error('Failed to load team roster:', err);
    return {
      leadership: { convenors: [], coConvenors: [], departmentLeads: [] },
      batches: [],
      error: 'Could not load the team right now.',
    };
  }
}

export async function teamAdminLoader() {
  try {
    const data = await teamApi.getAdminBatches();
    return { batches: Array.isArray(data?.batches) ? data.batches : [], error: null };
  } catch (err) {
    console.error('Failed to load team batches:', err);
    return { batches: [], error: 'Could not load the team right now.' };
  }
}