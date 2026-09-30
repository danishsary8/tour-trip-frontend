import { createContext, useContext } from "react";

/** Dev-only override from `?state=loading|error|empty`, for reviewing widget states. */
export const ForcedStateContext = createContext(null);

export const FORCEABLE_STATES = ["loading", "error", "empty"];

/**
 * Collapses a query into one of `loading | error | empty | ready`. Skeletons only
 * appear on the first load; later refetches keep showing the previous data.
 */
export function useWidgetStatus(query, isEmpty = () => false) {
  const forced = useContext(ForcedStateContext);
  if (forced) return forced;
  if (query.isLoading) return "loading";
  if (query.isError && !query.data) return "error";
  if (!query.data || isEmpty(query.data)) return "empty";
  return "ready";
}
