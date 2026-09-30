import { motion } from "framer-motion";
import { CalendarCheck2, CircleDollarSign, Compass, UsersRound } from "lucide-react";
import { formatCount, formatUsd } from "../../../lib/format";
import { stagger, useMotionPreset } from "../../../lib/motion";
import { useChartTheme } from "../../../lib/chart";
import { useSummary } from "../hooks";
import { RANGE_COPY } from "../ranges";
import { useWidgetStatus } from "../widgetState";
import { KpiCard, KpiCardSkeleton } from "./KpiCard";
import { WidgetError } from "./WidgetCard";

const KPIS = [
  { key: "tours", label: "Total Tours", icon: Compass, tone: "primary", color: "primary", format: formatCount, to: "/admin/masters", link: "View tours" },
  { key: "bookings", label: "Total Bookings", icon: CalendarCheck2, tone: "accent", color: "accent", format: formatCount, to: "/admin/bookings", link: "View bookings" },
  { key: "customers", label: "Total Customers", icon: UsersRound, tone: "info", color: "info", format: formatCount, to: "/admin/customers", link: "View customers" },
  { key: "income", label: "Total Income", icon: CircleDollarSign, tone: "success", color: "success", format: formatUsd, to: "/admin/reports", link: "Open reports" },
];

/** Overview KPIs: Total Tours (departures run), Bookings, Customers (registered) and Income (paid, USD). */
export function KpiGrid({ range }) {
  const query = useSummary(range);
  const status = useWidgetStatus(query);
  const theme = useChartTheme();
  const container = useMotionPreset(stagger);

  if (status === "error") {
    return <WidgetError onRetry={() => query.refetch()} message="Key figures could not be loaded." />;
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5"
      aria-label="Key figures"
      role="list"
    >
      {KPIS.map((kpi) => (
        <div role="listitem" key={kpi.key} className="min-w-0">
          {status === "loading" || status === "empty" || !query.data ? (
            <KpiCardSkeleton />
          ) : (
            <KpiCard
              label={kpi.label}
              metric={query.data[kpi.key]}
              format={kpi.format}
              icon={kpi.icon}
              tone={kpi.tone}
              sparkColor={theme[kpi.color]}
              to={kpi.to}
              linkLabel={kpi.link}
              comparison={RANGE_COPY[range].previous}
            />
          )}
        </div>
      ))}
    </motion.div>
  );
}
