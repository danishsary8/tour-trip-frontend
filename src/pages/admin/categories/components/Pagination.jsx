import { ChevronLeftIcon, ChevronRightIcon } from './icons';

/** Prev/next + bordered page-number pagination bar. */
export default function Pagination({ currentPage, totalPages, onPageChange, totalCount, pageSize }) {
  if (totalCount === 0) return null;

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalCount);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex-col gap-3 px-5 py-4 border-t border-slate-100 flex sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">
        Showing <span className="font-medium text-slate-700">{start}</span> to
        <span className="font-medium text-slate-700">{end}</span> of{' '}
        <span className="font-medium text-slate-700">{totalCount}</span> entries
      </p>

      <div className="gap-1.5 flex items-center">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-500 bg-white flex items-center hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-colors duration-150"
          aria-label="Previous page"
        >
          <ChevronLeftIcon width={15} height={15} />
        </button>

        {pageNumbers.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={[
              'flex items-center justify-center w-8 h-8 rounded-lg text-sm font-medium border transition-colors duration-150',
              page === currentPage
                ? 'bg-teal-600 border-teal-600 text-white shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50',
            ].join(' ')}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-500 bg-white flex items-center hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-colors duration-150"
          aria-label="Next page"
        >
          <ChevronRightIcon width={15} height={15} />
        </button>
      </div>
    </div>
  );
}
