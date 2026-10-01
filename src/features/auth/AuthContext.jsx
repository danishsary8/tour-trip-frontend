import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  clearActivity,
  idleTimeoutMs,
  markActivity,
  readLastActivity,
  rotateLastLogin,
  setLoginNotice,
} from "./security";

export const AUTH_STORAGE_KEY = "tourtrip.auth";
const AuthContext = createContext(null);

const ACTIVITY_EVENTS = ["pointerdown", "pointermove", "keydown", "wheel", "touchstart", "scroll"];
const ACTIVITY_WRITE_MS = 5_000;
const IDLE_CHECK_MS = 10_000;

function clearStoredSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
  clearActivity();
}

function isIdle() {
  const last = readLastActivity();
  return Boolean(last) && Date.now() - last >= idleTimeoutMs();
}

function readSession() {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) return null;

  try {
    const session = JSON.parse(stored);
    if (!session?.token || !session?.user) return null;
    // A session left idle past the timeout (tab closed, laptop asleep) does not come back on reload.
    if (!readLastActivity()) markActivity();
    else if (isIdle()) {
      clearStoredSession();
      setLoginNotice("idle");
      return null;
    }
    return session;
  } catch {
    clearStoredSession();
    return null;
  }
}

/**
 * Admin auth (separate from the storefront's CustomerAuthContext). Sign-in is password + OTP;
 * `completeAuthentication` runs after the OTP and returns the previous login for the
 * "Last login" line. While signed in, an activity listener signs the admin out after
 * `IDLE_TIMEOUT_MS` (30 min) without input; the login page then explains why.
 */
export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  const completeAuthentication = useCallback(({ token, user }, remember = false) => {
    const previousLogin = rotateLastLogin(user.email);
    const nextSession = { token, user, previousLogin };
    const targetStorage = remember ? localStorage : sessionStorage;
    const otherStorage = remember ? sessionStorage : localStorage;
    targetStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
    otherStorage.removeItem(AUTH_STORAGE_KEY);
    markActivity();
    setSession(nextSession);
    return previousLogin;
  }, []);

  const logout = useCallback((reason) => {
    clearStoredSession();
    if (reason) setLoginNotice(reason);
    setSession(null);
  }, []);

  const isAuthenticated = Boolean(session?.token);

  useEffect(() => {
    if (!isAuthenticated) return undefined;

    let lastWrite = 0;
    function onActivity() {
      const now = Date.now();
      if (now - lastWrite < ACTIVITY_WRITE_MS) return;
      lastWrite = now;
      markActivity(now);
    }
    function check() {
      // Another tab signing out clears the shared timestamp; start counting again from now.
      if (!readLastActivity()) markActivity();
      else if (isIdle()) logout("idle");
    }
    // Another tab signing out of a remembered (localStorage) session.
    function onStorage(event) {
      if (event.key === AUTH_STORAGE_KEY && !event.newValue) setSession(null);
    }

    ACTIVITY_EVENTS.forEach((name) => window.addEventListener(name, onActivity, { passive: true, capture: true }));
    document.addEventListener("visibilitychange", check);
    window.addEventListener("storage", onStorage);
    const timer = window.setInterval(check, IDLE_CHECK_MS);
    return () => {
      ACTIVITY_EVENTS.forEach((name) => window.removeEventListener(name, onActivity, { capture: true }));
      document.removeEventListener("visibilitychange", check);
      window.removeEventListener("storage", onStorage);
      window.clearInterval(timer);
    };
  }, [isAuthenticated, logout]);

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      previousLogin: session?.previousLogin ?? null,
      isAuthenticated,
      completeAuthentication,
      logout,
    }),
    [completeAuthentication, isAuthenticated, logout, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
