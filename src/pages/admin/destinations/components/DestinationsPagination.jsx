import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Page numbers with a sliding window, collapsing the overflow into "…".
 * 7 or fewer pages render in full; beyond that you always get
 * first page, last page, the current page and its neighbours.
 * @returns {(number | 'gap-start' | 'gap-end')[]}
 */
function buildPageItems(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items = [1];
  const from = Math.max(2, currentPage - 1);
  const to = Math.min(totalPages - 1, currentPage + 1);

  if (from > 2) items.push('gap-start');
  for (let page = from; page <= to; page += 1) items.push(page);
  if (to < totalPages - 1) items.push('gap-end');

  items.push(totalPages);
  return items;
}

/** Shared geometry for every cell in the joined button group. */
const CELL = 'relative inline-flex h-9 min-w-9 items-center justify-center border px-3 text-[13px]';

/**
 * Pagination footer for the destinations table — the conventional joined
 * button group: prev arrow, page numbers, next arrow, all sharing borders.
 * @param {{ currentPage: number, totalPages: number, totalCount: number, pageSize: number, onPageChange: (page: number) => void }} props
 */
export default function DestinationsPagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
}) {
  if (totalCount === 0) return null;

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalCount);
  const pageItems = buildPageItems(currentPage, totalPages);

  return (
    <div className="flex flex-col-reverse items-center justify-between gap-3 rounded-b-2xl border-t border-slate-200/70 bg-white px-6 py-3.5 sm:flex-row">
      <p className="text-[13px] text-slate-500">
        <span className="font-semibold text-slate-700 tabular-nums">
          {start}-{end}
        </span>{' '}
        of <span className="font-semibold text-slate-700 tabular-nums">{totalCount}</span>{' '}
        destinations
      </p>

      <nav
        aria-label="Destinations pagination"
        className="isolate inline-flex -space-x-px rounded-lg shadow-sm"
      >
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className={[
            CELL,
            'rounded-l-lg border-slate-200 bg-white text-slate-500',
            'transition-colors duration-150 hover:bg-slate-50 hover:text-slate-700',
            'focus:z-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40',
            'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white',
          ].join(' ')}
        >
          <ChevronLeft size={16} />
        </button>

        {pageItems.map((item) =>
          typeof item === 'number' ? (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              aria-current={item === currentPage ? 'page' : undefined}
              aria-label={`Page ${item}`}
              className={[
                CELL,
                'font-semibold tabular-nums transition-colors duration-150',
                'focus:z-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40',
                item === currentPage
                  ? 'z-10 border-indigo-600 bg-indigo-600 text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900',
              ].join(' ')}
            >
              {item}
            </button>
          ) : (
            <span
              key={item}
              aria-hidden="true"
              className={[CELL, 'border-slate-200 bg-white text-slate-400 select-none'].join(' ')}
            >
              …
            </span>
          ),
        )}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className={[
            CELL,
            'rounded-r-lg border-slate-200 bg-white text-slate-500',
            'transition-colors duration-150 hover:bg-slate-50 hover:text-slate-700',
            'focus:z-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40',
            'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white',
          ].join(' ')}
        >
          <ChevronRight size={16} />
        </button>
      </nav>
    </div>
  );
}
