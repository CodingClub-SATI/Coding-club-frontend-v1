import { request } from '@/services/api';

export const teamApi = {
  getAll: () => request('/api/team'),
  getCurrent: () => request('/api/team/current'),
  addYear: (year) => request('/api/team', { method: 'POST', body: { year } }),
  addMember: (year, group, member) =>
    request(`/api/team/${encodeURIComponent(year)}/${group}`, { method: 'POST', body: member }),
  updateMember: (year, group, id, patch) =>
    request(`/api/team/${encodeURIComponent(year)}/${group}/${id}`, { method: 'PUT', body: patch }),
  removeMember: (year, group, id) =>
    request(`/api/team/${encodeURIComponent(year)}/${group}/${id}`, { method: 'DELETE' }),
};

export async function teamLoader() {
  const [allResult, currentResult] = await Promise.allSettled([
    teamApi.getAll(),
    teamApi.getCurrent(),
  ]);

  if (allResult.status === 'rejected' && currentResult.status === 'rejected') {
    console.error('Failed to load team:', allResult.reason, currentResult.reason);
    return { years: [], byYear: {}, currentYear: null, error: 'Could not load the team right now.' };
  }

  const byYear = allResult.status === 'fulfilled' && allResult.value ? { ...allResult.value } : {};

  let currentYear = null;
  if (currentResult.status === 'fulfilled' && currentResult.value?.year) {
    const { year, ...groups } = currentResult.value;
    currentYear = year;
    byYear[year] = groups; // covers /api/team not having caught up yet
  }

  const years = Object.keys(byYear).sort().reverse();
  if (!currentYear) currentYear = years[0] ?? null;

  const orderedYears = currentYear ? [currentYear, ...years.filter((y) => y !== currentYear)] : years;

  return { years: orderedYears, byYear, currentYear, error: null };
}
