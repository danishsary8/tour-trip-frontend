import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { MOCK_KEYS, MOCK_SYNC_EVENT } from "../../mocks/persistence";

/** Query caches that read each shared mock store. */
const SCOPES = {
  bookings: [["bookings"], ["dashboard"], ["customers"], ["reports"], ["shell-summary"], ["storefront"]],
  reviews: [["reviews"], ["review-stats"], ["shell-summary"], ["reports"], ["storefront"]],
  settings: [["settings"]],
};

/**
 * Mock-only: when another tab books, cancels, reviews or changes payment settings, refetch the
 * affected queries here so the admin and the storefront stay in step. Renders nothing.
 */
export function MockSyncBridge() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const refresh = (scope) => SCOPES[scope]?.forEach((queryKey) => queryClient.invalidateQueries({ queryKey }));
    const onSync = (event) => refresh(event.detail?.scope);
    // Settings are re-read from storage on every fetch, so the raw storage event is enough.
    const onStorage = (event) => event.key === MOCK_KEYS.settings && refresh("settings");
    window.addEventListener(MOCK_SYNC_EVENT, onSync);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(MOCK_SYNC_EVENT, onSync);
      window.removeEventListener("storage", onStorage);
    };
  }, [queryClient]);

  return null;
}
