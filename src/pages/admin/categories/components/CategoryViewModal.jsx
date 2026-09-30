import StatusBadge from './StatusBadge';
import { getCategoryVisual } from './categoryVisuals';
import { getToursForCategory } from '../data/mockCategoryTours';
import { XIcon, CalendarIcon, UserIcon } from './icons';

function formatDate(isoDate) {
  if (!isoDate) return '—';
  return isoDate;
}

/** Read-only details modal shown when clicking the "view" (eye) action on a category row. */
export default function CategoryViewModal({ isOpen, category, onClose }) {
  if (!isOpen || !category) return null;

  const visual = getCategoryVisual(category.icon);
  const VisualIcon = visual.icon;
  const tours = getToursForCategory(category.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-6">
          <div className="flex items-start gap-4">
            <div className={['flex items-center justify-center w-14 h-14 rounded-2xl shrink-0', visual.bg].join(' ')}>
              <VisualIcon width={26} height={26} className={visual.fg} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{category.name}</h2>
              <p className="text-sm text-slate-500 mt-0.5">{category.description}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors duration-150 shrink-0"
            aria-label="Close"
          >
            <XIcon width={17} height={17} />
          </button>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-6 pt-6">
          <div className="rounded-xl bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Total Tours</p>
            <p className="text-xl font-bold text-slate-800 mt-1">{tours.length}</p>
          </div>
          <div className="rounded-xl bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Status</p>
            <div className="mt-1.5">
              <StatusBadge status={category.status} />
            </div>
          </div>
          <div className="rounded-xl bg-slate-50 px-4 py-3">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <CalendarIcon width={13} height={13} />
              Created Date
            </p>
            <p className="text-base font-bold text-slate-800 mt-1">{formatDate(category.createdDate)}</p>
          </div>
          <div className="rounded-xl bg-slate-50 px-4 py-3">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <UserIcon width={13} height={13} />
              Created By
            </p>
            <p className="text-base font-bold text-slate-800 mt-1">{category.createdBy || 'Admin Hasani'}</p>
          </div>
        </div>

        {/* Tours in this category */}
        <div className="px-6 pt-6 pb-6">
          <h3 className="text-sm font-bold text-slate-800 mb-3">Tours in this Category</h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Tour</th>
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Tour ID</th>
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Duration</th>
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Price</th>
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {tours.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-sm text-slate-400 text-center">
                      No tours in this category yet.
                    </td>
                  </tr>
                ) : (
                  tours.map((tour) => (
                    <tr key={tour.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-3 text-sm font-medium text-slate-800 whitespace-nowrap">{tour.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-400 whitespace-nowrap">{tour.id}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">{tour.duration}</td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-700 whitespace-nowrap">{tour.price}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={tour.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-700 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors duration-150"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
