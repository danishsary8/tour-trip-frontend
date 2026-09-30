import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState } from "react";

/**
 * Admin and storefront keep separate theme preferences: admin defaults to dark, the public
 * storefront to light. `index.html` applies the same rules before first paint.
 */
const SCOPES = {
  admin: { key: "tourtrip.theme", fallback: "dark" },
  storefront: { key: "tourtrip.theme.storefront", fallback: "light" },
};

const ThemeContext = createContext(null);

/** Admin screens and the admin sign-in page; everything else is storefront. */
const scopeForPath = (pathname) => (/^\/(admin|login)(\/|$)/.test(pathname) ? "admin" : "storefront");

function readTheme(scope) {
  const { key, fallback } = SCOPES[scope];
  try {
    const saved = localStorage.getItem(key);
    return saved === "light" || saved === "dark" ? saved : fallback;
  } catch {
    return fallback;
  }
}

export function ThemeProvider({ children }) {
  const [state, setState] = useState(() => {
    const scope = scopeForPath(window.location.pathname);
    return { scope, theme: readTheme(scope) };
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.theme === "dark");
    document.documentElement.dataset.theme = state.theme;
    try {
      localStorage.setItem(SCOPES[state.scope].key, state.theme);
    } catch {
      // Storage may be unavailable; the theme still applies for this visit.
    }
  }, [state]);

  const setTheme = useCallback((theme) => setState((current) => ({ ...current, theme })), []);
  const setScope = useCallback(
    (scope) => setState((current) => (current.scope === scope ? current : { scope, theme: readTheme(scope) })),
    [],
  );

  const value = useMemo(
    () => ({
      theme: state.theme,
      scope: state.scope,
      setTheme,
      setScope,
      toggleTheme: () => setTheme(state.theme === "dark" ? "light" : "dark"),
    }),
    [state, setTheme, setScope],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}

/** Layouts declare their area so the right stored preference (and default) applies. */
export function useThemeScope(scope) {
  const { setScope } = useTheme();
  useLayoutEffect(() => setScope(scope), [scope, setScope]);
}
