import { createContext, useContext } from "react";

/**
 * Shared admin shell state: sidebar collapse, mobile drawer, command palette,
 * page scroll and lazy-route loading. Provided by `AdminLayout`.
 */
export const ShellContext = createContext(null);

export function useShell() {
  const context = useContext(ShellContext);
  if (!context) throw new Error("useShell must be used within AdminLayout");
  return context;
}
