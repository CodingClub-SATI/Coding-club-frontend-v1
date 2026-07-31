import Events from './Events';
import { eventsApi } from '../api';

export async function loader() {
  try {
    const events = await eventsApi.list({ includeArchived: true });
    return { events: Array.isArray(events) ? events : [], error: null };
  } catch (err) {
    console.error('Failed to load events (admin):', err);
    return { events: [], error: 'Could not load events right now.' };
  }
}

export default Events;
