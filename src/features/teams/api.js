import { request } from '@/services/api';

// ---------------------------------------------------------------------------
// All grouping/sorting/filtering business rules (who counts as leadership,
// which batches are hidden because they're archived, default clubPosition,
// etc.) live on the backend. This module only calls endpoints and passes
// data through — see API_CONTRACT.md for the full contract these endpoints
// are expected to satisfy.
// ---------------------------------------------------------------------------

export const teamApi = {
  // ---- Public ----
  getPublicRoster: () => request('/api/team/public'),

  // ---- Admin: batches (a batch = a passing-year "album" of members) ----
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
};

// Route loader — public /teams page.
// Expected shape: { leadership: { convenor, coConvenor, departmentLeads[] }, batches: [{ batch, members[] }] }
export async function teamPublicLoader() {
  try {
    const data = await teamApi.getPublicRoster();
    return {
      leadership: data?.leadership || { convenor: null, coConvenor: null, departmentLeads: [] },
      batches: Array.isArray(data?.batches) ? data.batches : [],
      error: null,
    };
  } catch (err) {
    console.error('Failed to load team roster:', err);
    return {
      leadership: { convenor: null, coConvenor: null, departmentLeads: [] },
      batches: [],
      error: 'Could not load the team right now.',
    };
  }
}

// Route loader — /admin/teams page.
// Expected shape: { batches: [{ batch, archived, memberCount, members[] }] }
export async function teamAdminLoader() {
  try {
    const data = await teamApi.getAdminBatches();
    return { batches: Array.isArray(data?.batches) ? data.batches : [], error: null };
  } catch (err) {
    console.error('Failed to load team batches:', err);
    return { batches: [], error: 'Could not load the team right now.' };
  }
}
