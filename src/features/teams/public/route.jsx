import Teams from './Teams';
import { teamApi } from '../api';

export async function loader() {
  try {
    const data = await teamApi.getPublicRoster();
    return {
      leadership: data?.leadership || { convenors: [], coConvenors: [], departmentLeads: [] },
      batches: Array.isArray(data?.batches) ? data.batches : [],
      error: null,
    };
  } catch (err) {
    console.error('Failed to load team roster:', err);
    return {
      leadership: { convenors: [], coConvenors: [], departmentLeads: [] },
      batches: [],
      error: 'Could not load the team right now.',
    };
  }
}

export default Teams;
