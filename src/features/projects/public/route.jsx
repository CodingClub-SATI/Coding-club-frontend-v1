import Projects from './Projects';
import { projectsApi, PROJECTS_PAGE_SIZE } from '../api';

export async function loader({ request } = {}) {
  const url = request ? new URL(request.url) : null;
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

export default Projects;
