import { useMemo } from "react";
import { History, X } from "lucide-react";
import { cn } from "../../../lib/cn";
import { useRecentlyViewed } from "../recentlyViewed";
import { Reveal, RevealItem } from "./Reveal";
import { TourCard } from "./TourCard";

/**
 * "Recently viewed" strip for return visits: a horizontal snap row of TourCards on phones and
 * tablets, a grid on desktop. Renders nothing until the guest has opened a tour.
 */
export function RecentlyViewed({ tours, excludeId, className }) {
  const { ids, clear } = useRecentlyViewed();
  const items = useMemo(() => {
    const byId = new Map(tours.map((tour) => [tour.id, tour]));
    return ids.filter((id) => id !== excludeId).map((id) => byId.get(id)).filter(Boolean);
  }, [tours, ids, excludeId]);

  if (!items.length) return null;

  return (
    <section aria-labelledby="recently-viewed-title" className={cn("mx-auto max-w-[1320px] px-5 lg:px-8", className)}>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary-ink">
            <History className="size-4" aria-hidden="true" /> Pick up where you left off
          </p>
          <h2 id="recently-viewed-title" className="font-display text-2xl font-semibold tracking-[-0.03em] text-foreground sm:text-3xl">
            Recently viewed
          </h2>
        </div>
        <button
          type="button"
          onClick={clear}
          aria-label="Clear recently viewed tours"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-muted outline-none transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/70"
        >
          <X className="size-4" aria-hidden="true" /> Clear<span className="hidden sm:inline">&nbsp;history</span>
        </button>
      </div>
      <Reveal
        stagger
        as="ul"
        amount={0.1}
        className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 pt-2 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0 xl:grid-cols-4 [&::-webkit-scrollbar]:hidden"
      >
        {items.slice(0, 6).map((tour, index) => (
          <RevealItem as="li" key={tour.id} className={cn("w-[78%] max-w-[320px] shrink-0 snap-start sm:w-[46%] lg:w-auto lg:max-w-none", index >= 4 && "xl:hidden", index >= 3 && "lg:max-xl:hidden")}>
            <TourCard tour={tour} />
          </RevealItem>
        ))}
      </Reveal>
    </section>
  );
}
