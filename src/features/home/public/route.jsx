import Home from './Home';
import { homeApi } from '../api';

const ZERO_LIVE_STATS = {
  totalEvents: 0,
  activeMembers: 0,
  studentProjects: 0,
  workshops: 0,
};

export async function loader() {
  try {
    const stats = await homeApi.getStats();

    return {
      totalEvents: Number(stats?.totalEvents) || 0,
      activeMembers: Number(stats?.activeMembers) || 0,
      studentProjects: Number(stats?.studentProjects) || 0,
      workshops: Number(stats?.workshops) || 0,
    };
  } catch (err) {
    console.error('Failed to load stats in loader:', err);
    return ZERO_LIVE_STATS;
  }
}

export default Home;
