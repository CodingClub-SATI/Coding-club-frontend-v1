import { request } from '@/services/api';

export const updatesApi = {
  list: ({ page, pageSize, limit, ...options } = {}) => {
    const params = new URLSearchParams();
    if (page) params.set('page', String(page));
    if (pageSize) params.set('pageSize', String(pageSize));
    if (limit) params.set('limit', String(limit));
    const qs = params.toString();
    return request(`/api/updates${qs ? `?${qs}` : ''}`, options);
  },
  create: (payload) => request('/api/updates', { method: 'POST', body: payload }),
  update: (id, payload) => request(`/api/updates/${id}`, { method: 'PUT', body: payload }),
  remove: (id) => request(`/api/updates/${id}`, { method: 'DELETE' }),
};