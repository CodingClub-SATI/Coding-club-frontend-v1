import { request } from '@/services/api';

export const contactApi = {
  create: (payload) => request('/api/contacts', { method: 'POST', body: payload }),
  // NOTE: status/requestType/includeArchived filters below rely on backend
  // support that doesn't exist yet as of API.md — see BACKEND_CHANGES.md.
  getAll: ({ limit, page, pageSize, status, requestType, includeArchived } = {}) => {
    const params = new URLSearchParams();
    if (limit) params.set('limit', String(limit));
    if (page) params.set('page', String(page));
    if (pageSize) params.set('pageSize', String(pageSize));
    if (status) params.set('status', status);
    if (requestType) params.set('requestType', requestType);
    if (includeArchived) params.set('includeArchived', 'true');
    const qs = params.toString();
    return request(`/api/contacts${qs ? `?${qs}` : ''}`);
  },
  updateStatus: (id, status) => request(`/api/contacts/${id}`, { method: 'PUT', body: { status } }),
  setArchived: (id, archived) => request(`/api/contacts/${id}`, { method: 'PUT', body: { archived } }),
  remove: (id) => request(`/api/contacts/${id}`, { method: 'DELETE' }),
};
