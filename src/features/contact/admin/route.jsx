import Inbox from './Inbox';
import { contactApi } from '../api';
import { REQUEST_TYPES, CONTACTS_PAGE_SIZE } from '../constants';
import { parsePage } from '@/utils/pagination';

const EMPTY_BREAKDOWN = Object.fromEntries(REQUEST_TYPES.map((t) => [t, 0]));

export async function loader({ request }) {
  const url = new URL(request.url);
  const page = parsePage(request.url);
  const typeFilter = url.searchParams.get('type') || 'all';
  const showArchived = url.searchParams.get('archived') === 'true';

  try {
    // The table's own page, plus a handful of cheap pageSize:1 lookups (we
    // only need their `.total` envelope field) to keep the header/breakdown
    // stats accurate across the WHOLE inbox regardless of which page or
    // filter is currently active — not just what happens to be loaded.
    const [listResult, newCountResult, ...breakdownResults] = await Promise.all([
      contactApi.getAll({
        page,
        pageSize: CONTACTS_PAGE_SIZE,
        requestType: typeFilter === 'all' ? undefined : typeFilter,
        includeArchived: showArchived,
      }),
      contactApi.getAll({ status: 'New', includeArchived: false, pageSize: 1 }),
      ...REQUEST_TYPES.map((t) => contactApi.getAll({ requestType: t, includeArchived: false, pageSize: 1 })),
    ]);

    const breakdown = {};
    REQUEST_TYPES.forEach((t, i) => { breakdown[t] = breakdownResults[i]?.total || 0; });

    return {
      contacts: Array.isArray(listResult) ? listResult : (listResult.data || []),
      page: listResult.page || page,
      totalPages: listResult.totalPages || 1,
      total: Object.values(breakdown).reduce((sum, n) => sum + n, 0),
      newCount: newCountResult?.total || 0,
      breakdown,
      error: null,
    };
  } catch (err) {
    console.error('Failed to load contact requests:', err);
    return {
      contacts: [],
      page: 1,
      totalPages: 1,
      total: 0,
      newCount: 0,
      breakdown: EMPTY_BREAKDOWN,
      error: 'Could not load contact requests right now.',
    };
  }
}

export default Inbox;
