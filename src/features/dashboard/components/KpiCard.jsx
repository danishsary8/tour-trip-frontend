import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { AnimatedNumber } from "../../../components/ui/AnimatedNumber";
import { Skeleton } from "../../../components/shared/Skeleton";
import { cn } from "../../../lib/cn";
import { fadeUp, useMotionPreset } from "../../../lib/motion";
import { formatPercent } from "../../../lib/format";
import { Sparkline } from "./Sparkline";

const KPI_TONES = {
  primary: { tile: "bg-primary/12 text-primary-ink ring-primary/20", glow: "var(--primary)" },
  accent: { tile: "bg-accent/14 text-accent-ink ring-accent/25", glow: "var(--accent)" },
  info: { tile: "bg-info/12 text-info-ink ring-info/20", glow: "var(--info)" },
  success: { tile: "bg-success/12 text-success-ink ring-success/20", glow: "var(--success)" },
};

export function KpiCardSkeleton() {
  return (
    <div className="h-full rounded-card border border-border bg-surface p-5" aria-hidden="true">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="size-10 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-8 w-32" />
      <Skeleton className="mt-3 h-4 w-40" />
      <Skeleton className="mt-4 h-11 w-full" />
    </div>
  );
}

/**
 * Clickable KPI: count-up value, delta chip against the previous period, sparkline
 * and a spotlight that follows the pointer.
 */
export function KpiCard({ label, metric, format, icon: Icon, tone = "primary", sparkColor, to, linkLabel, comparison }) {
  const ref = useRef(null);
  const variants = useMotionPreset(fadeUp);
  const reduceMotion = useReducedMotion();
  const toneClasses = KPI_TONES[tone];
  const hasDelta = typeof metric.delta === "number";
  const positive = hasDelta && metric.delta >= 0;
  const DeltaIcon = positive ? ArrowUpRight : ArrowDownRight;
  const description = `${label}: ${format(metric.value)}${hasDelta ? `, ${positive ? "up" : "down"} ${formatPercent(metric.delta, { signed: false })} ${comparison}` : ""}. ${linkLabel}`;

  function onPointerMove(event) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    ref.current.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    ref.current.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  }

  return (
    <motion.div variants={variants} whileHover={reduceMotion ? undefined : { y: -4 }} transition={{ duration: 0.22 }} className="h-full">
      <Link
        ref={ref}
        to={to}
        onPointerMove={onPointerMove}
        aria-label={description}
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-card border border-border bg-surface p-5 shadow-soft outline-none",
          "transition-[border-color,box-shadow] duration-300 hover:border-foreground/15 hover:shadow-panel",
          "focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.99]",
        )}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(280px circle at var(--spot-x, 50%) var(--spot-y, 0%), color-mix(in srgb, ${toneClasses.glow} 16%, transparent), transparent 70%)`,
          }}
        />

        <div className="relative flex items-start justify-between gap-3">
          <p className="text-sm font-medium text-muted">{label}</p>
          <span
            className={cn(
              "grid size-10 shrink-0 place-items-center rounded-full ring-1 ring-inset transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105",
              toneClasses.tile,
            )}
          >
            <Icon className="size-[18px]" aria-hidden="true" />
          </span>
        </div>

        <p className="relative mt-2 font-display text-[30px] font-semibold leading-none tracking-[-0.03em] text-foreground sm:text-[32px]">
          <AnimatedNumber value={metric.value} format={(value) => format(Math.round(value))} />
        </p>

        <div className="relative mt-3 flex flex-col items-start gap-1.5 text-xs text-muted">
          {hasDelta && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-semibold tabular-nums",
                positive ? "bg-success/12 text-success-ink" : "bg-danger/12 text-danger-ink",
              )}
            >
              <DeltaIcon className="size-3.5" aria-hidden="true" />
              {formatPercent(metric.delta, { signed: false })}
            </span>
          )}
          <span>{comparison}</span>
        </div>

        <Sparkline
          values={metric.series}
          color={sparkColor}
          label={`${label} trend`}
          className="relative -mx-1 mt-4 h-11"
        />

        <span className="relative mt-3 inline-flex items-center gap-1 text-xs font-semibold text-muted transition-colors duration-200 group-hover:text-foreground">
          {linkLabel}
          <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </Link>
    </motion.div>
  );
}
