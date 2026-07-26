import { request } from '@/services/api';

export const teamApi = {
  getAll: () => request('/api/team'),
  getCurrent: () => request('/api/team/current'),
};

// Route loader for the public Teams page.
// GET /api/team/current is the authoritative source for which year is
// "current" (a business decision, not necessarily just the newest year key).
// GET /api/team is needed regardless, since it's the only way to know what
// past years exist at all (there's no lightweight "list of years" endpoint).
// Both are fetched in parallel and merged so either one failing doesn't take
// the whole page down.
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
