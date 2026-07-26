import { request } from '@/services/api';

export const projectsApi = {
  list: () => request('/api/projects'),
};

export async function projectsLoader() {
  try {
    const projects = await projectsApi.list();
    return { projects: Array.isArray(projects) ? projects : [], error: null };
  } catch (err) {
    console.error('Failed to load projects:', err);
    return { projects: [], error: 'Could not load projects right now.' };
  }
}
