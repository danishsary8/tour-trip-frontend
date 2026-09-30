import { useLocation } from "react-router-dom";

/**
 * Route-derived active state (survives page refresh, unlike local useState).
 * Returns a matcher: exact match for dashboard routes, prefix match for nested routes.
 * @returns {(path: string) => boolean}
 */
export function useActiveRoute() {
  const { pathname } = useLocation();

  return (path) => {
    const isDashboardRoute = path === "/" || path === "/admin";

    return isDashboardRoute
      ? pathname === path
      : pathname === path || pathname.startsWith(`${path}/`);
  };
}
