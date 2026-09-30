import { EditIcon, TrashIcon, InboxIcon } from './icons';

const COLUMNS = ['Category Name', 'Slug', 'Tours', 'Actions'];

function getCategorySlug(category) {
  return category.slug || category.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function SkeletonRows() {
  return Array.from({ length: 5 }).map((_, i) => (
    <tr key={i} className="border-b border-slate-100 last:border-0">
      {COLUMNS.map((col) => (
        <td key={col} className="px-5 py-4">
          <div className="h-4 bg-slate-100 rounded animate-pulse" style={{ width: `${40 + Math.random() * 40}%` }} />
        </td>
      ))}
    </tr>
  ));
}

function EmptyState({ hasActiveFilters, onClearFilters }) {
  return (
    <tr>
      <td colSpan={COLUMNS.length} className="px-5 py-16">
        <div className="flex-col gap-3 justify-center text-center flex items-center">
          <div className="justify-center w-12 h-12 rounded-full bg-slate-50 flex items-center">
            <InboxIcon width={22} height={22} className="text-slate-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">
              {hasActiveFilters ? 'No categories match your filters' : 'No categories yet'}
            </p>
            <p className="mt-0.5 text-sm text-slate-400">
              {hasActiveFilters
                ? 'Try a different search term or status.'
                : 'Click "+ Add Category" to create your first one.'}
            </p>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="mt-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Clear filters
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

function ActionButton({ label, tone, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={[
        'flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-500 bg-white transition-colors duration-150',
        tone,
      ].join(' ')}
    >
      {children}
    </button>
  );
}

/** Category data table with loading skeleton and empty state built in. */
export default function CategoryTable({ categories, isLoading, hasActiveFilters, onClearFilters, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {COLUMNS.map((col) => (
              <th
                key={col}
                className={[
                  'px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap',
                  col === 'Actions' ? 'text-right' : '',
                ].join(' ')}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <SkeletonRows />
          ) : categories.length === 0 ? (
            <EmptyState hasActiveFilters={hasActiveFilters} onClearFilters={onClearFilters} />
          ) : (
            categories.map((category) => {
              return (
                <tr key={category.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors duration-150">
                  <td className="px-5 py-4">
                    <span className="text-sm font-semibold text-slate-800 whitespace-nowrap">{category.name}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-500 whitespace-nowrap">{getCategorySlug(category)}</td>
                  <td className="px-5 py-4 text-sm font-medium text-slate-700">{category.toursCount}</td>
                  <td className="px-5 py-4">
                    <div className="gap-2 justify-end flex items-center">
                      <ActionButton
                        label={`Edit ${category.name}`}
                        tone="hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200"
                        onClick={() => onEdit(category)}
                      >
                        <EditIcon width={15} height={15} />
                      </ActionButton>
                      <ActionButton
                        label={`Delete ${category.name}`}
                        tone="hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
                        onClick={() => onDelete(category)}
                      >
                        <TrashIcon width={15} height={15} />
                      </ActionButton>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
