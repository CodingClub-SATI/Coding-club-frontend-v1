import { request } from '@/services/api';
import { eventsApi } from '@/features/events/api';
import { contactApi } from '@/features/contact/api';

const RECENT_LIMIT = 3;
const statsApi = { getAdmin: () => request('/api/admin/stats') };

const ZERO_STATS = {
  activeMembers: 0,
  currentYearMembers: 0,
  currentYearKey: null,
  eventsConducted: 0,
  totalEvents: 0,
  studentProjects: 0,
  achievedProjects: 0,
  workshops: 0,
};

export const dashboardApi = {
  getStats: () => statsApi.getAdmin(),
};

function normalizeStats(raw) {
  return {
    activeMembers: Number(raw?.activeMembers) || 0,
    currentYearMembers: Number(raw?.currentYearMembers) || 0,
    currentYearKey: raw?.currentYearKey ?? null,
    eventsConducted: Number(raw?.eventsConducted) || 0,
    totalEvents: Number(raw?.totalEvents) || 0,
    studentProjects: Number(raw?.studentProjects) || 0,
    achievedProjects: Number(raw?.achievedProjects) || 0,
    workshops: Number(raw?.workshops) || 0,
  };
}

export async function dashboardLoader() {
  const [statsResult, eventsResult, contactsResult] = await Promise.allSettled([
    dashboardApi.getStats(),
    eventsApi.list(),
    contactApi.getAll(),
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
      ? eventsResult.value.slice(0, RECENT_LIMIT)
      : [],
    eventsError: eventsResult.status === 'rejected',

    recentContacts: contactsResult.status === 'fulfilled' && Array.isArray(contactsResult.value)
      ? contactsResult.value.slice(0, RECENT_LIMIT)
      : [],
    contactsError: contactsResult.status === 'rejected',
  };
}
