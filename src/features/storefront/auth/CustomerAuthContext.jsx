import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export const CUSTOMER_AUTH_KEY = "tourtrip.customer.auth";
const CUSTOMER_ACCOUNTS_KEY = "tourtrip.customer.accounts";

// Pre-seeded mock customer accounts
const INITIAL_ACCOUNTS = [
  {
    id: "cust_demo",
    name: "Sophea Meas",
    email: "customer@tourtrip.com",
    password: "Customer@123",
    role: "customer",
    initials: "SM",
    memberSince: "2026",
    avatar: null,
  },
];

function getStoredAccounts() {
  try {
    const raw = localStorage.getItem(CUSTOMER_ACCOUNTS_KEY);
    if (!raw) {
      localStorage.setItem(CUSTOMER_ACCOUNTS_KEY, JSON.stringify(INITIAL_ACCOUNTS));
      return INITIAL_ACCOUNTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_ACCOUNTS;
  } catch {
    return INITIAL_ACCOUNTS;
  }
}

function saveStoredAccounts(accounts) {
  try {
    localStorage.setItem(CUSTOMER_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch {
    // Ignore storage quota errors in test environments
  }
}

function readStoredSession() {
  try {
    const stored = localStorage.getItem(CUSTOMER_AUTH_KEY) || sessionStorage.getItem(CUSTOMER_AUTH_KEY);
    if (!stored) return null;
    const session = JSON.parse(stored);
    return session?.user && session?.token ? session : null;
  } catch {
    localStorage.removeItem(CUSTOMER_AUTH_KEY);
    sessionStorage.removeItem(CUSTOMER_AUTH_KEY);
    return null;
  }
}

function computeInitials(name) {
  if (!name || typeof name !== "string") return "CU";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "CU";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * The one customer (storefront) auth source, mounted once in AppProviders. Separate from admin
 * auth. Exposes `isAuthenticated`, `user`, `isLoading`, `login(email, password, remember)`,
 * `register(name, email, password, profile?)` (profile: `{ phone, dob }`) and `logout()`. "Remember me" keeps the session in
 * localStorage, otherwise sessionStorage. The `?redirect=` hop lives in `./redirect.js` and
 * `RequireCustomer`. (Replaces the temporary `?mockAuth=true` seam from the tour-detail branch.)
 */
const CustomerAuthContext = createContext(null);

export function CustomerAuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);
  const [isLoading, setIsLoading] = useState(false);

  // Sync session across storage tabs
  useEffect(() => {
    function handleStorage(e) {
      if (e.key === CUSTOMER_AUTH_KEY) {
        setSession(readStoredSession());
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const login = useCallback(async (email, password, remember = false) => {
    setIsLoading(true);
    try {
      // Mock network latency ~700ms
      await new Promise((resolve) => setTimeout(resolve, 700));

      const normalizedEmail = (email || "").trim().toLowerCase();
      const accounts = getStoredAccounts();

      const account = accounts.find(
        (acc) => acc.email.toLowerCase() === normalizedEmail && acc.password === password,
      );

      if (!account) {
        throw new Error("Invalid email or password. Please check your credentials and try again.");
      }

      // Safe user payload without sensitive credentials
      const user = {
        id: account.id,
        name: account.name,
        email: account.email,
        role: "customer",
        initials: account.initials || computeInitials(account.name),
        avatar: account.avatar || null,
        memberSince: account.memberSince || "2026",
      };

      const newSession = {
        token: `mock-customer-token-${Date.now()}`,
        user,
        remember: Boolean(remember),
      };

      const targetStorage = remember ? localStorage : sessionStorage;
      const otherStorage = remember ? sessionStorage : localStorage;

      targetStorage.setItem(CUSTOMER_AUTH_KEY, JSON.stringify(newSession));
      otherStorage.removeItem(CUSTOMER_AUTH_KEY);

      setSession(newSession);
      return user;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password, profile = {}) => {
    setIsLoading(true);
    try {
      // Mock network latency ~700ms
      await new Promise((resolve) => setTimeout(resolve, 700));

      const normalizedEmail = (email || "").trim().toLowerCase();
      const accounts = getStoredAccounts();

      if (accounts.some((acc) => acc.email.toLowerCase() === normalizedEmail)) {
        throw new Error("An account with this email address already exists. Please sign in instead.");
      }

      const initials = computeInitials(name);
      const newAccount = {
        id: `cust_${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        password,
        phone: profile.phone || null,
        dob: profile.dob || null,
        role: "customer",
        initials,
        memberSince: new Date().getFullYear().toString(),
        avatar: null,
      };

      const updatedAccounts = [...accounts, newAccount];
      saveStoredAccounts(updatedAccounts);

      const user = {
        id: newAccount.id,
        name: newAccount.name,
        email: newAccount.email,
        phone: newAccount.phone,
        role: "customer",
        initials: newAccount.initials,
        avatar: null,
        memberSince: newAccount.memberSince,
      };

      const newSession = {
        token: `mock-customer-token-${Date.now()}`,
        user,
        remember: true, // Default to remembered on register
      };

      localStorage.setItem(CUSTOMER_AUTH_KEY, JSON.stringify(newSession));
      sessionStorage.removeItem(CUSTOMER_AUTH_KEY);

      setSession(newSession);
      return user;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(CUSTOMER_AUTH_KEY);
    sessionStorage.removeItem(CUSTOMER_AUTH_KEY);
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      isAuthenticated: Boolean(session?.user && session?.token),
      isLoading,
      login,
      register,
      logout,
    }),
    [session, isLoading, login, register, logout],
  );

  return <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>;
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error("useCustomerAuth must be used within a CustomerAuthProvider");
  }
  return context;
}
