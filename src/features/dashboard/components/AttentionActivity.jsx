import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Ban, CalendarCheck, CalendarClock, ChevronRight, CircleCheck, CreditCard, PartyPopper, Star } from "lucide-react";
import { Skeleton } from "../../../components/shared/Skeleton";
import { SegmentedControl } from "../../../components/ui/SegmentedControl";
import { cn } from "../../../lib/cn";
import { formatRelativeTime, formatShortDate, formatUsd } from "../../../lib/format";
import { useActivity, useAttention } from "../hooks";
import { useWidgetStatus } from "../widgetState";
import { WidgetCard, WidgetEmpty, WidgetError } from "./WidgetCard";

const TABS = [
  { value: "attention", label: "Needs attention" },
  { value: "activity", label: "Activity" },
];

const EVENT_STYLE = {
  booking: { icon: CalendarCheck, tile: "bg-primary/12 text-primary-ink" },
  confirmed: { icon: CircleCheck, tile: "bg-success/12 text-success-ink" },
  payment: { icon: CreditCard, tile: "bg-success/12 text-success-ink" },
  review: { icon: Star, tile: "bg-accent/14 text-accent-ink" },
  cancellation: { icon: Ban, tile: "bg-danger/12 text-danger-ink" },
};

function RowsSkeleton() {
  return (
    <div className="space-y-3" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((key) => (
        <div key={key} className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-xl" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function AttentionRow({ to, icon: Icon, tile, title, detail, count }) {
  return (
    <li>
      <Link
        to={to}
        className="group flex items-center gap-3 rounded-control p-2 outline-none transition-[background-color,transform] duration-200 hover:bg-foreground/[0.05] focus-visible:ring-2 focus-visible:ring-primary/60 active:scale-[0.99]"
      >
        <span className={cn("relative grid size-9 shrink-0 place-items-center rounded-xl", tile)}>
          <Icon className="size-4" aria-hidden="true" />
          {count > 0 && (
            <span className="absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold tabular-nums text-white ring-2 ring-surface">
              {count}
            </span>
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="line-clamp-2 block text-sm font-medium leading-snug text-foreground">{title}</span>
          <span className="block truncate text-xs text-muted">{detail}</span>
        </span>
        <ChevronRight className="size-4 shrink-0 text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-foreground" aria-hidden="true" />
      </Link>
    </li>
  );
}

function AttentionList() {
  const query = useAttention();
  const status = useWidgetStatus(query, (data) => !data.pendingBookings.count && !data.reviews.count && !data.almostFull.length);

  if (status === "loading") return <RowsSkeleton />;
  if (status === "error") return <WidgetError onRetry={() => query.refetch()} />;
  if (status === "empty") return <WidgetEmpty icon={PartyPopper} title="All caught up" description="Nothing needs your attention right now." />;

  const { pendingBookings, reviews, almostFull } = query.data;
  return (
    <ul className="space-y-1">
      {pendingBookings.count > 0 && (
        <AttentionRow
          to="/admin/bookings"
          icon={CalendarCheck}
          tile="bg-accent/14 text-accent-ink"
          count={pendingBookings.count}
          title={`${pendingBookings.count} bookings awaiting confirmation`}
          detail={pendingBookings.items.map((item) => item.customerName.split(" ")[0]).join(", ") + (pendingBookings.count > 3 ? " and others" : "")}
        />
      )}
      {reviews.count > 0 && (
        <AttentionRow
          to="/admin/reviews"
          icon={Star}
          tile="bg-info/12 text-info-ink"
          count={reviews.count}
          title={`${reviews.count} reviews awaiting approval`}
          detail={reviews.items.map((item) => `${item.rating}★ ${item.tourName}`).join(" · ")}
        />
      )}
      {almostFull.map((schedule) => {
        const full = schedule.seatsBooked >= schedule.capacity;
        return (
          <AttentionRow
            key={schedule.id}
            to="/admin/tour-schedules"
            icon={CalendarClock}
            tile={full ? "bg-danger/12 text-danger-ink" : "bg-accent/14 text-accent-ink"}
            title={`${schedule.tourName} is ${full ? "full" : "almost full"}`}
            detail={`${formatShortDate(schedule.date)} · ${schedule.seatsBooked} / ${schedule.capacity} seats`}
          />
        );
      })}
    </ul>
  );
}

function ActivityList() {
  const query = useActivity();
  const status = useWidgetStatus(query, (data) => data.length === 0);
  const reduceMotion = useReducedMotion();

  if (status === "loading") return <RowsSkeleton />;
  if (status === "error") return <WidgetError onRetry={() => query.refetch()} />;
  if (status === "empty") return <WidgetEmpty title="No activity yet" />;

  return (
    <ol className="relative space-y-1" aria-live="polite">
      <AnimatePresence initial={false}>
        {query.data.map((event) => {
          const style = EVENT_STYLE[event.type] ?? EVENT_STYLE.booking;
          const Icon = style.icon;
          return (
            <motion.li
              key={event.id}
              layout={reduceMotion ? false : "position"}
              initial={reduceMotion ? false : { opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-start gap-3 rounded-control p-2 transition-colors duration-200 hover:bg-foreground/[0.04]"
            >
              <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl", style.tile)}>
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-sm font-medium text-foreground">{event.title}</span>
                  <time dateTime={event.at} className="shrink-0 text-[11px] text-muted">
                    {formatRelativeTime(event.at)}
                  </time>
                </span>
                <span className="block truncate text-xs text-muted">
                  {event.detail}
                  {event.amount ? ` · ${formatUsd(event.amount)}` : ""}
                </span>
              </span>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ol>
  );
}

/** Two views in one card: action items that link to the right page, and a live activity feed. */
export function AttentionActivity({ className }) {
  const [tab, setTab] = useState("attention");
  const reduceMotion = useReducedMotion();
  const attention = useAttention();
  const count = attention.data ? (attention.data.pendingBookings.count ? 1 : 0) + (attention.data.reviews.count ? 1 : 0) + attention.data.almostFull.length : 0;

  return (
    <WidgetCard
      id="attention"
      eyebrow="Today"
      title={tab === "attention" ? "Needs attention" : "Recent activity"}
      description={tab === "attention" ? `${count} items to review` : "The latest across bookings, payments and reviews"}
      className={className}
      bodyClassName="flex flex-col"
    >
      <SegmentedControl size="sm" label="Panel view" options={TABS} value={tab} onChange={setTab} className="mb-4 w-full [&>button]:flex-1" />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tab}
          className={cn("flex flex-1 flex-col", tab === "attention" && "justify-center")}
          initial={{ opacity: 0, x: reduceMotion ? 0 : tab === "activity" ? 12 : -12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: reduceMotion ? 0 : tab === "activity" ? -12 : 12 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {tab === "attention" ? <AttentionList /> : <ActivityList />}
        </motion.div>
      </AnimatePresence>
    </WidgetCard>
  );
}
