import { AnimatePresence, motion } from "framer-motion";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../../../components/shared/PageHeader";
import { Button } from "../../../components/ui/Button";
import { SegmentedControl } from "../../../components/ui/SegmentedControl";
import { Spinner } from "../../../components/ui/Spinner";
import { RANGE_OPTIONS } from "../ranges";

function greeting(hour = new Date().getHours()) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

const todayLabel = () =>
  new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(new Date());

export function DashboardHeader({ name = "Admin", range, onRangeChange, updating = false }) {
  return (
    <PageHeader
      eyebrow={todayLabel()}
      title={`${greeting()}, ${name}`}
      description="Tours, bookings, travellers and income across Cambodia, at a glance."
      actions={
        <>
          <AnimatePresence>
            {updating && (
              <motion.span
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="mr-1 hidden items-center gap-1.5 text-xs text-muted sm:inline-flex"
                aria-live="polite"
              >
                <Spinner className="size-3.5" label="Updating dashboard" /> Updating
              </motion.span>
            )}
          </AnimatePresence>
          <SegmentedControl label="Date range" options={RANGE_OPTIONS} value={range} onChange={onRangeChange} />
          <Button
            variant="outline"
            size="sm"
            className="h-10 bg-transparent hover:border-foreground/20 hover:bg-foreground/[0.06]"
            onClick={() => toast("Report export coming in Reports page", { description: "Excel and PDF exports will live under Reports." })}
          >
            <Download className="size-4" aria-hidden="true" /> Export
          </Button>
        </>
      }
    />
  );
}
