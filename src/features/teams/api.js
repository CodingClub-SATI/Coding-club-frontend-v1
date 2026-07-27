import { request } from '@/services/api';

export const teamApi = {
  getAll: () => request('/api/team'),
  getCurrent: () => request('/api/team/current'),
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
