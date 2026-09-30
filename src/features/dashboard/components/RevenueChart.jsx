import { useEffect, useMemo, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { Line } from "react-chartjs-2";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Skeleton } from "../../../components/shared/Skeleton";
import { AnimatedNumber } from "../../../components/ui/AnimatedNumber";
import { SegmentedControl } from "../../../components/ui/SegmentedControl";
import { chartAnimation, crosshairPlugin, gradientFill, playReveal, revealPlugin, tooltipPreset, useChartTheme, withAlpha } from "../../../lib/chart";
import { cn } from "../../../lib/cn";
import { formatCount, formatPercent, formatUsd, formatUsdCompact } from "../../../lib/format";
import { useRevenueSeries } from "../hooks";
import { RANGE_COPY } from "../ranges";
import { useWidgetStatus } from "../widgetState";
import { WidgetCard, WidgetEmpty } from "./WidgetCard";

const METRICS = [
  { value: "income", label: "Income" },
  { value: "bookings", label: "Bookings" },
];

const plugins = [crosshairPlugin, revealPlugin];
const TICK_LIMITS = { "7D": 7, "30D": 8, "90D": 7, "12M": 12 };

function RevenueSkeleton() {
  return (
    <div aria-hidden="true">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="mt-2 h-4 w-56" />
      <Skeleton className="mt-6 h-[260px] w-full rounded-card sm:h-[300px]" />
    </div>
  );
}

/**
 * Income or bookings for the selected range against the previous period (dashed).
 * The same Chart.js instance updates in place, so points morph between ranges and metrics.
 */
export function RevenueChart({ range, className }) {
  const query = useRevenueSeries(range);
  const status = useWidgetStatus(query, (data) => data.points.every((point) => !point.income && !point.bookings));
  const [metric, setMetric] = useState("income");
  const theme = useChartTheme();
  const reduceMotion = useReducedMotion();
  const cardRef = useRef(null);
  const chartRef = useRef(null);
  const inView = useInView(cardRef, { once: true, amount: 0.3 });

  const isIncome = metric === "income";
  const points = useMemo(() => query.data?.points ?? [], [query.data]);
  const totals = query.data?.totals;
  const current = totals ? (isIncome ? totals.income : totals.bookings) : 0;
  const previous = totals ? (isIncome ? totals.previousIncome : totals.previousBookings) : 0;
  const delta = previous ? ((current - previous) / previous) * 100 : null;
  const format = isIncome ? formatUsd : formatCount;

  useEffect(() => {
    if (inView && chartRef.current && !reduceMotion) playReveal(chartRef.current, 1100);
  }, [inView, reduceMotion, status]);

  const data = useMemo(
    () => ({
      labels: points.map((point) => point.label),
      datasets: [
        {
          label: "current",
          data: points.map((point) => (isIncome ? point.trendIncome ?? point.income : point.bookings)),
          borderColor: theme.primary,
          backgroundColor: gradientFill(theme.primary, theme.dark ? 0.34 : 0.24, 0),
          fill: true,
          tension: 0.38,
          borderWidth: 2.5,
          pointRadius: 0,
          pointHitRadius: 12,
          pointHoverRadius: 5,
          pointHoverBorderWidth: 2,
          pointHoverBackgroundColor: theme.primary,
          pointHoverBorderColor: theme.surface,
        },
        {
          label: "previous",
          data: points.map((point) => (isIncome ? point.previousTrendIncome ?? point.previousIncome : point.previousBookings)),
          borderColor: withAlpha(theme.muted, 0.75),
          borderDash: [5, 5],
          borderWidth: 1.5,
          fill: false,
          tension: 0.38,
          pointRadius: 0,
          pointHitRadius: 12,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: theme.muted,
          pointHoverBorderColor: theme.surface,
          pointHoverBorderWidth: 2,
        },
      ],
    }),
    [points, isIncome, theme],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: chartAnimation(reduceMotion, { duration: 800 }),
      interaction: { mode: "index", intersect: false },
      layout: { padding: { top: 8 } },
      plugins: {
        legend: { display: false },
        crosshair: { color: withAlpha(theme.muted, 0.55) },
        tooltip: tooltipPreset(theme, {
          callbacks: {
            title: (items) => points[items[0]?.dataIndex]?.title ?? "",
            label: (context) => ` ${context.datasetIndex === 0 ? "This period" : "Previous period"}: ${format(context.parsed.y)}`,
            labelColor: (context) => {
              const color = context.datasetIndex === 0 ? theme.primary : theme.muted;
              return { borderColor: color, backgroundColor: color, borderWidth: 0, borderRadius: 4 };
            },
          },
        }),
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: { color: theme.muted, font: { size: 11 }, maxRotation: 0, autoSkip: true, maxTicksLimit: TICK_LIMITS[range] },
        },
        y: {
          beginAtZero: true,
          grace: "6%",
          border: { display: false },
          grid: { color: theme.grid, drawTicks: false },
          ticks: {
            color: theme.muted,
            font: { size: 11 },
            padding: 10,
            maxTicksLimit: 5,
            precision: 0,
            callback: (value) => (isIncome ? formatUsdCompact(value) : formatCount(value)),
          },
        },
      },
    }),
    [reduceMotion, theme, points, format, range, isIncome],
  );

  const positive = typeof delta === "number" && delta >= 0;
  const DeltaIcon = positive ? ArrowUpRight : ArrowDownRight;

  return (
    <WidgetCard
      ref={cardRef}
      id="revenue"
      eyebrow="Income report"
      title={isIncome ? "Income" : "Bookings"}
      description={isIncome && (range === "7D" || range === "30D") ? "Smoothed daily trend compared with the period before" : `${RANGE_COPY[range].period[0].toUpperCase()}${RANGE_COPY[range].period.slice(1)} compared with the period before`}
      headerExtra={<SegmentedControl size="sm" label="Chart metric" options={METRICS} value={metric} onChange={setMetric} />}
      status={status}
      onRetry={() => query.refetch()}
      skeleton={<RevenueSkeleton />}
      empty={<WidgetEmpty title="No income yet" description="Payments will appear here as travellers book and pay." />}
      className={className}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-display text-[28px] font-semibold leading-none tracking-[-0.03em] text-foreground">
            <AnimatedNumber value={current} format={(value) => format(Math.round(value))} />
          </p>
          <p className="mt-2 flex items-center gap-2 text-xs text-muted">
            {typeof delta === "number" && (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-semibold tabular-nums",
                  positive ? "bg-success/12 text-success-ink" : "bg-danger/12 text-danger-ink",
                )}
              >
                <DeltaIcon className="size-3.5" aria-hidden="true" />
                {formatPercent(delta, { signed: false })}
              </span>
            )}
            {RANGE_COPY[range].previous}
          </p>
        </div>
        <ul className="flex items-center gap-4 text-xs text-muted" aria-label="Legend">
          <li className="flex items-center gap-2">
            <span className="h-0.5 w-5 rounded-full bg-primary" aria-hidden="true" /> This period
          </li>
          <li className="flex items-center gap-2">
            <span className="w-5 border-t-2 border-dashed border-muted/70" aria-hidden="true" /> Previous period
          </li>
        </ul>
      </div>

      <div
        className="relative mt-5 h-[260px] w-full sm:h-[300px]"
        role="img"
        aria-label={`${isIncome ? "Income" : "Bookings"} for the ${RANGE_COPY[range].period}: ${format(current)}, previous period ${format(previous)}.`}
      >
        {inView && <Line ref={chartRef} data={data} options={options} plugins={plugins} />}
      </div>
    </WidgetCard>
  );
}
