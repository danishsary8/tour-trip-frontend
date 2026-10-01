import { useCallback, useMemo } from "react";
import { useReducedMotion } from "framer-motion";
import { DataTable } from "../../../components/shared/DataTable";
import { Skeleton } from "../../../components/shared/Skeleton";
import { chartAnimation, tooltipPreset, useChartTheme, withAlpha } from "../../../lib/chart";
import { formatCount, formatUsd, formatUsdCompact } from "../../../lib/format";
import { RANGE_COPY } from "../../dashboard/ranges";
import { WidgetCard, WidgetEmpty } from "../../dashboard/components/WidgetCard";
import { useWidgetStatus } from "../../dashboard/widgetState";
import { useRegisterExport } from "../exportContext";
import { useDestinationReport } from "../hooks";
import { ReportChart } from "./ReportChart";

/** Destination report: revenue and bookings per destination, highest revenue first. */
export function DestinationReport({ range }) {
  const query = useDestinationReport(range);
  const status = useWidgetStatus(query, (data) => data.totals.bookings === 0 && data.totals.revenue === 0);
  const theme = useChartTheme();
  const reduceMotion = useReducedMotion();
  const rows = useMemo(() => (status === "ready" ? query.data.rows : []), [status, query.data]);

  const chartData = useMemo(
    () => ({
      labels: rows.map((row) => row.name),
      datasets: [
        {
          label: "Revenue",
          data: rows.map((row) => row.revenue),
          // Left-to-right terracotta → gold, matching the popular-tour share bars.
          backgroundColor: (context) => {
            const { chart } = context;
            if (!chart.chartArea) return theme.primary;
            const gradient = chart.ctx.createLinearGradient(chart.chartArea.left, 0, chart.chartArea.right, 0);
            gradient.addColorStop(0, withAlpha(theme.primary, 0.75));
            gradient.addColorStop(1, theme.accent);
            return gradient;
          },
          hoverBackgroundColor: theme.primary,
          borderRadius: 6,
          borderSkipped: false,
          maxBarThickness: 30,
        },
      ],
    }),
    [rows, theme],
  );

  const options = useMemo(
    () => ({
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      animation: chartAnimation(reduceMotion, { duration: 800 }),
      plugins: {
        legend: { display: false },
        tooltip: tooltipPreset(theme, {
          callbacks: {
            label: (context) => ` Revenue: ${formatUsd(context.parsed.x)}`,
            afterLabel: (context) => {
              const row = rows[context.dataIndex];
              return row ? ` ${formatCount(row.bookings)} bookings · ${row.tours} ${row.tours === 1 ? "tour" : "tours"}` : "";
            },
          },
        }),
      },
      scales: {
        x: { beginAtZero: true, border: { display: false }, grid: { color: theme.grid, drawTicks: false }, ticks: { color: theme.muted, font: { size: 11 }, padding: 6, maxTicksLimit: 6, callback: (value) => formatUsdCompact(value) } },
        y: { grid: { display: false }, border: { display: false }, ticks: { color: theme.foreground, font: { size: 12, weight: "600" } } },
      },
    }),
    [reduceMotion, theme, rows],
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Destination",
        cell: ({ row }) => (
          <span className="min-w-0">
            <span className="block font-semibold">{row.original.name}</span>
            <span className="block text-xs text-muted">{row.original.country && row.original.country !== "Cambodia" ? `${row.original.province}, ${row.original.country}` : `${row.original.province} province`}</span>
          </span>
        ),
      },
      { accessorKey: "tours", header: "Tours", enableGlobalFilter: false, cell: ({ getValue }) => <span className="tabular-nums">{getValue() || <span className="text-muted">None yet</span>}</span> },
      { accessorKey: "bookings", header: "Bookings", enableGlobalFilter: false, cell: ({ getValue }) => <span className="font-semibold tabular-nums">{formatCount(getValue())}</span> },
      { accessorKey: "travellers", header: "Travellers", enableGlobalFilter: false, cell: ({ getValue }) => <span className="tabular-nums">{formatCount(getValue())}</span> },
      { accessorKey: "revenue", header: "Revenue", enableGlobalFilter: false, cell: ({ getValue }) => <span className="font-semibold tabular-nums">{formatUsd(getValue())}</span> },
      { accessorKey: "share", header: "% of revenue", enableGlobalFilter: false, cell: ({ getValue }) => <span className="tabular-nums">{getValue().toFixed(1)}%</span> },
    ],
    [],
  );

  const buildExport = useCallback(
    () => ({
      title: "Destination report",
      subtitle: `${RANGE_COPY[range].period[0].toUpperCase()}${RANGE_COPY[range].period.slice(1)} · bookings made, revenue received (USD)`,
      filename: `tourtrip-destinations-${range.toLowerCase()}`,
      summary: [
        ["Revenue", query.data.totals.revenue, "usd"],
        ["Bookings", query.data.totals.bookings, "count"],
        ["Top destination", query.data.rows[0]?.name ?? "-", "text"],
        ["Destinations with bookings", query.data.rows.filter((row) => row.bookings > 0).length, "count"],
      ],
      tables: [
        {
          name: "Destinations",
          columns: [
            { header: "Destination", key: "name", width: 16 },
            { header: "Province", key: "province", width: 16 },
            { header: "Tours", key: "tours", format: "count" },
            { header: "Bookings", key: "bookings", format: "count" },
            { header: "Travellers", key: "travellers", format: "count" },
            { header: "Revenue", key: "revenue", format: "usd" },
            { header: "% of revenue", key: "share", format: "percent" },
          ],
          rows: query.data.rows,
        },
      ],
    }),
    [query.data, range],
  );
  useRegisterExport(buildExport, status === "ready");

  return (
    <div className="space-y-5">
      <WidgetCard
        id="destination-chart"
        eyebrow="Destination report"
        title="Revenue by destination"
        description={`Money received in the ${RANGE_COPY[range].period}, highest first`}
        status={status}
        onRetry={() => query.refetch()}
        skeleton={<Skeleton className="h-[300px] w-full rounded-card" />}
        empty={<WidgetEmpty title="No destination activity in this range" />}
      >
        <ReportChart
          type="bar"
          data={chartData}
          options={options}
          className="h-[300px]"
          label={`Revenue by destination: ${rows.map((row) => `${row.name} ${formatUsd(row.revenue)}`).join(", ")}.`}
        />
      </WidgetCard>

      <DataTable
        rows={rows}
        columns={columns}
        caption="Destinations"
        loading={status === "loading"}
        error={status === "error"}
        onRetry={() => query.refetch()}
        searchPlaceholder="Search destinations"
        selectable={false}
        dense
        cardsBelow="lg"
        initialSorting={[{ id: "revenue", desc: true }]}
        emptyTitle="No destinations match"
      />
    </div>
  );
}
