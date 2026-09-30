import { motion, useReducedMotion } from "framer-motion";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "../../lib/cn";
import { fadeUp, useMotionPreset } from "../../lib/motion";
import { Skeleton } from "./Skeleton";

/**
 * KPI card shell. `delta` is a percentage change (positive or negative).
 * Charts and count-up animation arrive with the dashboard in Phase 3.
 */
export function StatCard({ label, value, delta, deltaLabel = "vs last month", icon: Icon, loading = false, className }) {
  const variants = useMotionPreset(fadeUp);
  const reduceMotion = useReducedMotion();
  const positive = typeof delta === "number" && delta >= 0;

  if (loading) {
    return (
      <div className={cn("rounded-card border border-border bg-surface p-5", className)} aria-busy="true">
        <div className="flex items-start justify-between">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="size-10 rounded-xl" />
        </div>
        <Skeleton className="mt-4 h-8 w-32" />
        <Skeleton className="mt-3 h-3 w-28" />
      </div>
    );
  }

  return (
    <motion.article
      variants={variants}
      initial="hidden"
      animate="visible"
      whileHover={reduceMotion ? undefined : { y: -3 }}
      className={cn(
        "group relative overflow-hidden rounded-card border border-border bg-surface p-5 shadow-soft transition-[border-color,box-shadow] duration-300 hover:border-primary/25",
        className,
      )}
    >
      <span
        className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-primary/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      />
      <div className="relative flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted">{label}</p>
        {Icon && (
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary-ink ring-1 ring-inset ring-primary/20 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
            <Icon className="size-[18px]" aria-hidden="true" />
          </span>
        )}
      </div>
      <p className="relative mt-3 font-display text-[30px] font-semibold leading-none tracking-[-0.03em] tabular-nums text-foreground">{value}</p>
      {typeof delta === "number" && (
        <p className="relative mt-3 flex items-center gap-2 text-xs text-muted">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 font-semibold tabular-nums",
              positive ? "bg-success/12 text-success-ink" : "bg-danger/12 text-danger-ink",
            )}
          >
            {positive ? <TrendingUp className="size-3" aria-hidden="true" /> : <TrendingDown className="size-3" aria-hidden="true" />}
            {positive ? "+" : ""}
            {delta}%
          </span>
          {deltaLabel}
        </p>
      )}
    </motion.article>
  );
}
