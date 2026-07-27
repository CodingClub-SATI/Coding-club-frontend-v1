import { request } from '@/services/api';

export const contactApi = {
  create: (payload) => request('/api/contacts', { method: 'POST', body: payload }),
  // Admin-only read of the inbox — requires a valid admin bearer token.
  getAll: () => request('/api/contacts'),
};
