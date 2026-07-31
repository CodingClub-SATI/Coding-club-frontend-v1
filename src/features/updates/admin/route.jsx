import Updates from './Updates';
import { updatesApi } from '../api';

export async function loader() {
  try {
    const updates = await updatesApi.list();
    return { updates: Array.isArray(updates) ? updates : [], error: null };
  } catch (err) {
    console.error('Failed to load alerts:', err);
    return { updates: [], error: 'Could not load alerts right now.' };
  }
}

export default Updates;
