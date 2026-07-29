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

// Public Projects page loader
export async function projectsLoader({ request: req } = {}) {
  const url = req ? new URL(req.url) : null;
  const category = url?.searchParams.get('category') || 'All';
  const page = Math.max(1, parseInt(url?.searchParams.get('page'), 10) || 1);

  try {
    const [topThree, projectsResult] = await Promise.all([
      projectsApi.list({ sort: 'stars', limit: 3 }),
      projectsApi.list({ category, sort: 'stars', page, pageSize: PROJECTS_PAGE_SIZE }),
    ]);

    const projects = Array.isArray(projectsResult) ? projectsResult : projectsResult.data;

    return {
      projects: Array.isArray(projects) ? projects : [],
      topThree: Array.isArray(topThree) ? topThree : [],
      category,
      page: projectsResult.page || 1,
      totalPages: projectsResult.totalPages || 1,
      error: null,
    };
  } catch (err) {
    console.error('Failed to load projects:', err);
    return {
      projects: [],
      topThree: [],
      category: 'All',
      page: 1,
      totalPages: 1,
      error: 'Could not load projects right now.',
    };
  }
}

export async function projectsAdminLoader() {
  try {
    const projects = await projectsApi.list();
    return { projects: Array.isArray(projects) ? projects : [], error: null };
  } catch (err) {
    console.error('Failed to load projects:', err);
    return { projects: [], error: 'Could not load projects right now.' };
  }
}
