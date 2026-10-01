import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CalendarDays, Clock3, MapPin, ShieldCheck, Users } from "lucide-react";
import { cn } from "../../../../lib/cn";
import { formatUsd } from "../../../../lib/format";
import { formatTripDate, travellersLabel } from "../../booking";
import { CANCELLATION_WINDOW } from "../../content";

/** Price lines (count × unit) and a total that animates when travellers change. */
export function PriceLines({ breakdown, totalLabel = "Total", className }) {
  const reduceMotion = useReducedMotion();
  return (
    <dl className={cn("space-y-2.5 text-sm", className)}>
      {breakdown.lines.map((line) => (
        <div key={line.label} className="flex items-baseline justify-between gap-3">
          <dt className="text-muted">
            {line.label}
            {line.count !== undefined && <span className="tabular-nums"> · {line.count} × {formatUsd(line.unit)}</span>}
          </dt>
          <dd className={cn("font-semibold tabular-nums", line.amount < 0 ? "text-success-ink" : "text-foreground")}>
            {line.amount < 0 ? `−${formatUsd(-line.amount)}` : formatUsd(line.amount)}
          </dd>
        </div>
      ))}
      <div className="flex items-baseline justify-between gap-3 border-t border-border pt-3">
        <dt className="font-semibold text-foreground">{totalLabel}</dt>
        <dd className="relative overflow-hidden font-display text-2xl font-semibold tabular-nums text-foreground" aria-live="polite">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={breakdown.total}
              className="block"
              initial={reduceMotion ? false : { y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { y: -12, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              {formatUsd(breakdown.total)}
            </motion.span>
          </AnimatePresence>
        </dd>
      </div>
    </dl>
  );
}

/** Sticky checkout sidebar, styled like the Tour Detail booking card. */
export function TripSummary({ tour, schedule, adults, childCount, breakdown }) {
  return (
    <aside aria-label="Your trip" className="hidden self-start lg:sticky lg:top-24 lg:block">
      <div className="overflow-hidden rounded-panel border border-border bg-surface shadow-panel">
        <div className="relative aspect-[16/9]">
          <img src={tour.image} alt="" className="size-full object-cover" width="380" height="214" decoding="async" />
          <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" aria-hidden="true" />
          <p className="absolute bottom-3 left-4 right-4 font-display text-lg font-semibold leading-tight text-white">{tour.name}</p>
        </div>
        <div className="p-6">
          <ul className="space-y-2 text-sm text-muted">
            <li className="flex items-center gap-2"><MapPin className="size-4 shrink-0 text-primary-ink" aria-hidden="true" />{tour.destination}</li>
            <li className="flex items-center gap-2">
              <CalendarDays className="size-4 shrink-0 text-primary-ink" aria-hidden="true" />
              {schedule ? formatTripDate(schedule.date) : "Choose a departure"}
            </li>
            {schedule && <li className="flex items-center gap-2"><Clock3 className="size-4 shrink-0 text-primary-ink" aria-hidden="true" />Departs {schedule.time} · {tour.durationLabel}</li>}
            <li className="flex items-center gap-2"><Users className="size-4 shrink-0 text-primary-ink" aria-hidden="true" />{travellersLabel(adults, childCount)}</li>
          </ul>
          <PriceLines breakdown={breakdown} className="mt-5 border-t border-border pt-5" />
          <p className="mt-5 flex items-start gap-2 rounded-card bg-success/[0.08] p-3 text-xs leading-relaxed text-success-ink">
            <ShieldCheck className="mt-px size-4 shrink-0" aria-hidden="true" />
            Free cancellation up to {CANCELLATION_WINDOW} before departure.
          </p>
        </div>
      </div>
    </aside>
  );
}

/** Below lg the running total stays pinned to the bottom of the screen. */
export function MobileTotalBar({ adults, childCount, total }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 px-5 py-3 shadow-panel backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
        <p className="text-xs text-muted">Total · {travellersLabel(adults, childCount)}</p>
        <p className="font-display text-xl font-semibold tabular-nums text-foreground" aria-live="polite">{formatUsd(total)}</p>
      </div>
    </div>
  );
}
