import React from 'react'
import { useState, useRef } from "react";
import { Upload, Camera, UserCircle2 } from "lucide-react";
import Card from './Card';
import { cx } from '../../utils/helpers';

const PhotoUpload = ({ photo, onUpload, onRemove }) => {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);
    
      const handleFiles = (files) => {
        const file = files?.[0];
        if (!file) return;
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return;
        if (file.size > 5 * 1024 * 1024) return;
        const url = URL.createObjectURL(file);
        onUpload({ url, name: file.name });
      };
    
      return (
        <Card title="Customer Photo" icon={Camera}>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
            className={cx(
              "rounded-xl border-2 border-dashed p-6 flex flex-col items-center text-center transition-colors duration-200",
              dragOver ? "border-primary bg-primary/10" : "border-border bg-surface-2/50"
            )}
          >
            <div className="w-24 h-24 rounded-full bg-surface border border-border shadow-sm flex items-center justify-center overflow-hidden mb-4">
              {photo ? (
                <img src={photo.url} alt="Customer" className="w-full h-full object-cover" />
              ) : (
                <UserCircle2 className="w-14 h-14 text-muted" />
              )}
            </div>
    
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
    
            {photo ? (
              <div className="flex flex-col items-center gap-2 w-full">
                <p className="text-[13px] font-medium text-foreground font-body truncate max-w-[180px]">{photo.name}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="text-[12.5px] font-medium px-3 py-1.5 rounded-lg border border-border text-foreground hover:bg-surface transition-colors font-body"
                  >
                    Change Photo
                  </button>
                  <button
                    type="button"
                    onClick={onRemove}
                    className="text-[12.5px] font-medium px-3 py-1.5 rounded-lg border border-danger/30 text-danger-ink hover:bg-danger/12 transition-colors font-body"
                  >
                    Remove Photo
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="inline-flex items-center gap-2 text-[13px] font-semibold px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary transition-colors font-body shadow-sm"
                >
                  <Upload className="w-4 h-4" /> Upload Photo
                </button>
                <p className="text-[12.5px] text-muted mt-3 font-body">or drag &amp; drop an image here</p>
              </>
            )}
          </div>
          <p className="text-[12px] text-muted mt-3 text-center font-body">JPG, PNG, or WEBP &middot; Maximum size 5MB</p>
        </Card>
      )
}

export default PhotoUpload
