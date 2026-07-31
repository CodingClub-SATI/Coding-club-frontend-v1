import Dashboard from './Dashboard';
import { dashboardApi } from '../api';
import { eventsApi } from '@/features/events/api';
import { contactApi } from '@/features/contact/api';

const RECENT_LIMIT = 3;

const ZERO_STATS = {
  totalEvents: 0,
  totalProjects: 0,
  newContactMessages: 0,
  totalMembers: 0,
};

function normalizeStats(raw) {
  return {
    totalEvents: Number(raw?.totalEvents) || 0,
    totalProjects: Number(raw?.totalProjects) || 0,
    newContactMessages: Number(raw?.newContactMessages) || 0,
    totalMembers: Number(raw?.totalMembers) || 0,
  };
}

export async function loader() {
  const [statsResult, eventsResult, contactsResult] = await Promise.allSettled([
    dashboardApi.getStats(),
    eventsApi.list({ limit: RECENT_LIMIT }),
    contactApi.getAll({ limit: RECENT_LIMIT }),
  ]);

  if (statsResult.status === 'rejected') {
    console.error('Failed to load admin stats:', statsResult.reason);
  }
  if (eventsResult.status === 'rejected') {
    console.error('Failed to load recent events:', eventsResult.reason);
  }
  if (contactsResult.status === 'rejected') {
    console.error('Failed to load recent contacts:', contactsResult.reason);
  }

  return {
    stats: statsResult.status === 'fulfilled' ? normalizeStats(statsResult.value) : ZERO_STATS,
    statsError: statsResult.status === 'rejected',

    recentEvents: eventsResult.status === 'fulfilled' && Array.isArray(eventsResult.value)
      ? eventsResult.value
      : [],
    eventsError: eventsResult.status === 'rejected',

    recentContacts: contactsResult.status === 'fulfilled' && Array.isArray(contactsResult.value)
      ? contactsResult.value
      : [],
    contactsError: contactsResult.status === 'rejected',
  };
}

export default Dashboard;
