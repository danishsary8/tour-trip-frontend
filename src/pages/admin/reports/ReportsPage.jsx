import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import { CircleDollarSign, CreditCard, FileSpreadsheet, FileText, MapPinned, PieChart, Trophy } from "lucide-react";
import { PageHeader } from "../../../components/shared/PageHeader";
import { Tabs, tabId, tabPanelId } from "../../../components/shared/Tabs";
import { Button } from "../../../components/ui/Button";
import { SegmentedControl } from "../../../components/ui/SegmentedControl";
import { DEFAULT_RANGE, RANGE_OPTIONS, isRange } from "../../../features/dashboard/ranges";
import { FORCEABLE_STATES, ForcedStateContext } from "../../../features/dashboard/widgetState";
import { DestinationReport } from "../../../features/reports/components/DestinationReport";
import { IncomeReport } from "../../../features/reports/components/IncomeReport";
import { PaymentReport } from "../../../features/reports/components/PaymentReport";
import { StatusReport } from "../../../features/reports/components/StatusReport";
import { ToursReport } from "../../../features/reports/components/ToursReport";
import { ReportExportContext } from "../../../features/reports/exportContext";
import { pageTransition } from "../../../lib/motion";

const REPORTS = [
  { value: "income", label: "Monthly income", icon: CircleDollarSign, Component: IncomeReport, uses: "year" },
  { value: "tours", label: "Popular tours", icon: Trophy, Component: ToursReport, uses: "range" },
  { value: "status", label: "Booking status", icon: PieChart, Component: StatusReport, uses: "range" },
  { value: "destinations", label: "Destinations", icon: MapPinned, Component: DestinationReport, uses: "range" },
  { value: "payments", label: "Payments", icon: CreditCard, Component: PaymentReport, uses: "range" },
];

const staticTransition = { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1, transition: { duration: 0 } } };
const THIS_YEAR = new Date().getFullYear();

/** Reports: Monthly Income, Popular Tours, Booking Status, Destinations and Payments, with Excel and PDF export. */
export default function ReportsPage() {
  const [params, setParams] = useSearchParams();
  const reduceMotion = useReducedMotion();
  const [builder, setBuilder] = useState(null);
  const [exporting, setExporting] = useState(null);

  const report = REPORTS.find((item) => item.value === params.get("tab")) ?? REPORTS[0];
  const range = isRange(params.get("range")) ? params.get("range") : DEFAULT_RANGE;
  const year = Number(params.get("year")) || THIS_YEAR;
  const forcedState = import.meta.env.DEV && FORCEABLE_STATES.includes(params.get("state")) ? params.get("state") : null;

  function setParam(key, value) {
    setParams((current) => {
      const next = new URLSearchParams(current);
      next.set(key, value);
      return next;
    }, { replace: true });
  }

  async function runExport(kind) {
    if (!builder) return;
    setExporting(kind);
    try {
      const description = builder();
      const exporter = await import("../../../features/reports/export");
      await (kind === "xlsx" ? exporter.exportReportXlsx(description) : exporter.exportReportPdf(description));
      toast.success(`${description.title} downloaded`, { description: kind === "xlsx" ? "Excel workbook (.xlsx)" : "PDF document" });
    } catch (error) {
      toast.error(error.message || "Export failed");
    } finally {
      setExporting(null);
    }
  }

  const years = Array.from({ length: 3 }, (_, index) => THIS_YEAR - index);
  const { Component } = report;

  return (
    <ReportExportContext.Provider value={setBuilder}>
      <ForcedStateContext.Provider value={forcedState}>
        <div className="mx-auto min-w-0 max-w-[1600px] space-y-5 pb-10 sm:space-y-6">
          <PageHeader
            eyebrow="Insights"
            title="Reports"
            description="Income, tours, booking status, destinations and payments. Export any report to Excel or PDF."
            className="!mb-0"
            actions={
              <>
                {report.uses === "year" ? (
                  <label className="flex items-center gap-2 text-sm text-muted">
                    Year
                    <select
                      value={year}
                      onChange={(event) => setParam("year", event.target.value)}
                      className="h-10 rounded-control border border-border bg-surface px-3 text-sm font-semibold text-foreground outline-none transition-colors hover:border-primary/35 focus-visible:ring-2 focus-visible:ring-primary/30"
                    >
                      {years.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                ) : (
                  <SegmentedControl label="Date range" options={RANGE_OPTIONS} value={range} onChange={(next) => setParam("range", next)} />
                )}
                <div className="flex gap-2" role="group" aria-label="Export report">
                  <Button variant="outline" size="sm" className="h-10 bg-transparent hover:bg-foreground/[0.06]" onClick={() => runExport("xlsx")} disabled={!builder || Boolean(exporting)} loading={exporting === "xlsx"}>
                    <FileSpreadsheet className="size-4" aria-hidden="true" /> Excel
                  </Button>
                  <Button variant="outline" size="sm" className="h-10 bg-transparent hover:bg-foreground/[0.06]" onClick={() => runExport("pdf")} disabled={!builder || Boolean(exporting)} loading={exporting === "pdf"}>
                    <FileText className="size-4" aria-hidden="true" /> PDF
                  </Button>
                </div>
              </>
            }
          />

          <Tabs
            idPrefix="reports"
            label="Report type"
            tabs={REPORTS.map(({ value, label, icon }) => ({ value, label, icon }))}
            value={report.value}
            onChange={(next) => setParam("tab", next)}
          />

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={report.value}
              id={tabPanelId("reports", report.value)}
              role="tabpanel"
              aria-labelledby={tabId("reports", report.value)}
              variants={reduceMotion ? staticTransition : pageTransition}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Component range={range} year={year} />
            </motion.div>
          </AnimatePresence>
        </div>
      </ForcedStateContext.Provider>
    </ReportExportContext.Provider>
  );
}
