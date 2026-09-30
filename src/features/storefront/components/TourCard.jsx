import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, MapPin, Star, Users } from "lucide-react";
import { Skeleton } from "../../../components/shared/Skeleton";
import { cn } from "../../../lib/cn";
import { formatUsd } from "../../../lib/format";
import { WishlistButton } from "./WishlistButton";

const TAG_STYLE = {
  Bestseller: "bg-accent text-[#241a06]",
  Popular: "bg-white/90 text-[#1a1f21]",
  New: "bg-success text-white",
};

/** Loading placeholder with the same footprint as TourCard, so results never jump. */
export function TourCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-panel border border-border bg-surface" aria-hidden="true">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex justify-between pt-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    </div>
  );
}

/**
 * The one tour card used on Home and on /tours: photo with slow zoom and a pointer
 * spotlight, tag, destination, duration, rating and price per person. The whole card links
 * to the tour page; the wishlist heart sits beside the link (not inside it) over the photo.
 */
export function TourCard({ tour, className, priority = false }) {
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);

  function onPointerMove(event) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    ref.current.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    ref.current.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  }

  return (
    <div className={cn("group relative h-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 has-[a:active]:translate-y-0", className)}>
      <Link
        ref={ref}
        to={`/tours/${tour.id}`}
        onPointerMove={onPointerMove}
        aria-label={`${tour.name}, ${tour.destination}. ${tour.durationLabel}. From ${formatUsd(tour.price)} per person.${tour.rating ? ` Rated ${tour.rating.toFixed(1)} out of 5.` : ""} View details`}
        className={cn(
          "relative flex h-full flex-col overflow-hidden rounded-panel border border-border bg-surface shadow-soft outline-none",
          "transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:border-primary/25 group-hover:shadow-panel",
          "focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background active:scale-[0.99]",
        )}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-2">
          <img
            src={tour.image}
            alt=""
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            onLoad={() => setLoaded(true)}
            className={cn(
              "size-full object-cover transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]",
              loaded ? "opacity-100" : "opacity-0",
            )}
          />
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/10" aria-hidden="true" />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: "radial-gradient(320px circle at var(--spot-x, 50%) var(--spot-y, 30%), rgba(255,255,255,.22), transparent 65%)" }}
          />
          {tour.tag && (
            <span className={cn("absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] shadow-sm", TAG_STYLE[tour.tag])}>{tour.tag}</span>
          )}
          <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 text-sm font-medium text-white drop-shadow">
            <MapPin className="size-4" aria-hidden="true" /> {tour.destination}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-ink">{tour.category}</p>
          <h3 className="mt-2 font-display text-xl font-semibold leading-snug tracking-[-0.02em] text-foreground">{tour.name}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{tour.tagline}</p>

          <div className="mb-5 mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4" aria-hidden="true" /> {tour.durationLabel}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-4" aria-hidden="true" /> Up to {tour.groupSize}
            </span>
          </div>

          <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-4">
            <p className="leading-tight">
              <span className="block text-xs text-muted">From</span>
              <span className="font-display text-2xl font-semibold tabular-nums text-foreground">{formatUsd(tour.price)}</span>
              <span className="text-xs text-muted"> / person</span>
            </p>
            <div className="flex flex-col items-end gap-1.5">
              {tour.rating ? (
                <span className="inline-flex items-center gap-1 text-sm">
                  <Star className="size-4 fill-accent text-accent" aria-hidden="true" />
                  <span className="font-semibold tabular-nums text-foreground">{tour.rating.toFixed(1)}</span>
                  <span className="text-xs text-muted">({tour.reviewCount})</span>
                </span>
              ) : (
                <span className="text-xs font-medium text-muted">No reviews yet</span>
              )}
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-ink">
                View details <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </div>
          </div>
        </div>
      </Link>
      <WishlistButton tourId={tour.id} tourName={tour.name} className="absolute right-4 top-4 z-10" />
    </div>
  );
}
