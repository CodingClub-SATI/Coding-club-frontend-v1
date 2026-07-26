import Teams from './Teams';
import { teamApi } from '../api';

export async function loader() {
  try {
    const data = await teamApi.getAdminBatches();
    return { batches: Array.isArray(data?.batches) ? data.batches : [], error: null };
  } catch (err) {
    console.error('Failed to load team batches:', err);
    return { batches: [], error: 'Could not load the team right now.' };
  }
}

export default Teams;
