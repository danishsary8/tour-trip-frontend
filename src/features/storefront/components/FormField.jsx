import { forwardRef } from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { cn } from "../../../lib/cn";

/**
 * Storefront form controls (light-first): the same look as the Contact form, shared by the
 * booking wizard, the cancel dialog and the review dialog. Errors are announced inline.
 */
const control =
  "w-full rounded-xl border bg-surface-2/60 px-4 text-sm text-foreground outline-none transition-[border-color,background-color,box-shadow] duration-200 placeholder:text-muted/70 hover:bg-surface-2 focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60";
const tone = (error) => (error ? "border-danger focus:border-danger focus:ring-danger/20" : "border-border");

export function Field({ id, label, error, hint, optional, children, className }) {
  return (
    <div className={cn("min-w-0 space-y-1.5", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-muted">
          {label}
          {optional && <span className="ml-1.5 font-medium normal-case tracking-normal text-muted/80">(optional)</span>}
        </label>
        {hint}
      </div>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="flex items-center gap-1 text-xs text-danger-ink">
          <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

export const TextInput = forwardRef(function TextInput({ id, error, className, ...props }, ref) {
  return (
    <input
      ref={ref}
      id={id}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
      className={cn(control, "h-12", tone(error), className)}
      {...props}
    />
  );
});

export const TextArea = forwardRef(function TextArea({ id, error, className, rows = 4, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      id={id}
      rows={rows}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
      className={cn(control, "resize-y py-3 leading-relaxed", tone(error), className)}
      {...props}
    />
  );
});

const SELECT_ARROW = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238a9a9c' stroke-width='2'><path d='m6 9 6 6 6-6'/></svg>")`;

export const SelectInput = forwardRef(function SelectInput({ id, error, className, children, ...props }, ref) {
  return (
    <select
      ref={ref}
      id={id}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
      className={cn(control, "h-12 cursor-pointer appearance-none bg-[length:18px] bg-[right_14px_center] bg-no-repeat pr-10", tone(error), className)}
      style={{ backgroundImage: SELECT_ARROW }}
      {...props}
    >
      {children}
    </select>
  );
});

/** Light-theme checkbox with an animated tick; `children` is the label (may contain links). */
export const CheckField = forwardRef(function CheckField({ id, checked, error, children, className, ...props }, ref) {
  return (
    <div className={className}>
      <label htmlFor={id} className="group flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-foreground">
        <span className="relative mt-0.5 grid size-5 shrink-0 place-items-center">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            checked={checked}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            className="peer sr-only"
            {...props}
          />
          <span className="absolute inset-0 rounded-md border border-border bg-surface transition-colors group-hover:border-primary/60 peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface peer-disabled:opacity-50" />
          <svg viewBox="0 0 14 14" className="relative size-3 text-white" aria-hidden="true">
            <motion.path
              d="M2.2 7.2 5.5 10.2 11.8 3.8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={false}
              animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            />
          </svg>
        </span>
        <span>{children}</span>
      </label>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 flex items-center gap-1 pl-8 text-xs text-danger-ink">
          <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
});
