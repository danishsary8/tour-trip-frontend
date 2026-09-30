import { useCallback, useMemo } from "react";
import { useReducedMotion } from "framer-motion";
import { Skeleton } from "../../../components/shared/Skeleton";
import { AnimatedNumber } from "../../../components/ui/AnimatedNumber";
import { tooltipPreset, useChartTheme } from "../../../lib/chart";
import { cn } from "../../../lib/cn";
import { formatCount, formatUsd } from "../../../lib/format";
import { RANGE_COPY } from "../../dashboard/ranges";
import { WidgetCard, WidgetEmpty } from "../../dashboard/components/WidgetCard";
import { useWidgetStatus } from "../../dashboard/widgetState";
import { useRegisterExport } from "../exportContext";
import { useStatusReport } from "../hooks";
import { ReportChart } from "./ReportChart";

const STATUS_TONE = {
  Pending: { color: "accent", dot: "bg-accent", ring: "hover:border-accent/40" },
  Confirmed: { color: "success", dot: "bg-success", ring: "hover:border-success/40" },
  Completed: { color: "info", dot: "bg-info", ring: "hover:border-info/40" },
  Cancelled: { color: "danger", dot: "bg-danger", ring: "hover:border-danger/40" },
};
const TICK_LIMITS = { "7D": 7, "30D": 10, "90D": 13, "12M": 12 };

/** Booking status report: counts and shares, plus how the mix changed over the range. */
export function StatusReport({ range }) {
  const query = useStatusReport(range);
  const status = useWidgetStatus(query, (data) => data.total === 0);
  const theme = useChartTheme();
  const reduceMotion = useReducedMotion();
  const data = query.data;

  const chartData = useMemo(
    () => ({
      labels: data?.timeline.map((point) => point.label) ?? [],
      datasets: Object.entries(STATUS_TONE).map(([statusName, tone], index, all) => ({
        label: statusName,
        data: data?.timeline.map((point) => point[statusName]) ?? [],
        backgroundColor: theme[tone.color],
        borderRadius: index === all.length - 1 ? { topLeft: 5, topRight: 5 } : 0,
        borderSkipped: false,
        maxBarThickness: 32,
        categoryPercentage: 0.74,
      })),
    }),
    [data, theme],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: reduceMotion
        ? false
        : { duration: 700, easing: "easeOutQuart", delay: (context) => (context.type === "data" && context.mode === "default" ? context.dataIndex * 30 : 0) },
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: tooltipPreset(theme, {
          callbacks: {
            title: (items) => data?.timeline[items[0]?.dataIndex]?.title ?? "",
            label: (context) => ` ${context.dataset.label}: ${formatCount(context.parsed.y)}`,
          },
        }),
      },
      scales: {
        x: { stacked: true, grid: { display: false }, border: { display: false }, ticks: { color: theme.muted, font: { size: 11 }, maxRotation: 0, autoSkip: true, maxTicksLimit: TICK_LIMITS[range] } },
        y: { stacked: true, beginAtZero: true, border: { display: false }, grid: { color: theme.grid, drawTicks: false }, ticks: { color: theme.muted, font: { size: 11 }, padding: 8, precision: 0, maxTicksLimit: 6 } },
      },
    }),
    [reduceMotion, theme, data, range],
  );

  const buildExport = useCallback(
    () => ({
      title: "Booking status",
      subtitle: `${RANGE_COPY[range].period[0].toUpperCase()}${RANGE_COPY[range].period.slice(1)} · by booking date`,
      filename: `tourtrip-booking-status-${range.toLowerCase()}`,
      summary: [["Total bookings", data.total, "count"], ...data.items.map((item) => [item.status, item.count, "count"])],
      tables: [
        {
          name: "Status breakdown",
          columns: [
            { header: "Status", key: "status", width: 14 },
            { header: "Bookings", key: "count", format: "count" },
            { header: "Share", key: "share", format: "percent" },
            { header: "Booking value", key: "value", format: "usd" },
          ],
          rows: data.items,
        },
        {
          name: "Status over time",
          columns: [
            { header: "Period", key: "title", width: 18 },
            ...Object.keys(STATUS_TONE).map((statusName) => ({ header: statusName, key: statusName, format: "count" })),
          ],
          rows: data.timeline,
        },
      ],
    }),
    [data, range],
  );
  useRegisterExport(buildExport, status === "ready");

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {status === "loading"
          ? [0, 1, 2, 3].map((key) => <Skeleton key={key} className="h-[118px] rounded-card" />)
          : (data?.items ?? []).map((item) => {
              const tone = STATUS_TONE[item.status];
              return (
                <article
                  key={item.status}
                  className={cn("rounded-card border border-border bg-surface p-5 shadow-soft transition-colors duration-200", tone.ring)}
                  aria-label={`${item.status}: ${item.count} bookings, ${item.share.toFixed(1)} percent`}
                >
                  <p className="flex items-center gap-2 text-sm font-medium text-muted">
                    <span className={cn("size-2.5 rounded-full", tone.dot)} aria-hidden="true" /> {item.status}
                  </p>
                  <p className="mt-2 flex items-baseline gap-2">
                    <span className="font-display text-[28px] font-semibold leading-none tracking-[-0.03em] text-foreground">
                      <AnimatedNumber value={status === "ready" ? item.count : 0} />
                    </span>
                    <span className="text-sm font-semibold tabular-nums text-muted">{item.share.toFixed(1)}%</span>
                  </p>
                  <p className="mt-2 text-xs text-muted">{formatUsd(item.value)} booking value</p>
                </article>
              );
            })}
      </div>

      <WidgetCard
        id="status-trend"
        eyebrow="Booking status report"
        title="Status mix over time"
        description={`Bookings per ${range === "12M" ? "month" : range === "90D" ? "week" : "day"}, by booking date`}
        headerExtra={
          <ul className="hidden items-center gap-3 text-xs text-muted sm:flex" aria-label="Legend">
            {Object.entries(STATUS_TONE).map(([statusName, tone]) => (
              <li key={statusName} className="flex items-center gap-1.5">
                <span className={cn("size-2.5 rounded-sm", tone.dot)} aria-hidden="true" /> {statusName}
              </li>
            ))}
          </ul>
        }
        status={status}
        onRetry={() => query.refetch()}
        skeleton={<Skeleton className="h-[320px] w-full rounded-card" />}
        empty={<WidgetEmpty title="No bookings in this range" />}
      >
        <ReportChart type="bar" data={chartData} options={options} label={`Stacked bookings by status over the ${RANGE_COPY[range].period}.`} />
      </WidgetCard>
    </div>
  );
}
