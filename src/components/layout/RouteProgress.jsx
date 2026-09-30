import { useEffect, useLayoutEffect } from "react";
import { useAnimate, useReducedMotion } from "framer-motion";
import { PageSkeleton } from "../shared/Skeleton";
import { useShell } from "./shellContext";

/**
 * Slim terracotta-to-gold bar pinned to the top of the viewport. It creeps
 * toward 85% while `active`, then completes and fades out.
 */
export function RouteProgress({ active }) {
  const [scope, animate] = useAnimate();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!scope.current) return undefined;
    let cancelled = false;

    if (active) {
      animate(scope.current, { opacity: 1, scaleX: reduceMotion ? 1 : [0.08, 0.85] }, { duration: reduceMotion ? 0 : 2.4, ease: [0.1, 0.7, 0.2, 1] });
    } else {
      (async () => {
        await animate(scope.current, { scaleX: 1 }, { duration: reduceMotion ? 0 : 0.2 });
        if (!cancelled) await animate(scope.current, { opacity: 0 }, { duration: 0.25, delay: 0.05 });
      })();
    }
    return () => {
      cancelled = true;
    };
  }, [active, animate, scope, reduceMotion]);

  return (
    <div
      ref={scope}
      role="progressbar"
      aria-label="Loading page"
      aria-hidden={!active}
      style={{ opacity: 0, transform: "scaleX(0)" }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[90] h-0.5 origin-left bg-gradient-to-r from-primary via-primary to-accent shadow-[0_0_12px_var(--accent)]"
    />
  );
}

/** Suspense fallback for lazy admin pages: drives the progress bar and shows a skeleton. */
export function RouteFallback() {
  const { setRouteLoading } = useShell();

  useLayoutEffect(() => {
    setRouteLoading(true);
    return () => setRouteLoading(false);
  }, [setRouteLoading]);

  return <PageSkeleton />;
}
