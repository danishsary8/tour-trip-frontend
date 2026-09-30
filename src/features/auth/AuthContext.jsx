import { createContext, useCallback, useContext, useMemo, useState } from "react";

export const AUTH_STORAGE_KEY = "tourtrip.auth";
const AuthContext = createContext(null);

function readSession() {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) return null;

  try {
    const session = JSON.parse(stored);
    return session?.token && session?.user ? session : null;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  const completeAuthentication = useCallback(({ token, user }, remember = false) => {
    const nextSession = { token, user };
    const targetStorage = remember ? localStorage : sessionStorage;
    const otherStorage = remember ? sessionStorage : localStorage;
    targetStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
    otherStorage.removeItem(AUTH_STORAGE_KEY);
    setSession(nextSession);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: Boolean(session?.token),
      completeAuthentication,
      logout,
    }),
    [completeAuthentication, logout, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
