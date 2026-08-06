import Events from './Events';
import { eventsApi, EVENTS_PAGE_SIZE } from '../api';

export async function loader({ request }) {
  const url = new URL(request.url);
  const tab = url.searchParams.get('status') || 'upcoming';
  const type = url.searchParams.get('type') || 'All';
  const page = Math.max(1, parseInt(url.searchParams.get('page'), 10) || 1);

  const status = tab === 'all' ? undefined : tab;
  const typeFilter = type === 'All' ? undefined : type;

  try {
    const [eventsResult, featuredEvents] = await Promise.all([
      eventsApi.list({ status, type: typeFilter, page, pageSize: EVENTS_PAGE_SIZE }),
      eventsApi.list({ featured: true }),
    ]);

    const events = Array.isArray(eventsResult) ? eventsResult : eventsResult.data;

    return {
      events: Array.isArray(events) ? events : [],
      featuredEvents: Array.isArray(featuredEvents) ? featuredEvents : [],
      page: eventsResult.page || 1,
      totalPages: eventsResult.totalPages || 1,
      error: null,
    };
  } catch (err) {
    console.error('Failed to load events:', err);
    return { events: [], featuredEvents: [], page: 1, totalPages: 1, error: 'Could not load events right now.' };
  }
}

export default Events;
