import { request } from '@/services/api';

export const EVENTS_PAGE_SIZE = 9;

export const eventsApi = {
  list: ({ includeArchived = false, limit, status, type, featured, page, pageSize } = {}) => {
    const params = new URLSearchParams({ includeArchived: includeArchived ? 'true' : 'false' });
    if (limit) params.set('limit', String(limit));
    if (status) params.set('status', status);
    if (type) params.set('type', type);
    if (featured) params.set('featured', 'true');
    if (page) params.set('page', String(page));
    if (pageSize) params.set('pageSize', String(pageSize));
    return request(`/api/events?${params.toString()}`);
  },
  create: (payload) => request('/api/events', { method: 'POST', body: payload }),
  update: (id, payload) => request(`/api/events/${id}`, { method: 'PUT', body: payload }),
  remove: (id) => request(`/api/events/${id}`, { method: 'DELETE' }),
  get: (id) => request(`/api/events/${id}`),
  trackRegisterClick: (id) => request(`/api/events/${id}/register-click`, { method: 'POST' }),
};
