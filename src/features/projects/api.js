import { request } from '@/services/api';

export const projectsApi = {
  list: () => request('/api/projects'),

  // ---- Admin: CRUD ----
  create: (payload) => request('/api/projects', { method: 'POST', body: payload }),
  update: (id, payload) => request(`/api/projects/${id}`, { method: 'PUT', body: payload }),
  remove: (id) => request(`/api/projects/${id}`, { method: 'DELETE' }),
};

// Shared by both the public Projects page and the admin Projects page —
// same full list either way; the admin page layers CRUD handlers on top
// locally. Never throws — a failed fetch degrades to an empty list + error
// message instead of taking the route down.
export async function projectsLoader() {
  try {
    const projects = await projectsApi.list();
    return { projects: Array.isArray(projects) ? projects : [], error: null };
  } catch (err) {
    console.error('Failed to load projects:', err);
    return { projects: [], error: 'Could not load projects right now.' };
  }
}
