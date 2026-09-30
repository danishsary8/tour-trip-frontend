import { useCallback, useMemo, useSyncExternalStore } from "react";

/* Last six tours opened on this device, most recent first (localStorage, no account needed). */
export const RECENTLY_VIEWED_KEY = "recentlyViewed";
const LEGACY_KEY = "tourtrip.recentlyViewed";
const LIMIT = 6;
const CHANGE_EVENT = "tourtrip:recently-viewed";

function readRaw() {
  try {
    return localStorage.getItem(RECENTLY_VIEWED_KEY) ?? localStorage.getItem(LEGACY_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function parse(raw) {
  try {
    const ids = JSON.parse(raw);
    return Array.isArray(ids) ? ids.filter((id) => typeof id === "string").slice(0, LIMIT) : [];
  } catch {
    return [];
  }
}

function write(ids) {
  try {
    const data = JSON.stringify(ids);
    localStorage.setItem(RECENTLY_VIEWED_KEY, data);
    localStorage.setItem(LEGACY_KEY, data);
  } catch {
    // Blocked storage just means no history this visit.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(callback) {
  const onStorage = (event) => (event.key === null || event.key === RECENTLY_VIEWED_KEY || event.key === LEGACY_KEY) && callback();
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", onStorage);
  };
}

/** Called by Tour Detail when a tour is shown. */
export function recordTourView(id) {
  const ids = parse(readRaw());
  if (ids[0] === id) return;
  write([id, ...ids.filter((item) => item !== id)].slice(0, LIMIT));
}

export function useRecentlyViewed() {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "[]");
  const ids = useMemo(() => parse(raw), [raw]);
  const clear = useCallback(() => write([]), []);
  return { ids, clear };
}
