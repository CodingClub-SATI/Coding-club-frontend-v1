import { useCallback } from 'react';
import { useSearchParams } from 'react-router';

/**
 * Syncs a single filter value with a URL search param, keeping the URL
 * clean by omitting the param entirely when the value equals `defaultValue`.
 *
 * setValue(next, { resetPage: true }) also clears any `page` param — use
 * this when a filter change should jump back to page 1.
 *
 *   const [type, setType] = useSearchParamsState('type', 'all');
 *   setType('Workshop', { resetPage: true });
 */
export function useSearchParamsState(key, defaultValue) {
  const [searchParams, setSearchParams] = useSearchParams();
  const value = searchParams.get(key) ?? defaultValue;

  const setValue = useCallback((nextValue, { resetPage = false } = {}) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (nextValue === defaultValue || nextValue === null || nextValue === undefined || nextValue === '') {
        next.delete(key);
      } else {
        next.set(key, String(nextValue));
      }
      if (resetPage) next.delete('page');
      return next;
    }, { replace: true, preventScrollReset: true });
  }, [key, defaultValue, setSearchParams]);

  return [value, setValue];
}

/**
 * Syncs the `page` search param specifically (1-indexed, omitted at page 1).
 * Pairs with components/shared/Pagination's { page, totalPages, onChange }.
 *
 *   const [page, setPage] = usePageParam();
 *   <Pagination page={page} totalPages={totalPages} onChange={setPage} />
 */
export function usePageParam() {
  const [searchParams, setSearchParams] = useSearchParams();
  const raw = parseInt(searchParams.get('page'), 10);
  const page = Number.isFinite(raw) && raw > 0 ? raw : 1;

  const setPage = useCallback((nextPage) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (nextPage <= 1) next.delete('page');
      else next.set('page', String(nextPage));
      return next;
    }, { replace: true, preventScrollReset: true });
  }, [setSearchParams]);

  return [page, setPage];
}
