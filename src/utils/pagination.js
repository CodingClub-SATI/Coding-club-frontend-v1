/**
 * Parses the `page` search param from a request URL for use in route loaders
 * (loaders run outside the component tree, so useSearchParamsState's hooks
 * don't apply there — this is the same 1-indexed, defaults-to-1 parsing,
 * just as a plain function). Pairs with hooks/useSearchParamsState's
 * usePageParam on the component side.
 */
export function parsePage(url) {
  const raw = parseInt(new URL(url).searchParams.get('page'), 10);
  return Number.isFinite(raw) && raw > 0 ? raw : 1;
}
