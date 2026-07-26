import Projects from './Projects';
import { projectsApi } from '../api';

export async function loader() {
  try {
    const projects = await projectsApi.list();
    return { projects: Array.isArray(projects) ? projects : [], error: null };
  } catch (err) {
    console.error('Failed to load projects:', err);
    return { projects: [], error: 'Could not load projects right now.' };
  }
}

export default Projects;
