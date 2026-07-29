import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Pagination.module.css';

function buildPageList(current, total) {
  const NEIGHBORS = 1;
  const pages = [1];

  if (current - NEIGHBORS > 2) pages.push('…');

  for (let p = Math.max(2, current - NEIGHBORS); p <= Math.min(total - 1, current + NEIGHBORS); p++) {
    pages.push(p);
  }

  if (current + NEIGHBORS < total - 1) pages.push('…');
  if (total > 1) pages.push(total);

  return pages;
}

export default function Pagination({ page, totalPages, onChange, className = '' }) {
  if (!totalPages || totalPages <= 1) return null;

  const pages = buildPageList(page, totalPages);

  return (
    <nav className={`${styles.pagination} ${className}`.trim()} aria-label="Pagination">
      <button
        type="button"
        className={styles.navBtn}
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} className={styles.ellipsis} aria-hidden="true">…</span>
        ) : (
          <button
            key={p}
            type="button"
            className={`${styles.pageBtn} ${p === page ? styles.active : ''}`}
            aria-current={p === page ? 'page' : undefined}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        className={styles.navBtn}
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
