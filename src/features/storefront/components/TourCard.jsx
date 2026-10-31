import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Star } from "lucide-react";
import { Skeleton } from "../../../components/shared/Skeleton";
import { cn } from "../../../lib/cn";
import { formatUsd } from "../../../lib/format";
import { WishlistButton } from "./WishlistButton";

const TAG_STYLE = {
  Bestseller: "bg-accent text-[#241a06]",
  Popular: "bg-white/92 text-[#1a1f21]",
  New: "bg-[#0b1215]/80 text-white backdrop-blur",
};

/** Loading placeholder with the same footprint as TourCard, so results never jump. */
export function TourCardSkeleton() {
  return (
    <div aria-hidden="true">
      <Skeleton className="aspect-[4/5] w-full rounded-card" />
      <div className="space-y-2.5 pt-4">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-4 h-5 w-full" />
      </div>
    </div>
  );
}

/**
 * The one tour card (Home, /tours, related tours, Wishlist). Editorial rather than boxed: a tall
 * photograph, then the text set straight on the page and a ruled line with length and price.
 * The whole card links to the tour; the wishlist heart sits beside the link, over the photo.
 */
export function TourCard({ tour, className, priority = false }) {
  const [loaded, setLoaded] = useState(false);
  const place = tour.international ? `${tour.destination}, ${tour.country}` : tour.destination;

  return (
    <article className={cn("group relative h-full", className)}>
      <Link
        to={`/tours/${tour.id}`}
        aria-label={`${tour.name}, ${place}. ${tour.durationLabel}. From ${formatUsd(tour.price)} per person.${tour.rating ? ` Rated ${tour.rating.toFixed(1)} out of 5.` : ""} View details`}
        className="flex h-full flex-col rounded-card outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-surface-2">
          <img
            src={tour.image}
            alt=""
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            onLoad={() => setLoaded(true)}
            className={cn(
              "size-full object-cover transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05] motion-reduce:transition-none",
              loaded ? "opacity-100" : "opacity-0",
            )}
          />
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent" aria-hidden="true" />
          {tour.tag && (
            <span className={cn("absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]", TAG_STYLE[tour.tag])}>{tour.tag}</span>
          )}
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 text-sm font-medium text-white">
            <MapPin className="size-3.5" aria-hidden="true" /> {place}
          </span>
        </div>

        <div className="flex flex-1 flex-col pt-4">
          <p className="flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-ink">
            <span className="truncate">{tour.category}</span>
            {tour.rating ? (
              <span className="inline-flex shrink-0 items-center gap-1 normal-case tracking-normal text-foreground">
                <Star className="size-3.5 fill-accent text-accent" aria-hidden="true" />
                <span className="text-xs font-semibold tabular-nums">{tour.rating.toFixed(1)}</span>
                <span className="text-xs font-normal text-muted">({tour.reviewCount})</span>
              </span>
            ) : null}
          </p>
          <h3 className="mt-1.5 font-display text-xl font-semibold leading-snug tracking-[-0.02em] text-foreground decoration-primary/40 decoration-2 underline-offset-4 group-hover:underline">
            {tour.name}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">{tour.tagline}</p>
          <div className="mt-auto pt-4">
            <p className="flex items-baseline justify-between gap-3 border-t border-border pt-3 text-sm">
              <span className="text-muted">
                {tour.durationLabel} · Up to {tour.groupSize}
              </span>
              <span className="shrink-0 text-muted">
                from <strong className="font-display text-lg font-semibold tabular-nums text-foreground">{formatUsd(tour.price)}</strong>
              </span>
            </p>
          </div>
        </div>
      </Link>
      <WishlistButton tourId={tour.id} tourName={tour.name} className="absolute right-3 top-3 z-10" />
    </article>
  );
}
