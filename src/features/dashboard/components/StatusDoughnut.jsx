import { useMemo, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { Doughnut } from "react-chartjs-2";
import { Skeleton } from "../../../components/shared/Skeleton";
import { AnimatedNumber } from "../../../components/ui/AnimatedNumber";
import { centerTextPlugin, tooltipPreset, useChartTheme } from "../../../lib/chart";
import { cn } from "../../../lib/cn";
import { formatPercent } from "../../../lib/format";
import { useStatusBreakdown } from "../hooks";
import { RANGE_COPY } from "../ranges";
import { useWidgetStatus } from "../widgetState";
import { WidgetCard, WidgetEmpty } from "./WidgetCard";

const STATUS_COLOR = { Confirmed: "success", Pending: "accent", Completed: "info", Cancelled: "danger" };
const plugins = [centerTextPlugin];

function DoughnutSkeleton() {
  return (
    <div aria-hidden="true">
      <Skeleton className="mx-auto size-48 rounded-full" />
      <div className="mt-6 space-y-2">
        {[0, 1, 2, 3].map((key) => (
          <Skeleton key={key} className="h-9 w-full" />
        ))}
      </div>
    </div>
  );
}

/** Bookings by status with an interactive legend: hover pops a slice, click hides it. */
export function StatusDoughnut({ range, className }) {
  const query = useStatusBreakdown(range);
  const status = useWidgetStatus(query, (data) => data.total === 0);
  const theme = useChartTheme();
  const reduceMotion = useReducedMotion();
  const cardRef = useRef(null);
  const chartRef = useRef(null);
  const inView = useInView(cardRef, { once: true, amount: 0.3 });
  const [hidden, setHidden] = useState(() => new Set());

  const items = useMemo(() => query.data?.items ?? [], [query.data]);
  const visibleTotal = items.reduce((sum, item, index) => (hidden.has(index) ? sum : sum + item.count), 0);
  const colors = items.map((item) => theme[STATUS_COLOR[item.status]]);

  const data = useMemo(
    () => ({
      labels: items.map((item) => item.status),
      datasets: [
        {
          data: items.map((item) => item.count),
          backgroundColor: items.map((item) => theme[STATUS_COLOR[item.status]]),
          hoverBackgroundColor: items.map((item) => theme[STATUS_COLOR[item.status]]),
          borderColor: theme.surface,
          hoverBorderColor: theme.surface,
          borderWidth: 3,
          borderRadius: 6,
          spacing: 1,
          hoverOffset: 12,
        },
      ],
    }),
    [items, theme],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: "72%",
      layout: { padding: 14 },
      animation: reduceMotion ? false : { animateRotate: true, animateScale: true, duration: 1000, easing: "easeOutQuart" },
      plugins: {
        legend: { display: false },
        centerText: { value: visibleTotal, label: "bookings", color: theme.foreground, labelColor: theme.muted, animate: !reduceMotion },
        tooltip: tooltipPreset(theme, {
          callbacks: {
            label: (context) => ` ${context.label}: ${context.parsed} (${formatPercent((context.parsed / (visibleTotal || 1)) * 100, { signed: false })})`,
          },
        }),
      },
    }),
    [reduceMotion, theme, visibleTotal],
  );

  function highlight(index) {
    const chart = chartRef.current;
    if (!chart || hidden.has(index)) return;
    const active = [{ datasetIndex: 0, index }];
    chart.setActiveElements(active);
    chart.tooltip.setActiveElements(active, { x: chart.width / 2, y: chart.height / 2 });
    chart.update();
  }

  function clearHighlight() {
    const chart = chartRef.current;
    if (!chart) return;
    chart.setActiveElements([]);
    chart.tooltip.setActiveElements([], { x: 0, y: 0 });
    chart.update();
  }

  function toggle(index) {
    const chart = chartRef.current;
    if (chart) {
      chart.toggleDataVisibility(index);
      chart.update();
    }
    setHidden((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <WidgetCard
      ref={cardRef}
      id="status"
      eyebrow="Booking status report"
      title="Bookings by status"
      description={`Booked in the ${RANGE_COPY[range].period}`}
      action="Bookings"
      to="/admin/bookings"
      status={status}
      onRetry={() => query.refetch()}
      skeleton={<DoughnutSkeleton />}
      empty={<WidgetEmpty title="No bookings in this range" description="Try a longer range to see how bookings progress." />}
      className={className}
    >
      <div
        className="relative mx-auto aspect-square w-full max-w-[230px]"
        role="img"
        aria-label={`Bookings by status: ${items.map((item) => `${item.status} ${item.count}`).join(", ")}.`}
      >
        {inView && <Doughnut ref={chartRef} data={data} options={options} plugins={plugins} />}
      </div>

      <ul className="mt-5 grid gap-1" aria-label="Toggle statuses">
        {items.map((item, index) => {
          const isHidden = hidden.has(index);
          return (
            <li key={item.status}>
              <button
                type="button"
                aria-pressed={!isHidden}
                onClick={() => toggle(index)}
                onMouseEnter={() => highlight(index)}
                onMouseLeave={clearHighlight}
                onFocus={() => highlight(index)}
                onBlur={clearHighlight}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-control px-2.5 py-2 text-left text-sm outline-none",
                  "transition-[background-color,opacity,transform] duration-200 hover:bg-foreground/[0.05] focus-visible:ring-2 focus-visible:ring-primary/60 active:scale-[0.99]",
                  isHidden && "opacity-45",
                )}
              >
                <span
                  className={cn("size-2.5 shrink-0 rounded-full transition-transform duration-200 group-hover:scale-125", isHidden && "ring-1 ring-inset ring-muted")}
                  style={{ backgroundColor: isHidden ? "transparent" : colors[index] }}
                  aria-hidden="true"
                />
                <span className={cn("flex-1 text-foreground", isHidden && "line-through decoration-muted")}>{item.status}</span>
                <span className="font-semibold text-foreground">
                  <AnimatedNumber value={item.count} />
                </span>
                <span className="w-12 text-right text-xs tabular-nums text-muted">
                  {isHidden ? "—" : formatPercent((item.count / (visibleTotal || 1)) * 100, { signed: false, digits: 0 })}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </WidgetCard>
  );
}
