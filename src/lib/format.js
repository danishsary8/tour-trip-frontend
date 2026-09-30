import { formatTimeAgo } from "./time";

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const usdCompact = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 });
const count = new Intl.NumberFormat("en-US");
const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
const date = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const shortDate = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });

/** $12,480 */
export const formatUsd = (value) => usd.format(value);
/** $12.5K */
export const formatUsdCompact = (value) => usdCompact.format(value);
/** 1,284 */
export const formatCount = (value) => count.format(value);
/** 12.5K */
export const formatCompact = (value) => compact.format(value);

/** +12.4% / −3.1%. `null` (no previous period) renders as an em dash. */
export function formatPercent(value, { signed = true, digits = 1 } = {}) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  const rounded = Math.abs(value).toFixed(digits);
  if (!signed) return `${rounded}%`;
  return `${value >= 0 ? "+" : "−"}${rounded}%`;
}

/** `YYYY-MM-DD` → "Sep 29, 2026". */
export const formatDate = (value) => date.format(new Date(value + "T00:00:00Z"));
/** `YYYY-MM-DD` → "Tue, Sep 29". */
export const formatShortDate = (value) => shortDate.format(new Date(value + "T00:00:00Z"));
/** ISO timestamp → "4 min. ago". */
export const formatRelativeTime = (value) => formatTimeAgo(value);
