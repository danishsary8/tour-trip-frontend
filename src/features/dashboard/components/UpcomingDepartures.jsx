import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { CalendarClock, Clock } from "lucide-react";
import { Skeleton } from "../../../components/shared/Skeleton";
import { Tooltip } from "../../../components/ui/Tooltip";
import { cn } from "../../../lib/cn";
import { useUpcomingDepartures } from "../hooks";
import { useWidgetStatus } from "../widgetState";
import { WidgetCard, WidgetEmpty } from "./WidgetCard";

const dayFormat = new Intl.DateTimeFormat("en-US", { day: "numeric", timeZone: "UTC" });
const monthFormat = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" });
const weekdayFormat = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "UTC" });

/** jade below 80%, gold from 80%, danger when full. */
function seatTone(ratio) {
  if (ratio >= 1) return { bar: "bg-danger", text: "text-danger-ink", label: "Full" };
  if (ratio >= 0.8) return { bar: "bg-accent", text: "text-accent-ink", label: "Almost full" };
  return { bar: "bg-success", text: "text-success-ink", label: null };
}

function ListSkeleton() {
  return (
    <div className="space-y-4" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((key) => (
        <div key={key} className="flex items-center gap-3">
          <Skeleton className="h-12 w-11 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-1/2" />
            <Skeleton className="h-1.5 w-full rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Next five tour schedules with seat capacity. */
export function UpcomingDepartures({ className }) {
  const query = useUpcomingDepartures();
  const status = useWidgetStatus(query, (data) => data.length === 0);
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, amount: 0.3 });
  const reduceMotion = useReducedMotion();

  return (
    <WidgetCard
      ref={cardRef}
      id="departures"
      eyebrow="Tour schedules"
      title="Upcoming departures"
      description="Seats booked for the next five departures"
      action="Schedules"
      to="/admin/tour-schedules"
      status={status}
      onRetry={() => query.refetch()}
      skeleton={<ListSkeleton />}
      empty={<WidgetEmpty icon={CalendarClock} title="No departures scheduled" description="Add a tour schedule to see it here." />}
      className={className}
    >
      <ul className="space-y-1">
        {(query.data ?? []).map((schedule, index) => {
          const ratio = schedule.seatsBooked / schedule.capacity;
          const tone = seatTone(ratio);
          const date = new Date(`${schedule.date}T00:00:00Z`);
          return (
            <li key={schedule.id} className="flex items-center gap-3 rounded-control p-1.5 transition-colors duration-200 hover:bg-foreground/[0.04]">
              <span className="grid w-11 shrink-0 place-items-center rounded-xl border border-border bg-surface-2/60 py-1.5 text-center leading-none">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-primary-ink">{monthFormat.format(date)}</span>
                <span className="mt-0.5 font-display text-lg font-semibold tabular-nums text-foreground">{dayFormat.format(date)}</span>
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-foreground" title={schedule.tourName}>
                    {schedule.tourName}
                  </p>
                  <Tooltip label={`Guide: ${schedule.guide.name}`} side="bottom" className="inline-flex shrink-0">
                    <span
                      tabIndex={0}
                      aria-label={`Guide ${schedule.guide.name}`}
                      className="grid size-7 place-items-center rounded-full bg-info/14 text-[10px] font-bold text-info-ink ring-2 ring-surface outline-none focus-visible:ring-primary/60"
                    >
                      {schedule.guide.initials}
                    </span>
                  </Tooltip>
                </div>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                  <Clock className="size-3" aria-hidden="true" />
                  {weekdayFormat.format(date)} {schedule.time} · {schedule.destination}
                </p>
                <div className="mt-2 flex items-center gap-2.5">
                  <div
                    className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/[0.07]"
                    role="meter"
                    aria-valuemin={0}
                    aria-valuemax={schedule.capacity}
                    aria-valuenow={schedule.seatsBooked}
                    aria-label={`${schedule.seatsBooked} of ${schedule.capacity} seats booked`}
                  >
                    <motion.div
                      className={cn("h-full origin-left rounded-full", tone.bar)}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: inView ? Math.min(1, ratio) : 0 }}
                      transition={reduceMotion ? { duration: 0 } : { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: inView ? 0.07 * index : 0 }}
                    />
                  </div>
                  <span className={cn("w-12 shrink-0 text-right text-xs font-semibold tabular-nums", tone.text)}>
                    {schedule.seatsBooked} / {schedule.capacity}
                  </span>
                  {tone.label && (
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                        ratio >= 1 ? "bg-danger/14 text-danger-ink" : "bg-accent/16 text-accent-ink",
                      )}
                    >
                      {tone.label}
                    </span>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </WidgetCard>
  );
}
