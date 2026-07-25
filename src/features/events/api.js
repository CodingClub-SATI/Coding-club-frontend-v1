import { request } from '@/services/api';

export const eventsApi = {
  // Public site only ever asks for non-archived events — archiving is an
  // admin concern and the backend is the single source of truth for it.
  list: () => request('/api/events?includeArchived=false'),
};

// No fake fallback data here on purpose: if the request fails, the page
// should show an honest "couldn't load events" state, not a fabricated list.
export async function eventsLoader() {
  try {
    const events = await eventsApi.list();
    return { events: Array.isArray(events) ? events : [], error: null };
  } catch (err) {
    console.error('Failed to load events:', err);
    return { events: [], error: 'Could not load events right now.' };
  }
}
