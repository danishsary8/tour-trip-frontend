import { useMemo, useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { PolarArea } from "react-chartjs-2";
import { Wallet } from "lucide-react";
import { Skeleton } from "../../../components/shared/Skeleton";
import { tooltipPreset, useChartTheme, withAlpha } from "../../../lib/chart";
import { formatPercent, formatUsd } from "../../../lib/format";
import { usePaymentBreakdown } from "../hooks";
import { RANGE_COPY } from "../ranges";
import { useWidgetStatus } from "../widgetState";
import { WidgetCard, WidgetEmpty } from "./WidgetCard";

const METHOD_COLOR = {
  Cash: "success",
  "Bank Transfer": "info",
  "ABA Pay (Simulation)": "primary",
  "Credit Card (Simulation)": "accent",
};

function PaymentSkeleton() {
  return (
    <div aria-hidden="true">
      <Skeleton className="mx-auto size-40 rounded-full" />
      <div className="mt-5 space-y-2">
        {[0, 1, 2, 3].map((key) => (
          <Skeleton key={key} className="h-5 w-full" />
        ))}
      </div>
    </div>
  );
}

/** Payment report summary: income received per payment method. */
export function PaymentMethods({ range, className }) {
  const query = usePaymentBreakdown(range);
  const status = useWidgetStatus(query, (data) => data.total === 0);
  const theme = useChartTheme();
  const reduceMotion = useReducedMotion();
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, amount: 0.3 });
  const items = useMemo(() => query.data?.items ?? [], [query.data]);
  const total = query.data?.total ?? 0;

  const data = useMemo(
    () => ({
      labels: items.map((item) => item.method),
      datasets: [
        {
          data: items.map((item) => item.amount),
          backgroundColor: items.map((item) => withAlpha(theme[METHOD_COLOR[item.method]], 0.72)),
          hoverBackgroundColor: items.map((item) => theme[METHOD_COLOR[item.method]]),
          borderColor: theme.surface,
          borderWidth: 2,
        },
      ],
    }),
    [items, theme],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: reduceMotion ? false : { animateRotate: true, animateScale: true, duration: 900, easing: "easeOutQuart" },
      scales: {
        r: {
          ticks: { display: false },
          grid: { color: theme.grid },
          angleLines: { display: false },
          pointLabels: { display: false },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: tooltipPreset(theme, {
          callbacks: {
            label: (context) => ` ${context.label}: ${formatUsd(context.parsed.r)}`,
          },
        }),
      },
    }),
    [reduceMotion, theme],
  );

  return (
    <WidgetCard
      ref={cardRef}
      id="payments"
      eyebrow="Payment report"
      title="Payment methods"
      description={`Received, ${RANGE_COPY[range].period}`}
      status={status}
      onRetry={() => query.refetch()}
      skeleton={<PaymentSkeleton />}
      empty={<WidgetEmpty icon={Wallet} title="No payments received" />}
      className={className}
    >
      <div className="relative mx-auto aspect-square w-full max-w-[190px]" role="img" aria-label={`Payments by method: ${items.map((item) => `${item.method} ${formatUsd(item.amount)}`).join(", ")}.`}>
        {inView && <PolarArea data={data} options={options} />}
      </div>
      <ul className="mt-5 space-y-2.5 text-xs">
        {items.map((item) => (
          <li key={item.method} className="flex items-start gap-2">
            <span className="mt-1 size-2.5 shrink-0 rounded-sm" style={{ backgroundColor: theme[METHOD_COLOR[item.method]] }} aria-hidden="true" />
            <span className="min-w-0 flex-1 leading-snug text-muted">{item.method}</span>
            <span className="font-semibold tabular-nums text-foreground">{formatUsd(item.amount)}</span>
            <span className="w-9 text-right tabular-nums text-muted">{formatPercent((item.amount / (total || 1)) * 100, { signed: false, digits: 0 })}</span>
          </li>
        ))}
      </ul>
    </WidgetCard>
  );
}
