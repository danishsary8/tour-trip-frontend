import { useMemo, useSyncExternalStore } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LineController,
  LinearScale,
  LineElement,
  PointElement,
  PolarAreaController,
  RadialLinearScale,
  Tooltip,
} from "chart.js";

// Controllers are registered for the generic <Chart> used by mixed bar + line reports.
ChartJS.register(
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LineController,
  LinearScale,
  LineElement,
  PointElement,
  PolarAreaController,
  RadialLinearScale,
  Tooltip,
);

ChartJS.defaults.font.family = '"Inter Variable", "Kantumruy Pro", sans-serif';
ChartJS.defaults.color = "#8A9A9C";
ChartJS.defaults.borderColor = "rgba(138, 154, 156, 0.14)";
ChartJS.defaults.animation.duration = 700;
ChartJS.defaults.animation.easing = "easeOutQuart";
ChartJS.defaults.plugins.legend.labels.usePointStyle = true;
ChartJS.defaults.plugins.legend.labels.boxWidth = 8;
ChartJS.defaults.plugins.tooltip.backgroundColor = "rgba(11, 18, 21, 0.94)";
ChartJS.defaults.plugins.tooltip.titleColor = "#EEF2F1";
ChartJS.defaults.plugins.tooltip.bodyColor = "#CBD5D3";
ChartJS.defaults.plugins.tooltip.padding = 12;
ChartJS.defaults.plugins.tooltip.cornerRadius = 10;
ChartJS.defaults.plugins.tooltip.displayColors = false;

export { ChartJS };

/* ------------------------------------------------------------------ theme */

const TOKENS = ["primary", "accent", "success", "info", "danger", "warning", "muted", "foreground", "border", "surface", "background"];

/** Current token values from `tokens.css`, so charts follow the light/dark theme. */
export function readChartTheme() {
  const styles = getComputedStyle(document.documentElement);
  const theme = Object.fromEntries(TOKENS.map((token) => [token, styles.getPropertyValue(`--${token}`).trim()]));
  theme.dark = document.documentElement.classList.contains("dark");
  theme.grid = withAlpha(theme.muted, theme.dark ? 0.12 : 0.16);
  return theme;
}

/** `#c8553d` + 0.2 → `rgba(200, 85, 61, 0.2)`. Non-hex colours are returned unchanged. */
export function withAlpha(color, alpha) {
  const hex = color?.replace("#", "");
  if (!hex || !/^[0-9a-f]{6}$/i.test(hex)) return color;
  const [r, g, b] = [0, 2, 4].map((offset) => parseInt(hex.slice(offset, offset + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function subscribeToRoot(onChange) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
  return () => observer.disconnect();
}

const rootThemeKey = () => `${document.documentElement.className}|${document.documentElement.dataset.theme ?? ""}`;

/**
 * Chart colours that update when the root theme class changes. Observing the DOM
 * (rather than React theme state) guarantees the new CSS variables are already applied.
 */
export function useChartTheme() {
  const key = useSyncExternalStore(subscribeToRoot, rootThemeKey, () => "");
  // `key` changes exactly when the tokens do.
  return useMemo(() => ({ ...readChartTheme(), key }), [key]);
}

/* ---------------------------------------------------------------- helpers */

/** Vertical gradient across the chart area; `stops` is `[[offset, color], …]` from top to bottom. */
export function createGradient(ctx, chartArea, stops) {
  const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
  for (const [offset, color] of stops) gradient.addColorStop(offset, color);
  return gradient;
}

/** Scriptable fill for line/area datasets; falls back to a flat colour before layout. */
export const gradientFill = (color, top = 0.32, bottom = 0) => (context) => {
  const { chart } = context;
  if (!chart.chartArea) return withAlpha(color, top / 2);
  return createGradient(chart.ctx, chart.chartArea, [
    [0, withAlpha(color, top)],
    [1, withAlpha(color, bottom)],
  ]);
};

/** Chart.js animation config: off with reduced motion, otherwise easeOutQuart. */
export const chartAnimation = (reduceMotion, overrides = {}) =>
  reduceMotion ? false : { duration: 800, easing: "easeOutQuart", ...overrides };

/** Dark glass tooltip used by every dashboard chart, in both themes. */
export function tooltipPreset(theme, overrides = {}) {
  return {
    enabled: true,
    backgroundColor: "rgba(11, 18, 21, 0.92)",
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    cornerRadius: 12,
    padding: { top: 10, bottom: 10, left: 12, right: 12 },
    titleColor: "#eef2f1",
    titleFont: { weight: "600", size: 12 },
    titleMarginBottom: 6,
    bodyColor: "#cbd5d3",
    bodyFont: { size: 12 },
    bodySpacing: 6,
    displayColors: true,
    usePointStyle: true,
    boxWidth: 8,
    boxHeight: 8,
    boxPadding: 6,
    caretSize: 6,
    caretPadding: 8,
    ...overrides,
  };
}

/* ---------------------------------------------------------------- plugins */

/** Dashed vertical line under the active tooltip point. Options: `{ color }`. */
export const crosshairPlugin = {
  id: "crosshair",
  afterDatasetsDraw(chart, _args, options) {
    const active = chart.tooltip?.getActiveElements?.() ?? [];
    if (!active.length) return;
    const { ctx, chartArea } = chart;
    const x = active[0].element.x;
    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1;
    ctx.strokeStyle = options.color ?? "rgba(138, 154, 156, 0.5)";
    ctx.moveTo(x, chartArea.top);
    ctx.lineTo(x, chartArea.bottom);
    ctx.stroke();
    ctx.restore();
  },
};

const easeOutQuart = (t) => 1 - (1 - t) ** 4;

/**
 * Text in the middle of a doughnut. Options: `{ value, label, color, labelColor, format, animate }`.
 * The number counts to its new value whenever `value` changes.
 */
export const centerTextPlugin = {
  id: "centerText",
  afterDraw(chart, _args, options) {
    if (options.value === undefined) return;
    const now = performance.now();
    const state = (chart.$centerText ??= { from: options.animate === false ? options.value : 0, to: options.value, start: now });
    if (state.to !== options.value) {
      state.from = state.current ?? state.to;
      state.to = options.value;
      state.start = now;
    }
    const progress = options.animate === false ? 1 : Math.min(1, (now - state.start) / 800);
    state.current = state.from + (state.to - state.from) * easeOutQuart(progress);

    const arc = chart.getDatasetMeta(0)?.data?.[0];
    const x = arc?.x ?? (chart.chartArea.left + chart.chartArea.right) / 2;
    const y = arc?.y ?? (chart.chartArea.top + chart.chartArea.bottom) / 2;
    const format = options.format ?? ((value) => Math.round(value).toLocaleString("en-US"));
    const { ctx } = chart;

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = options.color ?? "#eef2f1";
    ctx.font = `600 ${options.size ?? 28}px "Bricolage Grotesque Variable", "Inter Variable", sans-serif`;
    ctx.fillText(format(state.current), x, y - 8);
    if (options.label) {
      ctx.fillStyle = options.labelColor ?? "#8a9a9c";
      ctx.font = '500 11px "Inter Variable", sans-serif';
      ctx.fillText(options.label, x, y + 16);
    }
    ctx.restore();

    if (progress < 1) {
      cancelAnimationFrame(state.frame);
      state.frame = requestAnimationFrame(() => chart.ctx && chart.draw());
    }
  },
  afterDestroy(chart) {
    cancelAnimationFrame(chart.$centerText?.frame);
  },
};

/**
 * Left-to-right draw-in for line charts. Call `playReveal(chart)` once when the
 * chart first scrolls into view; later data updates morph normally.
 */
export const revealPlugin = {
  id: "reveal",
  beforeDatasetsDraw(chart) {
    const progress = chart.$reveal ?? 1;
    if (progress >= 1) return;
    const { ctx, chartArea } = chart;
    ctx.save();
    ctx.beginPath();
    ctx.rect(chartArea.left - 8, 0, (chartArea.right - chartArea.left + 16) * progress, chart.height);
    ctx.clip();
  },
  afterDatasetsDraw(chart) {
    if ((chart.$reveal ?? 1) < 1) chart.ctx.restore();
  },
  afterDestroy(chart) {
    cancelAnimationFrame(chart.$revealFrame);
  },
};

export function playReveal(chart, duration = 1000) {
  if (!chart) return;
  const start = performance.now();
  chart.$reveal = 0;
  const step = (now) => {
    if (!chart.ctx) return;
    chart.$reveal = easeOutQuart(Math.min(1, (now - start) / duration));
    chart.draw();
    if (chart.$reveal < 1) chart.$revealFrame = requestAnimationFrame(step);
  };
  chart.$revealFrame = requestAnimationFrame(step);
}
