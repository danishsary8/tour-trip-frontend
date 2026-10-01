import { cn } from "../../../lib/cn";

/**
 * The storefront's signature mark: a short dashed route ending in a stop, taken from the
 * TourTrip logo's flight path. Used before eyebrows and as the itinerary rail's waypoints.
 */
export function RouteMark({ className, tone = "primary" }) {
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1", className)} aria-hidden="true">
      <span className={cn("h-0 w-7 border-t-[1.5px] border-dashed", tone === "light" ? "border-white/70" : "border-primary/70")} />
      <span className={cn("size-1.5 rounded-full", tone === "light" ? "bg-accent" : "bg-primary")} />
    </span>
  );
}
