"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * components/ui/FileUpload.tsx
 * Drag-and-drop file upload with preview, progress, and error states.
 * Returns the selected File object to parent via onChange.
 */

interface FileUploadProps {
  label?: string;
  accept?: string;
  maxSizeMb?: number;
  onChange: (file: File | null) => void;
  value?: File | null;
  errorMessage?: string;
  helperText?: string;
  disabled?: boolean;
  className?: string;
}

export function FileUpload({
  label,
  accept = "*/*",
  maxSizeMb = 10,
  onChange,
  value,
  errorMessage,
  helperText,
  disabled = false,
  className,
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [localError, setLocalError] = React.useState<string | null>(null);

  const displayError = errorMessage ?? localError;
  const hasError = Boolean(displayError);

  const validate = (file: File): string | null => {
    if (file.size > maxSizeMb * 1024 * 1024) {
      return `File must be smaller than ${maxSizeMb} MB`;
    }
    return null;
  };

  const handleFile = (file: File) => {
    const err = validate(file);
    if (err) { setLocalError(err); onChange(null); return; }
    setLocalError(null);
    onChange(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const isImage = value && value.type.startsWith("image/");
  const previewUrl = React.useMemo(
    () => (isImage && value ? URL.createObjectURL(value) : null),
    [isImage, value]
  );

  React.useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      {label && (
        <span className={cn("text-sm font-medium text-[var(--text-primary)]", disabled && "opacity-50")}>
          {label}
        </span>
      )}

      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center gap-3",
          "min-h-[120px] w-full rounded-[var(--radius-lg)] border-2 border-dashed",
          "transition-all duration-200 cursor-pointer",
          isDragging
            ? "border-[var(--accent-500)] bg-[var(--accent-50)]"
            : "border-[var(--border-default)] bg-[var(--bg-base)] hover:border-[var(--accent-400)] hover:bg-[var(--bg-subtle)]",
          hasError && "border-[var(--status-error)]",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none"
        )}
      >
        {value ? (
          /* Preview */
          <div className="flex flex-col items-center gap-2 p-4 text-center">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="Preview" className="max-h-24 max-w-full rounded-[var(--radius-md)] object-contain" />
            ) : (
              <div className="w-10 h-10 flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--bg-muted)]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--text-muted)]">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                  <path d="M14 2v6h6" />
                </svg>
              </div>
            )}
            <p className="text-sm text-[var(--text-primary)] font-medium truncate max-w-[200px]">{value.name}</p>
            <p className="text-xs text-[var(--text-muted)]">{(value.size / 1024).toFixed(1)} KB</p>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(null); setLocalError(null); if (inputRef.current) inputRef.current.value = ""; }}
              className="text-xs text-[var(--status-error)] hover:underline"
            >
              Remove
            </button>
          </div>
        ) : (
          /* Upload prompt */
          <div className="flex flex-col items-center gap-2 px-6 py-4 text-center pointer-events-none">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--accent-100)]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p className="text-sm text-[var(--text-primary)]">
              <span className="font-medium text-[var(--accent-500)]">Click to upload</span> or drag & drop
            </p>
            <p className="text-xs text-[var(--text-muted)]">Max {maxSizeMb} MB</p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="sr-only"
          tabIndex={-1}
        />
      </div>

      {hasError && <p role="alert" className="text-xs text-[var(--status-error)]">{displayError}</p>}
      {!hasError && helperText && <p className="text-xs text-[var(--text-muted)]">{helperText}</p>}
    </div>
  );
}
