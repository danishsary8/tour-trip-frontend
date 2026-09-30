import { useCallback, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { CalendarRange, CircleDollarSign, Crown, TrendingUp } from "lucide-react";
import { Skeleton } from "../../../components/shared/Skeleton";
import { StatCard } from "../../../components/shared/StatCard";
import { Switch } from "../../../components/ui/Switch";
import { chartAnimation, crosshairPlugin, tooltipPreset, useChartTheme, withAlpha } from "../../../lib/chart";
import { formatUsd, formatUsdCompact } from "../../../lib/format";
import { WidgetCard, WidgetEmpty } from "../../dashboard/components/WidgetCard";
import { useWidgetStatus } from "../../dashboard/widgetState";
import { useRegisterExport } from "../exportContext";
import { useIncomeReport } from "../hooks";
import { ReportChart } from "./ReportChart";

const plugins = [crosshairPlugin];

function IncomeSkeleton() {
  return (
    <div aria-hidden="true" className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((key) => (
          <Skeleton key={key} className="h-32 rounded-card" />
        ))}
      </div>
      <Skeleton className="h-[360px] rounded-card" />
    </div>
  );
}

/** Monthly income for the chosen year, optionally against the previous year. */
export function IncomeReport({ year }) {
  const query = useIncomeReport(year);
  const status = useWidgetStatus(query, (data) => data.summary.coveredMonths === 0);
  const theme = useChartTheme();
  const reduceMotion = useReducedMotion();
  const [compare, setCompare] = useState(true);
  const data = query.data;

  const chartData = useMemo(() => {
    const months = data?.months ?? [];
    return {
      labels: months.map((month) => month.label),
      datasets: [
        {
          type: "bar",
          label: String(year),
          data: months.map((month) => month.income),
          backgroundColor: months.map((month) => (month.partial ? withAlpha(theme.primary, 0.45) : theme.primary)),
          hoverBackgroundColor: theme.primary,
          borderRadius: 6,
          borderSkipped: false,
          maxBarThickness: 38,
          order: 2,
        },
        {
          type: "line",
          label: String(year - 1),
          data: months.map((month) => month.lastIncome),
          hidden: !compare,
          borderColor: withAlpha(theme.muted, 0.85),
          backgroundColor: theme.muted,
          borderDash: [5, 5],
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
          pointBackgroundColor: theme.surface,
          spanGaps: false,
          tension: 0.3,
          order: 1,
        },
      ],
    };
  }, [data, theme, year, compare]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: chartAnimation(reduceMotion, { duration: 800 }),
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: false },
        crosshair: { color: withAlpha(theme.muted, 0.5) },
        tooltip: tooltipPreset(theme, {
          callbacks: {
            title: (items) => data?.months[items[0]?.dataIndex]?.title ?? "",
            label: (context) => ` ${context.dataset.label}: ${context.parsed.y === null ? "no data" : formatUsd(context.parsed.y)}`,
            afterBody: (items) => (data?.months[items[0]?.dataIndex]?.partial ? "Partial month" : ""),
          },
        }),
      },
      scales: {
        x: { grid: { display: false }, border: { display: false }, ticks: { color: theme.muted, font: { size: 11 } } },
        y: {
          beginAtZero: true,
          border: { display: false },
          grid: { color: theme.grid, drawTicks: false },
          ticks: { color: theme.muted, font: { size: 11 }, padding: 8, maxTicksLimit: 6, callback: (value) => formatUsdCompact(value) },
        },
      },
    }),
    [reduceMotion, theme, data],
  );

  const buildExport = useCallback(
    () => ({
      title: `Monthly income ${year}`,
      subtitle: `January–December ${year} compared with ${year - 1} · income received, USD`,
      filename: `tourtrip-income-${year}`,
      summary: [
        ["Total income", data.summary.total, "usd"],
        ["Average per month", Math.round(data.summary.average), "usd"],
        ["Best month", data.summary.best ? `${data.summary.best.label} (${formatUsd(data.summary.best.income)})` : "-", "text"],
        [`Change vs ${year - 1} (same months)`, data.summary.yoy, "signedPercent"],
      ],
      tables: [
        {
          name: "Income by month",
          columns: [
            { header: "Month", key: "title", width: 12 },
            { header: `Income ${year}`, key: "income", format: "usd" },
            { header: `Bookings ${year}`, key: "bookings", format: "count" },
            { header: `Income ${year - 1}`, key: "lastIncome", format: "usd" },
            { header: `Bookings ${year - 1}`, key: "lastBookings", format: "count" },
          ],
          rows: data.months,
        },
      ],
    }),
    [data, year],
  );
  useRegisterExport(buildExport, status === "ready");

  if (status === "loading") return <IncomeSkeleton />;

  const summary = data?.summary;
  return (
    <div className="space-y-5">
      {status === "ready" && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label={`Total income ${year}`} value={formatUsd(summary.total)} icon={CircleDollarSign} />
          <StatCard label="Average per month" value={formatUsd(Math.round(summary.average))} icon={CalendarRange} />
          <StatCard label="Best month" value={summary.best ? summary.best.label : "—"} icon={Crown} />
          <StatCard
            label={`Change vs ${year - 1}`}
            value={summary.yoyAmount === null ? "—" : `${summary.yoyAmount >= 0 ? "+" : "−"}${formatUsd(Math.abs(summary.yoyAmount))}`}
            delta={summary.yoy === null ? undefined : Number(summary.yoy.toFixed(1))}
            deltaLabel={summary.yoy === null ? undefined : `over ${summary.comparableMonths} comparable months`}
            icon={TrendingUp}
          />
        </div>
      )}

      <WidgetCard
        id="income-report"
        eyebrow="Monthly income report"
        title={`Income by month, ${year}`}
        description="Money received each month (payment day), USD. Lighter bars are partial months."
        headerExtra={<Switch checked={compare} onCheckedChange={setCompare} label={`Compare ${year - 1}`} className="items-center" />}
        status={status}
        onRetry={() => query.refetch()}
        empty={<WidgetEmpty title={`No income recorded for ${year}`} description="The mock history starts in mid-2024." />}
      >
        <ul className="mb-4 flex flex-wrap items-center gap-4 text-xs text-muted" aria-label="Legend">
          <li className="flex items-center gap-2">
            <span className="size-2.5 rounded-sm bg-primary" aria-hidden="true" /> {year}
          </li>
          {compare && (
            <li className="flex items-center gap-2">
              <span className="w-5 border-t-2 border-dashed border-muted" aria-hidden="true" /> {year - 1}
            </li>
          )}
        </ul>
        <ReportChart
          type="bar"
          data={chartData}
          options={options}
          plugins={plugins}
          className="h-[300px] sm:h-[360px]"
          label={`Monthly income for ${year}${compare ? ` compared with ${year - 1}` : ""}. Total ${formatUsd(summary?.total ?? 0)}.`}
        />
      </WidgetCard>
    </div>
  );
}
