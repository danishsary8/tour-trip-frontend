import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { DashboardHeader } from "../../../features/dashboard/components/DashboardHeader";
import { AttentionActivity } from "../../../features/dashboard/components/AttentionActivity";
import { BookingsTimeline } from "../../../features/dashboard/components/BookingsTimeline";
import { KpiGrid } from "../../../features/dashboard/components/KpiGrid";
import { PaymentMethods } from "../../../features/dashboard/components/PaymentMethods";
import { PopularTours } from "../../../features/dashboard/components/PopularTours";
import { RecentBookings } from "../../../features/dashboard/components/RecentBookings";
import { UpcomingDepartures } from "../../../features/dashboard/components/UpcomingDepartures";
import { RevenueChart } from "../../../features/dashboard/components/RevenueChart";
import { StatusDoughnut } from "../../../features/dashboard/components/StatusDoughnut";
import { useSummary } from "../../../features/dashboard/hooks";
import { DEFAULT_RANGE, isRange } from "../../../features/dashboard/ranges";
import { FORCEABLE_STATES, ForcedStateContext } from "../../../features/dashboard/widgetState";
import { useShellSummary } from "../../../features/notifications/hooks";
import { stagger, useMotionPreset } from "../../../lib/motion";

/** Admin overview. All figures come from deterministic mocks until the Laravel API exists. */
export default function DashboardPage() {
  const [params, setParams] = useSearchParams();
  const range = isRange(params.get("range")) ? params.get("range") : DEFAULT_RANGE;
  // `?state=loading|error|empty` previews widget states during development only.
  const forcedState = import.meta.env.DEV && FORCEABLE_STATES.includes(params.get("state")) ? params.get("state") : null;
  const { data: shell } = useShellSummary();
  const summary = useSummary(range);
  const container = useMotionPreset(stagger);

  function setRange(next) {
    setParams(
      (current) => {
        const updated = new URLSearchParams(current);
        updated.set("range", next);
        return updated;
      },
      { replace: true },
    );
  }

  return (
    <ForcedStateContext.Provider value={forcedState}>
      <div className="mx-auto min-w-0 max-w-[1600px] space-y-5 pb-10 sm:space-y-6">
        <DashboardHeader name={shell?.profile?.name} range={range} onRangeChange={setRange} updating={summary.isPlaceholderData} />
        <KpiGrid range={range} />

        {/* Bento grid: 12 columns on xl, 2 on md, 1 on mobile; `dense` backfills gaps. */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="grid grid-flow-row-dense grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12 xl:gap-5"
        >
          <RevenueChart range={range} className="md:col-span-2 xl:col-span-8" />
          <StatusDoughnut range={range} className="xl:col-span-4" />
          <RecentBookings className="md:col-span-2 xl:col-span-7" />
          <PopularTours range={range} className="xl:col-span-5" />
          <UpcomingDepartures className="xl:col-span-5" />
          <PaymentMethods range={range} className="xl:col-span-3" />
          <AttentionActivity className="md:col-span-2 xl:col-span-4 xl:row-span-2" />
          <BookingsTimeline range={range} className="md:col-span-2 xl:col-span-8" />
        </motion.div>
      </div>
    </ForcedStateContext.Provider>
  );
}
