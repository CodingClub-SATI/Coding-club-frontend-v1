import { request } from '@/services/api';

export const PROJECTS_PAGE_SIZE = 6;

export const projectsApi = {
  list: ({ category, sort, limit, page, pageSize } = {}) => {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.set('category', category);
    if (sort) params.set('sort', sort);
    if (limit) params.set('limit', String(limit));
    if (page) params.set('page', String(page));
    if (pageSize) params.set('pageSize', String(pageSize));
    const qs = params.toString();
    return request(`/api/projects${qs ? `?${qs}` : ''}`);
  },

  // ---- Admin: CRUD ----
  create: (payload) => request('/api/projects', { method: 'POST', body: payload }),
  update: (id, payload) => request(`/api/projects/${id}`, { method: 'PUT', body: payload }),
  remove: (id) => request(`/api/projects/${id}`, { method: 'DELETE' }),
};

