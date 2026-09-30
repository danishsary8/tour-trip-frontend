import { SearchIcon, XIcon, ChevronDownIcon, FilterIcon } from './icons';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

/** Search input + status filter + clear-filters control for the category table. */
export default function CategoryFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  hasActiveFilters,
  onClearFilters,
}) {
  return (
    <div className="flex-col gap-3 flex sm:flex-row sm:items-center">
      <div className="flex-1 group relative">
        <SearchIcon
          width={16}
          height={16}
          className="top-1/2 text-slate-400 absolute left-3.5 -translate-y-1/2 pointer-events-none transition-colors duration-200 group-focus-within:text-slate-600"
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search category…"
          className="w-full h-10 text-sm rounded-full bg-slate-100/80 border border-slate-300 text-slate-900 pl-10 pr-4 placeholder:text-slate-500 outline-none transition-all duration-200 focus:bg-white focus:shadow-sm focus:ring-2 focus:ring-indigo-400/50"
        />
      </div>

      <div className="gap-2 flex items-center shrink-0">
        <div className="relative">
          <div className="gap-2 px-3.5 h-10 text-sm font-medium rounded-xl bg-white border border-slate-200 text-slate-700 shadow-sm inline-flex items-center">
            <FilterIcon width={15} height={15} />
            Filter
            <ChevronDownIcon width={14} height={14} className="text-slate-400" />
          </div>
          <select
            id="category-status-filter"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            aria-label="Filter categories by status"
            className="h-10 w-full opacity-0 absolute inset-0 cursor-pointer"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="gap-1.5 px-3 h-10 text-sm font-medium text-slate-500 flex items-center hover:text-slate-700 transition-colors duration-150"
          >
            <XIcon width={15} height={15} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
