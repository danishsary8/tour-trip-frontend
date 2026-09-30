import React from 'react';
import { ArrowLeft, Save, X } from 'lucide-react';

export default function CategoryHeader({ onSave, onCancel }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface p-4 rounded-xl border border-border shadow-sm mb-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onCancel}
          className="p-2 hover:bg-surface-2 rounded-lg text-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-2 text-xs text-muted mb-1">
            <span>Manage Masters</span>
            <span>/</span>
            <span>Categories</span>
            <span>/</span>
            <span className="text-foreground font-medium">Create Category</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Create Category</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-background transition-colors"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg text-sm font-medium hover:bg-success transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Category
        </button>
      </div>
    </div>
  );
}