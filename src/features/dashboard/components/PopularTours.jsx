import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Map as MapIcon } from "lucide-react";
import { Skeleton } from "../../../components/shared/Skeleton";
import { AnimatedNumber } from "../../../components/ui/AnimatedNumber";
import { formatCount } from "../../../lib/format";
import { usePopularTours } from "../hooks";
import { RANGE_COPY } from "../ranges";
import { useWidgetStatus } from "../widgetState";
import { WidgetCard, WidgetEmpty } from "./WidgetCard";

function ListSkeleton() {
  return (
    <div className="space-y-4" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((key) => (
        <div key={key} className="flex items-center gap-3">
          <Skeleton className="size-11 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-2/3" />
            <Skeleton className="h-1.5 w-full rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Popular tours report: ranked by non-cancelled bookings, bar = share of the top tour. */
export function PopularTours({ range, className }) {
  const query = usePopularTours(range);
  const status = useWidgetStatus(query, (data) => data.items.every((item) => item.bookings === 0));
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, amount: 0.3 });
  const reduceMotion = useReducedMotion();

  return (
    <WidgetCard
      ref={cardRef}
      id="popular-tours"
      eyebrow="Popular tours report"
      title="Most booked tours"
      description={`Confirmed and pending bookings, ${RANGE_COPY[range].period}`}
      action="Tours"
      to="/admin/masters"
      status={status}
      onRetry={() => query.refetch()}
      skeleton={<ListSkeleton />}
      empty={<WidgetEmpty icon={MapIcon} title="No tour bookings in this range" />}
      className={className}
    >
      <ol className="space-y-1">
        {(query.data?.items ?? []).map((tour) => (
          <li key={tour.id}>
            <div className="group flex items-center gap-3 rounded-control p-1.5 transition-colors duration-200 hover:bg-foreground/[0.04]">
              <span className="w-5 shrink-0 text-center font-display text-sm font-semibold tabular-nums text-muted">{tour.rank}</span>
              <span className="relative size-11 shrink-0 overflow-hidden rounded-xl ring-1 ring-border">
                <img
                  src={tour.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width="44"
                  height="44"
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="truncate text-sm font-semibold text-foreground" title={tour.name}>
                    {tour.name}
                  </p>
                  <p className="shrink-0 text-sm font-semibold text-foreground">
                    <AnimatedNumber value={tour.bookings} format={(value) => formatCount(Math.round(value))} />
                    <span className="ml-1 text-xs font-normal text-muted">bookings</span>
                  </p>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted">
                  {tour.destination} · {formatCount(tour.travelers)} travellers
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-foreground/[0.07]">
                  <motion.div
                    className="h-full origin-left rounded-full bg-gradient-to-r from-primary to-accent"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: inView ? tour.share / 100 : 0 }}
                    transition={reduceMotion ? { duration: 0 } : { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: inView ? 0.08 * tour.rank : 0 }}
                  />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </WidgetCard>
  );
}
