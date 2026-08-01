import { request } from '@/services/api';

export const updatesApi = {
  list: (options) => request('/api/updates', options),
  create: (payload) => request('/api/updates', { method: 'POST', body: payload }),
  update: (id, payload) => request(`/api/updates/${id}`, { method: 'PUT', body: payload }),
  remove: (id) => request(`/api/updates/${id}`, { method: 'DELETE' }),
};
