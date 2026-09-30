import { forwardRef, useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "../../lib/cn";

/**
 * Accessible on/off switch (`role="switch"`). Works controlled (`checked` + `onCheckedChange`)
 * and with react-hook-form via `Controller`. `label` and `description` render beside it.
 */
export const Switch = forwardRef(function Switch(
  { checked = false, onCheckedChange, label, description, disabled = false, id: suppliedId, className, ...props },
  ref,
) {
  const generatedId = useId();
  const id = suppliedId ?? generatedId;
  const descriptionId = `${id}-description`;
  const reduceMotion = useReducedMotion();

  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      {(label || description) && (
        <div className="min-w-0">
          {label && (
            <label htmlFor={id} className={cn("text-sm font-semibold text-foreground", disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer")}>
              {label}
            </label>
          )}
          {description && (
            <p id={descriptionId} className="mt-0.5 text-xs leading-relaxed text-muted">
              {description}
            </p>
          )}
        </div>
      )}
      <button
        ref={ref}
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-describedby={description ? descriptionId : undefined}
        disabled={disabled}
        onClick={() => onCheckedChange?.(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border outline-none transition-[background-color,border-color,box-shadow] duration-200",
          "focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95",
          "disabled:cursor-not-allowed disabled:opacity-50",
          checked ? "border-primary bg-primary hover:shadow-[0_0_0_4px_var(--focus-ring)]" : "border-border bg-surface-2 hover:border-foreground/25",
        )}
        {...props}
      >
        <motion.span
          aria-hidden="true"
          initial={false}
          animate={{ x: checked ? 22 : 2 }}
          transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 34 }}
          className={cn("block size-[18px] rounded-full shadow-sm", checked ? "bg-white" : "bg-muted")}
        />
      </button>
    </div>
  );
});
