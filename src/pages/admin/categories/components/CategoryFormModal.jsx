import { useState } from 'react';
import { XIcon, ImageIcon } from './icons';
import { getCategoryVisual, CATEGORY_ICON_OPTIONS } from './categoryVisuals';

const EMPTY_FORM = { name: '', description: '', status: 'active', image: '', icon: 'landmark' };

function toFormValues(category) {
  return category
    ? {
        name: category.name ?? '',
        description: category.description ?? '',
        status: category.status ?? 'active',
        image: category.image ?? '',
        icon: category.icon ?? 'landmark',
      }
    : EMPTY_FORM;
}


export default function CategoryFormModal({ isOpen, category, onClose, onSubmit }) {
  const [form, setForm] = useState(() => toFormValues(category));
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const isEditMode = Boolean(category);

  if (!isOpen) return null;

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, image: localUrl }));
  }

  function validate() {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Category name is required.';
    if (!form.description.trim()) nextErrors.description = 'Description is required.';
    return nextErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setIsSaving(true);
    try {
      await onSubmit(form);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">
            {isEditMode ? 'Edit Category' : 'Add Category'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors duration-150"
            aria-label="Close"
          >
            <XIcon width={18} height={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label htmlFor="category-name" className="block text-sm font-medium text-slate-700 mb-1.5">
              Category Name
            </label>
            <input
              id="category-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Cultural & Heritage"
              className={[
                'w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 border text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white',
                errors.name
                  ? 'border-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100'
                  : 'border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100',
              ].join(' ')}
            />
            {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="category-description" className="block text-sm font-medium text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              id="category-description"
              rows={3}
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Short description of this category…"
              className={[
                'w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 border text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white resize-none',
                errors.description
                  ? 'border-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100'
                  : 'border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100',
              ].join(' ')}
            />
            {errors.description && <p className="mt-1 text-xs text-rose-500">{errors.description}</p>}
          </div>

          <div>
            <span className="block text-sm font-medium text-slate-700 mb-1.5">Icon</span>
            <div className="grid grid-cols-6 gap-2">
              {CATEGORY_ICON_OPTIONS.map((option) => {
                const visual = getCategoryVisual(option.value);
                const VisualIcon = visual.icon;
                const isSelected = form.icon === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, icon: option.value }))}
                    title={option.label}
                    className={[
                      'flex items-center justify-center h-10 rounded-xl border transition-colors duration-150',
                      isSelected ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-slate-200 hover:border-slate-300',
                      visual.bg,
                    ].join(' ')}
                  >
                    <VisualIcon width={17} height={17} className={visual.fg} />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <span className="block text-sm font-medium text-slate-700 mb-1.5">Status</span>
            <div className="flex items-center gap-2">
              {[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, status: option.value }))}
                  className={[
                    'flex-1 px-3.5 py-2.5 text-sm font-medium rounded-xl border transition-colors duration-150',
                    form.status === option.value
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700',
                  ].join(' ')}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="category-image" className="block text-sm font-medium text-slate-700 mb-1.5">
              Image <span className="text-slate-400 font-normal">(optional — overrides icon)</span>
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden shrink-0">
                {form.image ? (
                  <img src={form.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon width={20} height={20} className="text-slate-300" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  id="category-image"
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
                  placeholder="Paste an image URL…"
                  className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:bg-white"
                />
                <label className="inline-block text-xs font-medium text-indigo-600 hover:text-indigo-700 cursor-pointer">
                  or upload a file
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 rounded-xl hover:bg-slate-50 transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 shadow-sm hover:from-indigo-600 hover:to-blue-700 disabled:opacity-60 transition-all duration-150"
            >
              {isSaving ? 'Saving…' : 'Save Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
