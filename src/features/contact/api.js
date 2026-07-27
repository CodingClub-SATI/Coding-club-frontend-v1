import { request } from '@/services/api';

export const contactApi = {
  create: (payload) => request('/api/contacts', { method: 'POST', body: payload }),
  // Admin-only read of the inbox — requires a valid admin bearer token.
  getAll: () => request('/api/contacts'),
  updateStatus: (id, status) => request(`/api/contacts/${id}`, { method: 'PUT', body: { status } }),
  remove: (id) => request(`/api/contacts/${id}`, { method: 'DELETE' }),
};

export async function inboxLoader() {
  try {
    const contacts = await contactApi.getAll();
    return { contacts: Array.isArray(contacts) ? contacts : [], error: null };
  } catch (err) {
    console.error('Failed to load contact requests:', err);
    return { contacts: [], error: 'Could not load contact requests right now.' };
  }
}
