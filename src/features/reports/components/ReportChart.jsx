import { useRef } from "react";
import { useInView } from "framer-motion";
import { Chart } from "react-chartjs-2";
import { cn } from "../../../lib/cn";

/**
 * Chart.js canvas that mounts (and so animates) the first time it scrolls into view, then
 * updates in place when data or options change. Height is fixed so nothing shifts on load.
 */
export function ReportChart({ type, data, options, plugins, label, className = "h-[320px]" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <div ref={ref} className={cn("relative w-full", className)} role="img" aria-label={label}>
      {inView && <Chart type={type} data={data} options={options} plugins={plugins} />}
    </div>
  );
}
