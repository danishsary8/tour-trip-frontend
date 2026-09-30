import { useEffect, useMemo, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { Line } from "react-chartjs-2";
import { chartAnimation, gradientFill, playReveal, revealPlugin } from "../../../lib/chart";

const plugins = [revealPlugin];

/** Axis-less trend line with a gradient fill. Draws in the first time it scrolls into view. */
export function Sparkline({ values, color, label, className = "h-11" }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const inView = useInView(containerRef, { once: true, margin: "0px 0px -10% 0px" });
  const reduceMotion = useReducedMotion();
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!inView || revealed || !chartRef.current) return;
    if (!reduceMotion) playReveal(chartRef.current, 900);
    setRevealed(true);
  }, [inView, revealed, reduceMotion]);

  const data = useMemo(
    () => ({
      labels: values.map((_, index) => index),
      datasets: [
        {
          data: values,
          borderColor: color,
          backgroundColor: gradientFill(color, 0.28, 0),
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 0,
        },
      ],
    }),
    [values, color],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: chartAnimation(reduceMotion, { duration: 700 }),
      events: [],
      layout: { padding: { top: 2, bottom: 1 } },
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: { x: { display: false }, y: { display: false, grace: "8%" } },
    }),
    [reduceMotion],
  );

  return (
    <div ref={containerRef} className={className} role="img" aria-label={label}>
      {inView && <Line ref={chartRef} data={data} options={options} plugins={plugins} />}
    </div>
  );
}
