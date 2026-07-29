import { request } from '@/services/api';

export const updatesApi = {
  list: () => request('/api/updates'),
  create: (payload) => request('/api/updates', { method: 'POST', body: payload }),
  update: (id, payload) => request(`/api/updates/${id}`, { method: 'PUT', body: payload }),
  remove: (id) => request(`/api/updates/${id}`, { method: 'DELETE' }),
};

export async function updatesAdminLoader() {
  try {
    const updates = await updatesApi.list();
    return { updates: Array.isArray(updates) ? updates : [], error: null };
  } catch (err) {
    console.error('Failed to load alerts:', err);
    return { updates: [], error: 'Could not load alerts right now.' };
  }
}
