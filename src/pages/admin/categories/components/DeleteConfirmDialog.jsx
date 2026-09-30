import { useState } from 'react';
import { AlertTriangleIcon } from './icons';

/** Confirmation dialog shown before deleting a category. */
export default function DeleteConfirmDialog({ isOpen, category, onCancel, onConfirm }) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !category) return null;

  async function handleConfirm() {
    setIsDeleting(true);
    try {
      await onConfirm(category.id);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl border border-slate-200 p-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-rose-50 mx-auto mb-4">
          <AlertTriangleIcon width={22} height={22} className="text-rose-500" />
        </div>

        <h2 className="text-base font-semibold text-slate-800 text-center">
          Are you sure you want to delete this category?
        </h2>
        <p className="text-sm text-slate-500 text-center mt-1.5">
          <span className="font-medium text-slate-700">“{category.name}”</span> will be permanently removed. This
          action cannot be undone.
        </p>

        <div className="flex items-center gap-2 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors duration-150"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-60 transition-colors duration-150"
          >
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
