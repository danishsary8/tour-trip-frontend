import { createContext, useContext, useEffect } from "react";

/** The active report registers a builder here so the page's Export buttons can use it. */
export const ReportExportContext = createContext(null);

/**
 * Registers `build()` (returns the report description used by `export.js`) while `ready`.
 * The page clears it again when the tab changes.
 */
export function useRegisterExport(build, ready) {
  const setBuilder = useContext(ReportExportContext);
  useEffect(() => {
    if (!setBuilder) return undefined;
    setBuilder(ready ? () => build : null);
    return () => setBuilder(null);
  }, [setBuilder, build, ready]);
}
