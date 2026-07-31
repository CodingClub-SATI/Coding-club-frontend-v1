import { request } from '@/services/api';

export const contactApi = {
  create: (payload) => request('/api/contacts', { method: 'POST', body: payload }),
  // Admin-only read of the inbox — requires a valid admin bearer token.
  getAll: ({ limit } = {}) => request(limit ? `/api/contacts?limit=${limit}` : '/api/contacts'),
  updateStatus: (id, status) => request(`/api/contacts/${id}`, { method: 'PUT', body: { status } }),
  remove: (id) => request(`/api/contacts/${id}`, { method: 'DELETE' }),
};

