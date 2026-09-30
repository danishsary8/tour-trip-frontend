import { useMemo, useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { Bar } from "react-chartjs-2";
import { Skeleton } from "../../../components/shared/Skeleton";
import { tooltipPreset, useChartTheme, withAlpha } from "../../../lib/chart";
import { formatCount } from "../../../lib/format";
import { useBookingsTimeline } from "../hooks";
import { RANGE_COPY } from "../ranges";
import { useWidgetStatus } from "../widgetState";
import { WidgetCard, WidgetEmpty } from "./WidgetCard";

const SERIES = [
  { key: "confirmed", label: "Confirmed & completed", color: "success" },
  { key: "pending", label: "Pending", color: "accent" },
  { key: "cancelled", label: "Cancelled", color: "danger" },
];
const TICK_LIMITS = { "7D": 7, "30D": 10, "90D": 13, "12M": 12 };

/** Dims every bar except the hovered column. Stored on the chart so no React render is needed. */
const dimOthers = (color) => (context) => {
  const hovered = context.chart.$hoverIndex;
  return hovered === undefined || hovered === context.dataIndex ? color : withAlpha(color, 0.25);
};

/** Booking status report over time: stacked bars that grow from the baseline. */
export function BookingsTimeline({ range, className }) {
  const query = useBookingsTimeline(range);
  const status = useWidgetStatus(query, (data) => data.points.every((point) => !point.confirmed && !point.pending && !point.cancelled));
  const theme = useChartTheme();
  const reduceMotion = useReducedMotion();
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, amount: 0.3 });
  const points = useMemo(() => query.data?.points ?? [], [query.data]);

  const data = useMemo(
    () => ({
      labels: points.map((point) => point.label),
      datasets: SERIES.map((series, index) => ({
        label: series.label,
        data: points.map((point) => point[series.key]),
        backgroundColor: dimOthers(theme[series.color]),
        hoverBackgroundColor: theme[series.color],
        borderRadius: index === SERIES.length - 1 ? { topLeft: 6, topRight: 6 } : 2,
        borderSkipped: false,
        maxBarThickness: 28,
        categoryPercentage: 0.72,
        barPercentage: 0.9,
      })),
    }),
    [points, theme],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: reduceMotion
        ? false
        : {
            duration: 700,
            easing: "easeOutQuart",
            delay: (context) => (context.type === "data" && context.mode === "default" ? context.dataIndex * 35 + context.datasetIndex * 60 : 0),
          },
      interaction: { mode: "index", intersect: false },
      onHover: (_event, elements, chart) => {
        const index = elements[0]?.index;
        if (chart.$hoverIndex === index) return;
        chart.$hoverIndex = index;
        chart.update("none");
      },
      plugins: {
        legend: { display: false },
        tooltip: tooltipPreset(theme, {
          callbacks: {
            title: (items) => points[items[0]?.dataIndex]?.title ?? "",
            label: (context) => ` ${context.dataset.label}: ${formatCount(context.parsed.y)}`,
            labelColor: (context) => {
              const color = theme[SERIES[context.datasetIndex].color];
              return { borderColor: color, backgroundColor: color, borderWidth: 0, borderRadius: 3 };
            },
          },
        }),
      },
      scales: {
        x: {
          stacked: true,
          grid: { display: false },
          border: { display: false },
          ticks: { color: theme.muted, font: { size: 11 }, maxRotation: 0, autoSkip: true, maxTicksLimit: TICK_LIMITS[range] },
        },
        y: {
          stacked: true,
          beginAtZero: true,
          border: { display: false },
          grid: { color: theme.grid, drawTicks: false },
          ticks: { color: theme.muted, font: { size: 11 }, padding: 8, precision: 0, maxTicksLimit: 5 },
        },
      },
    }),
    [reduceMotion, theme, points, range],
  );

  return (
    <WidgetCard
      ref={cardRef}
      id="timeline"
      eyebrow="Booking status report"
      title="Bookings over time"
      description={`By booking date, ${RANGE_COPY[range].period}`}
      headerExtra={
        <ul className="hidden items-center gap-3 text-xs text-muted sm:flex" aria-label="Legend">
          {SERIES.map((series) => (
            <li key={series.key} className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm" style={{ backgroundColor: theme[series.color] }} aria-hidden="true" />
              {series.label}
            </li>
          ))}
        </ul>
      }
      status={status}
      onRetry={() => query.refetch()}
      skeleton={<Skeleton className="h-[240px] w-full rounded-card" />}
      empty={<WidgetEmpty title="No bookings in this range" />}
      className={className}
    >
      <div
        className="relative h-[240px] w-full"
        role="img"
        aria-label={`Bookings over the ${RANGE_COPY[range].period}, stacked by confirmed, pending and cancelled.`}
      >
        {inView && <Bar data={data} options={options} />}
      </div>
    </WidgetCard>
  );
}
