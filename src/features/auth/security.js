/**
 * Mock admin account-security rules, kept in the browser until the Laravel API enforces them
 * server-side (where they belong: anything in localStorage can be cleared by the user).
 *
 * - Lockout: 5 wrong passwords for one email lock that email for 15 minutes.
 * - Last login: the previous sign-in time and device, shown after the next sign-in.
 * - Idle timeout: 30 minutes without mouse, keyboard, touch or scroll signs the admin out.
 */

export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCKOUT_MS = 15 * 60 * 1000;
export const IDLE_TIMEOUT_MS = 30 * 60 * 1000;

const GUARD_KEY = "tourtrip.admin.loginGuard";
const LAST_LOGIN_KEY = "tourtrip.admin.lastLogin";
const LAST_ACTIVITY_KEY = "tourtrip.admin.lastActivity";
const NOTICE_KEY = "tourtrip.admin.notice";
// Dev/QA only: set this key (milliseconds) to try the idle logout without waiting 30 minutes.
const IDLE_OVERRIDE_KEY = "tourtrip.admin.idleTimeoutMs";

function readJson(storage, key, fallback) {
  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(storage, key, value) {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be full or blocked; the mock rules then simply don't persist.
  }
}

const normalize = (email) => (email || "").trim().toLowerCase();

/* ---------- Failed-attempt lockout (per email) ---------- */

/** `{ failures, lockedUntil }` for an email; an expired lock reads as unlocked with 0 failures. */
export function getLoginGuard(email, now = Date.now()) {
  const entry = readJson(localStorage, GUARD_KEY, {})[normalize(email)];
  if (!entry) return { failures: 0, lockedUntil: null };
  if (entry.lockedUntil && entry.lockedUntil <= now) return { failures: 0, lockedUntil: null };
  return { failures: entry.failures ?? 0, lockedUntil: entry.lockedUntil ?? null };
}

/** Records a wrong password and returns the new guard state (locked on the 5th failure). */
export function recordFailedLogin(email, now = Date.now()) {
  const key = normalize(email);
  const all = readJson(localStorage, GUARD_KEY, {});
  const failures = getLoginGuard(key, now).failures + 1;
  const next = failures >= MAX_LOGIN_ATTEMPTS ? { failures, lockedUntil: now + LOCKOUT_MS } : { failures, lockedUntil: null };
  writeJson(localStorage, GUARD_KEY, { ...all, [key]: next });
  return next;
}

export function clearLoginGuard(email) {
  const all = readJson(localStorage, GUARD_KEY, {});
  delete all[normalize(email)];
  writeJson(localStorage, GUARD_KEY, all);
}

/** "14:32" */
export function formatCountdown(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

/* ---------- Last login ---------- */

/** A short, human label for this browser: "Chrome on Windows". */
export function describeDevice(userAgent = navigator.userAgent) {
  const browser = /Edg\//.test(userAgent)
    ? "Edge"
    : /OPR\//.test(userAgent)
      ? "Opera"
      : /Firefox\//.test(userAgent)
        ? "Firefox"
        : /Chrome\//.test(userAgent)
          ? "Chrome"
          : /Safari\//.test(userAgent)
            ? "Safari"
            : "Browser";
  const os = /Windows/.test(userAgent)
    ? "Windows"
    : /Android/.test(userAgent)
      ? "Android"
      : /iPhone|iPad/.test(userAgent)
        ? "iOS"
        : /Mac OS X/.test(userAgent)
          ? "macOS"
          : /Linux/.test(userAgent)
            ? "Linux"
            : "an unknown device";
  return `${browser} on ${os}`;
}

/**
 * Saves this sign-in and returns the previous one. The very first sign-in in a browser gets a
 * seeded previous login (two days earlier, from another device) so the activity line has
 * something to show in the demo.
 */
export function rotateLastLogin(email, now = Date.now()) {
  const key = normalize(email);
  const all = readJson(localStorage, LAST_LOGIN_KEY, {});
  const seeded = new Date(now - 2 * 24 * 60 * 60 * 1000);
  seeded.setHours(18, 42, 0, 0);
  const previous = all[key] ?? { at: seeded.getTime(), device: "Safari on macOS" };
  writeJson(localStorage, LAST_LOGIN_KEY, { ...all, [key]: { at: now, device: describeDevice() } });
  return previous;
}

const loginTime = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

/** "Last login: Tue 29 Sep, 18:42 · Safari on macOS" */
export function formatLastLogin(previous) {
  if (!previous?.at) return null;
  return `${loginTime.format(new Date(previous.at))} · ${previous.device}`;
}

/* ---------- Idle timeout ---------- */

export function idleTimeoutMs() {
  const override = Number(localStorage.getItem(IDLE_OVERRIDE_KEY));
  return Number.isFinite(override) && override > 0 ? override : IDLE_TIMEOUT_MS;
}

export function readLastActivity() {
  return Number(localStorage.getItem(LAST_ACTIVITY_KEY)) || 0;
}

export function markActivity(now = Date.now()) {
  try {
    localStorage.setItem(LAST_ACTIVITY_KEY, String(now));
  } catch {
    // ignore
  }
}

export function clearActivity() {
  localStorage.removeItem(LAST_ACTIVITY_KEY);
}

/* ---------- One-time notice for the login page ---------- */

export const NOTICES = {
  idle: "You were logged out due to inactivity.",
};

export function setLoginNotice(type) {
  sessionStorage.setItem(NOTICE_KEY, type);
}

export function peekLoginNotice() {
  return NOTICES[sessionStorage.getItem(NOTICE_KEY)] ?? null;
}

/** Called once the login page has shown the notice, so it appears only once. */
export function clearLoginNotice() {
  sessionStorage.removeItem(NOTICE_KEY);
}
