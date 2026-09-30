import React from 'react';
import { MoreVertical, Calendar, Layers, Eye } from 'lucide-react';

export default function CatalogPreviewCard({ formData }) {
  return (
    <div className="bg-surface p-5 rounded-xl border border-border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted">
          <Eye className="w-4 h-4 text-success-ink" />
          Catalog Live Preview
        </div>
        <span className="bg-success/12 text-success-ink text-xs px-2.5 py-1 rounded-full font-medium">
          Real-time
        </span>
      </div>

      <div className="border border-border rounded-lg p-4 bg-surface-2/50">
        <div className="flex justify-between items-start mb-2">
          <span className="bg-success/12 text-success-ink text-xs font-mono font-bold px-2 py-0.5 rounded">
            {formData.categoryCode || "CAT-000"}
          </span>
          <span className="text-xs bg-success/10 text-success-ink font-semibold px-2 py-0.5 rounded">
            {formData.status || "Active"}
          </span>
          <button className="text-muted hover:text-muted">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        <h3 className="font-bold text-foreground text-base mb-1">
          {formData.categoryName || "Category Name"}
        </h3>
        <p className="text-xs text-muted line-clamp-2 mb-3">
          {formData.description || "Description will appear here."}
        </p>

        <div className="flex items-center justify-between text-[11px] text-muted pt-2 border-t border-border">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formData.activationDate || "YYYY-MM-DD"}
          </span>
          <span className="flex items-center gap-1 font-medium text-muted">
            <Layers className="w-3.5 h-3.5" />
            0 Tours Linked
          </span>
        </div>
      </div>
    </div>
  );
}