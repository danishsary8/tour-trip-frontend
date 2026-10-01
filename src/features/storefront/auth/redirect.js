import { useSearchParams } from "react-router-dom";

/**
 * Helpers for the "login required" hop: a guest who tries to book (or opens a customer page)
 * goes to /login?redirect=<path>, and after signing in or registering lands back on <path>
 * with its query string (date and travellers) intact.
 */

/** Only same-site paths are allowed back: "/booking/x?date=…" yes, "//evil.com" or "https://…" no. */
export function safeRedirect(value, fallback = "/") {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return fallback;
  return value;
}

/** `/login?redirect=…` (or `/register?…`) for the given in-app path. */
export function authPath(target, mode = "login") {
  const base = mode === "register" ? "/register" : "/login";
  return target ? `${base}?redirect=${encodeURIComponent(target)}` : base;
}

/** "Book now" while signed out lands here with ?redirect=/booking/<tour>; offer the way back to that tour. */
export function useBookingReturn() {
  const [params] = useSearchParams();
  const tourId = safeRedirect(params.get("redirect"), "").match(/^\/booking\/([^/?#]+)/)?.[1];
  return { tourId, backTo: tourId ? `/tours/${tourId}` : "/" };
}
