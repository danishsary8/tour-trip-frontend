import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import { useCustomerAuth } from "./auth/CustomerAuthContext";

/*
 * Saved tours, kept in localStorage so they survive reloads without an account.
 * Guests use the `wishlist` key (array of tour ids). A signed-in traveller gets their own
 * `wishlist:<userId>` list, and anything saved as a guest is merged into it on sign-in, so
 * saving before logging in is never lost. Every hook instance (cards, header badge, the
 * /wishlist page) reads the same store and updates live, across tabs too.
 */
export const GUEST_WISHLIST_KEY = "wishlist";
const CHANGE_EVENT = "tourtrip:wishlist";
const keyFor = (user) => (user?.id ? `${GUEST_WISHLIST_KEY}:${user.id}` : GUEST_WISHLIST_KEY);

function readRaw(key) {
  try {
    return localStorage.getItem(key) ?? "[]";
  } catch {
    return "[]";
  }
}

function parse(raw) {
  try {
    const ids = JSON.parse(raw);
    return Array.isArray(ids) ? ids.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function write(key, ids) {
  try {
    localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    // Storage can be full or blocked (private mode); the in-page state still updates below.
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: key }));
}

function subscribe(callback) {
  const onStorage = (event) => (event.key === null || event.key?.startsWith(GUEST_WISHLIST_KEY)) && callback();
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", onStorage);
  };
}

export function useWishlist() {
  const { user } = useCustomerAuth();
  const key = keyFor(user);
  // The raw JSON string is the snapshot: stable between renders until the list really changes.
  const raw = useSyncExternalStore(subscribe, () => readRaw(key), () => "[]");
  const ids = useMemo(() => parse(raw), [raw]);

  // On sign-in, fold the guest list into the traveller's own list (newest first, no duplicates).
  useEffect(() => {
    if (!user?.id) return;
    const guest = parse(readRaw(GUEST_WISHLIST_KEY));
    if (!guest.length) return;
    const own = parse(readRaw(key));
    write(key, [...guest, ...own.filter((id) => !guest.includes(id))]);
    write(GUEST_WISHLIST_KEY, []);
  }, [user?.id, key]);

  const toggle = useCallback(
    (id) => {
      const current = parse(readRaw(key));
      const saved = current.includes(id);
      write(key, saved ? current.filter((item) => item !== id) : [id, ...current]);
      return !saved;
    },
    [key],
  );

  const remove = useCallback((id) => write(key, parse(readRaw(key)).filter((item) => item !== id)), [key]);
  const clear = useCallback(() => write(key, []), [key]);
  const has = useCallback((id) => ids.includes(id), [ids]);

  return { ids, count: ids.length, has, toggle, remove, clear };
}
