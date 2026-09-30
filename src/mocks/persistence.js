/**
 * Cross-tab persistence for the few mock records a customer and an admin both touch:
 * bookings made or changed on the storefront, reviews written by travellers, and the admin
 * payment-method settings that checkout reads. Everything else still resets on reload.
 *
 * Stores write JSON under these keys; the `storage` event tells other open tabs, and
 * `MOCK_SYNC_EVENT` tells this tab's query cache (see `MockSyncBridge`) to refetch.
 * When the Laravel API arrives, this file and its callers in `src/mocks/` go away.
 */
export const MOCK_KEYS = {
  bookings: "tourtrip.mock.customerBookings",
  reviews: "tourtrip.mock.customerReviews",
  settings: "tourtrip.mock.settings",
};

export const MOCK_SYNC_EVENT = "tourtrip:mock-sync";

export function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private mode or a full quota: the change still lives in memory for this tab.
  }
}

/** Runs `apply` whenever another tab rewrites `key`, then asks this tab to refetch `scope`. */
export function onStoredChange(key, scope, apply) {
  if (typeof window === "undefined") return;
  window.addEventListener("storage", (event) => {
    if (event.key !== key) return;
    apply(readJson(key, null));
    window.dispatchEvent(new CustomEvent(MOCK_SYNC_EVENT, { detail: { scope } }));
  });
}
