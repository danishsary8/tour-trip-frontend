import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, Inbox, RotateCw } from "lucide-react";
import { cn } from "../../../lib/cn";
import { fadeUp, useMotionPreset } from "../../../lib/motion";

export function WidgetError({ onRetry, message = "This widget could not be loaded." }) {
  return (
    <div role="alert" className="flex h-full min-h-40 flex-col items-center justify-center gap-3 rounded-card border border-dashed border-danger/30 bg-danger/[0.04] p-6 text-center">
      <span className="grid size-10 place-items-center rounded-full bg-danger/12 text-danger-ink">
        <AlertTriangle className="size-4" aria-hidden="true" />
      </span>
      <p className="text-sm text-muted">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground outline-none transition-[background-color,transform] duration-200 hover:bg-foreground/[0.06] focus-visible:ring-2 focus-visible:ring-primary/60 active:scale-95"
        >
          <RotateCw className="size-3.5" aria-hidden="true" /> Retry
        </button>
      )}
    </div>
  );
}

export function WidgetEmpty({ icon: Icon = Inbox, title = "Nothing here yet", description }) {
  return (
    <div className="flex h-full min-h-40 flex-col items-center justify-center gap-2 p-6 text-center">
      <span className="mb-1 grid size-10 place-items-center rounded-full bg-accent/12 text-accent-ink">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <p className="font-display text-base font-semibold text-foreground">{title}</p>
      {description && <p className="max-w-xs text-xs leading-relaxed text-muted">{description}</p>}
    </div>
  );
}

/**
 * Glass/surface card used by every dashboard widget. It renders the skeleton,
 * error (with Retry) or empty view for `status`, and `children` when ready.
 */
export function WidgetCard({
  ref,
  id,
  eyebrow,
  title,
  description,
  action,
  to,
  headerExtra,
  status = "ready",
  onRetry,
  skeleton,
  empty,
  className,
  bodyClassName,
  children,
}) {
  const variants = useMotionPreset(fadeUp);
  const titleId = id ? `${id}-title` : undefined;

  return (
    <motion.section
      ref={ref}
      variants={variants}
      aria-labelledby={titleId}
      aria-busy={status === "loading"}
      className={cn(
        "relative flex min-w-0 flex-col rounded-card border border-border bg-surface/90 p-5 shadow-soft backdrop-blur-sm sm:p-6",
        className,
      )}
    >
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          {eyebrow && <p className="mb-1 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted">{eyebrow}</p>}
          <h2 id={titleId} className="font-display text-lg font-semibold tracking-[-0.02em] text-foreground">
            {title}
          </h2>
          {description && <p className="mt-0.5 text-xs text-muted">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          {headerExtra}
          {action && to && (
            <Link
              to={to}
              className="group inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-semibold text-primary-ink outline-none transition-[background-color,transform] duration-200 hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-primary/60 active:scale-95"
            >
              {action}
              <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          )}
        </div>
      </header>
      <div className={cn("relative min-h-0 flex-1", bodyClassName)}>
        {status === "loading" ? skeleton : status === "error" ? <WidgetError onRetry={onRetry} /> : status === "empty" ? empty ?? <WidgetEmpty /> : children}
      </div>
    </motion.section>
  );
}
