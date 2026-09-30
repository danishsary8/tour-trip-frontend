import { useCallback, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { DataTable } from "../../../components/shared/DataTable";
import { Skeleton } from "../../../components/shared/Skeleton";
import { StatusBadge } from "../../../components/shared/StatusBadge";
import { AnimatedNumber } from "../../../components/ui/AnimatedNumber";
import { PAYMENT_METHODS, PAYMENT_STATUSES } from "../../../mocks/dashboard";
import { tooltipPreset, useChartTheme, withAlpha } from "../../../lib/chart";
import { cn } from "../../../lib/cn";
import { formatCount, formatDate, formatUsd } from "../../../lib/format";
import { BookingDrawer } from "../../bookings/components/BookingDrawer";
import { RANGE_COPY } from "../../dashboard/ranges";
import { WidgetCard, WidgetEmpty } from "../../dashboard/components/WidgetCard";
import { useWidgetStatus } from "../../dashboard/widgetState";
import { useRegisterExport } from "../exportContext";
import { usePaymentReport } from "../hooks";
import { ReportChart } from "./ReportChart";

// Same method colours as the dashboard's payment widget.
const METHOD_COLOR = {
  Cash: "success",
  "Bank Transfer": "info",
  "ABA Pay (Simulation)": "primary",
  "Credit Card (Simulation)": "accent",
};
const STATUS_DOT = { Paid: "bg-success", Unpaid: "bg-accent", Refunded: "bg-info" };

/** Payment report: money received per method, payment status mix and every transaction. */
export function PaymentReport({ range }) {
  const query = usePaymentReport(range);
  const status = useWidgetStatus(query, (data) => data.totals.bookings === 0 && data.totals.received === 0);
  const theme = useChartTheme();
  const reduceMotion = useReducedMotion();
  const [openId, setOpenId] = useState(null);
  const data = status === "ready" ? query.data : null;
  const methods = useMemo(() => data?.methods ?? [], [data]);
  const transactions = useMemo(() => data?.transactions ?? [], [data]);

  const chartData = useMemo(
    () => ({
      labels: methods.map((item) => item.method),
      datasets: [
        {
          data: methods.map((item) => item.amount),
          backgroundColor: methods.map((item) => withAlpha(theme[METHOD_COLOR[item.method]], 0.72)),
          hoverBackgroundColor: methods.map((item) => theme[METHOD_COLOR[item.method]]),
          borderColor: theme.surface,
          borderWidth: 2,
        },
      ],
    }),
    [methods, theme],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: reduceMotion ? false : { animateRotate: true, animateScale: true, duration: 900, easing: "easeOutQuart" },
      scales: { r: { ticks: { display: false }, grid: { color: theme.grid }, angleLines: { display: false }, pointLabels: { display: false } } },
      plugins: {
        legend: { display: false },
        tooltip: tooltipPreset(theme, { callbacks: { label: (context) => ` ${context.label}: ${formatUsd(context.parsed.r)}` } }),
      },
    }),
    [reduceMotion, theme],
  );

  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "Booking", cell: ({ getValue }) => <span className="whitespace-nowrap font-semibold tabular-nums text-primary-ink">{getValue()}</span> },
      { accessorKey: "customerName", header: "Customer", cell: ({ getValue }) => <span className="block max-w-[160px] truncate font-medium">{getValue()}</span> },
      {
        accessorKey: "tourPackage",
        header: "Tour",
        enableGlobalFilter: false,
        meta: { className: "hidden 2xl:table-cell" },
        cell: ({ getValue }) => <span className="block max-w-[180px] truncate">{getValue()}</span>,
      },
      { accessorKey: "bookingDate", header: "Booked", enableGlobalFilter: false, cell: ({ getValue }) => <span className="whitespace-nowrap text-muted">{formatDate(getValue())}</span> },
      { accessorKey: "paymentMethod", header: "Method", enableGlobalFilter: false, filterFn: "equalsString", cell: ({ getValue }) => <span className="whitespace-nowrap text-muted">{getValue()}</span> },
      { accessorKey: "paymentStatus", header: "Payment", enableGlobalFilter: false, enableSorting: false, filterFn: "equalsString", cell: ({ getValue }) => <StatusBadge status={getValue()} /> },
      { accessorKey: "status", header: "Booking", enableGlobalFilter: false, enableSorting: false, filterFn: "equalsString", meta: { className: "hidden xl:table-cell" }, cell: ({ getValue }) => <StatusBadge status={getValue()} /> },
      { accessorKey: "amount", header: "Amount", enableGlobalFilter: false, cell: ({ getValue }) => <span className="font-semibold tabular-nums">{formatUsd(getValue())}</span> },
    ],
    [],
  );

  const buildExport = useCallback(
    () => ({
      title: "Payment report",
      subtitle: `${RANGE_COPY[range].period[0].toUpperCase()}${RANGE_COPY[range].period.slice(1)} · USD`,
      filename: `tourtrip-payments-${range.toLowerCase()}`,
      summary: [
        ["Money received", query.data.totals.received, "usd"],
        ["Bookings made", query.data.totals.bookings, "count"],
        ...query.data.statuses.map((item) => [`${item.status} bookings`, item.count, "count"]),
      ],
      tables: [
        {
          name: "By payment method",
          columns: [
            { header: "Method", key: "method", width: 24 },
            { header: "Payments", key: "count", format: "count" },
            { header: "Amount received", key: "amount", format: "usd" },
            { header: "Share", key: "share", format: "percent" },
          ],
          rows: query.data.methods,
        },
        {
          name: "By payment status",
          columns: [
            { header: "Status", key: "status", width: 12 },
            { header: "Bookings", key: "count", format: "count" },
            { header: "Booking value", key: "amount", format: "usd" },
            { header: "Share", key: "share", format: "percent" },
          ],
          rows: query.data.statuses,
        },
        {
          name: "Transactions",
          columns: [
            { header: "Booking", key: "id", width: 10 },
            { header: "Customer", key: "customerName", width: 20 },
            { header: "Tour", key: "tourPackage", width: 24 },
            { header: "Booked", key: "bookingDate", format: "date", width: 13 },
            { header: "Paid", key: "paidDate", format: "date", width: 13 },
            { header: "Method", key: "paymentMethod", width: 22 },
            { header: "Payment", key: "paymentStatus", width: 10 },
            { header: "Booking status", key: "status", width: 12 },
            { header: "Amount", key: "amount", format: "usd" },
          ],
          rows: query.data.transactions,
        },
      ],
    }),
    [query.data, range],
  );
  useRegisterExport(buildExport, status === "ready");

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <WidgetCard
          id="payment-methods"
          eyebrow="Payment report"
          title="Money received by method"
          description={`Payments received in the ${RANGE_COPY[range].period}`}
          status={status}
          onRetry={() => query.refetch()}
          skeleton={<Skeleton className="h-[280px] w-full rounded-card" />}
          empty={<WidgetEmpty title="No payments in this range" />}
        >
          <div className="grid items-center gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <ReportChart
              type="polarArea"
              data={chartData}
              options={options}
              className="mx-auto aspect-square h-auto w-full max-w-[240px]"
              label={`Money received by method: ${methods.map((item) => `${item.method} ${formatUsd(item.amount)}`).join(", ")}.`}
            />
            <ul className="space-y-3 text-sm">
              {methods.map((item) => (
                <li key={item.method} className="flex items-start gap-2.5">
                  <span className="mt-1.5 size-2.5 shrink-0 rounded-sm" style={{ backgroundColor: theme[METHOD_COLOR[item.method]] }} aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-foreground">{item.method}</span>
                    <span className="block text-xs text-muted">
                      {formatCount(item.count)} payments · {item.share.toFixed(1)}%
                    </span>
                  </span>
                  <span className="font-semibold tabular-nums text-foreground">{formatUsd(item.amount)}</span>
                </li>
              ))}
              <li className="flex items-baseline justify-between border-t border-border pt-3 font-semibold">
                <span>Total received</span>
                <span className="font-display text-lg tabular-nums">{formatUsd(data?.totals.received ?? 0)}</span>
              </li>
            </ul>
          </div>
        </WidgetCard>

        <WidgetCard
          id="payment-status"
          eyebrow="Payment status"
          title="Bookings by payment status"
          description={`Bookings made in the ${RANGE_COPY[range].period}`}
          status={status}
          onRetry={() => query.refetch()}
          skeleton={<Skeleton className="h-[280px] w-full rounded-card" />}
          empty={<WidgetEmpty title="No bookings in this range" />}
        >
          <ul className="space-y-3">
            {(data?.statuses ?? PAYMENT_STATUSES.map((item) => ({ status: item, count: 0, amount: 0, share: 0 }))).map((item) => (
              <li key={item.status} className="rounded-card border border-border bg-surface-2/35 p-4 transition-colors duration-200 hover:border-foreground/15">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-sm font-medium text-muted">
                    <span className={cn("size-2.5 rounded-full", STATUS_DOT[item.status])} aria-hidden="true" /> {item.status}
                  </span>
                  <span className="text-xs font-semibold tabular-nums text-muted">{item.share.toFixed(1)}%</span>
                </div>
                <div className="mt-1.5 flex items-baseline justify-between gap-3">
                  <span className="font-display text-2xl font-semibold text-foreground">
                    <AnimatedNumber value={item.count} />
                  </span>
                  <span className="text-sm font-semibold tabular-nums text-foreground">{formatUsd(item.amount)}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-foreground/[0.07]" aria-hidden="true">
                  <div className={cn("h-full origin-left rounded-full transition-transform duration-700", STATUS_DOT[item.status])} style={{ transform: `scaleX(${item.share / 100})` }} />
                </div>
              </li>
            ))}
          </ul>
        </WidgetCard>
      </div>

      <div className="space-y-3">
        <h2 className="font-display text-lg font-semibold tracking-[-0.02em] text-foreground">Transactions</h2>
        <DataTable
          rows={transactions}
          columns={columns}
          caption="Payment transactions"
          loading={status === "loading"}
          error={status === "error"}
          onRetry={() => query.refetch()}
          searchPlaceholder="Search customer or booking ID"
          filters={[
            { columnId: "paymentMethod", label: "Methods", options: PAYMENT_METHODS },
            { columnId: "paymentStatus", label: "Payments", options: PAYMENT_STATUSES },
            { columnId: "status", label: "Statuses", options: ["Pending", "Confirmed", "Completed", "Cancelled"] },
          ]}
          onRowClick={(row) => setOpenId(row.id)}
          rowLabel={(row) => `booking ${row.id} for ${row.customerName}`}
          selectable={false}
          dense
          cardsBelow="lg"
          pageSize={10}
          emptyTitle="No transactions match"
          emptyDescription="Try another method, status or search."
        />
      </div>

      <BookingDrawer bookingId={openId} open={Boolean(openId)} onClose={() => setOpenId(null)} />
    </div>
  );
}
