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