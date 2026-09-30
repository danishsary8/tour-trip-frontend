import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpDown, CheckCircle2, MapPin, MessageSquare, Star, X } from "lucide-react";
import { EmptyState } from "../../../components/shared/EmptyState";
import { Skeleton } from "../../../components/shared/Skeleton";
import { Button } from "../../../components/ui/Button";
import { cn } from "../../../lib/cn";
import { motionEase } from "../../../lib/motion";
import { PageIntro } from "../components/PageIntro";
import { useCatalog, useStorefrontReviews } from "../hooks";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "rating-desc", label: "Highest rated" },
  { value: "rating-asc", label: "Lowest rated" },
];

function formatDate(isoString) {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  } catch {
    return isoString;
  }
}

export default function ReviewsPage() {
  const { data, isLoading, isError, refetch } = useStorefrontReviews();
  const catalog = useCatalog();
  const reduceMotion = useReducedMotion();

  const [ratingFilter, setRatingFilter] = useState("all");
  const [destinationFilter, setDestinationFilter] = useState("all");
  const [tourFilter, setTourFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const allReviews = useMemo(() => data?.reviews ?? [], [data?.reviews]);
  const stats = useMemo(
    () =>
      data?.stats ?? {
        totalReviews: 0,
        averageRating: 5.0,
        ratingCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      },
    [data?.stats]
  );

  const destinations = useMemo(() => catalog.data?.destinations ?? [], [catalog.data]);
  const tours = useMemo(() => catalog.data?.tours ?? [], [catalog.data]);

  // Filter reviews
  const filteredReviews = useMemo(() => {
    const list = allReviews.filter((review) => {
      const matchRating = ratingFilter === "all" || review.rating === Number(ratingFilter);
      const matchDest = destinationFilter === "all" || review.destinationId === destinationFilter;
      const matchTour = tourFilter === "all" || review.tourId === tourFilter;
      return matchRating && matchDest && matchTour;
    });

    // Sort reviews
    return [...list].sort((a, b) => {
      if (sortBy === "rating-desc") {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === "rating-asc") {
        if (a.rating !== b.rating) return a.rating - b.rating;
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      // default: newest
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [allReviews, ratingFilter, destinationFilter, tourFilter, sortBy]);

  const hasActiveFilters =
    ratingFilter !== "all" || destinationFilter !== "all" || tourFilter !== "all";

  function clearFilters() {
    setRatingFilter("all");
    setDestinationFilter("all");
    setTourFilter("all");
    setSortBy("newest");
  }

  return (
    <>
      <PageIntro
        breadcrumbs={[{ label: "Reviews" }]}
        eyebrow="Verified traveller feedback"
        title="What travellers say"
        actions={
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold text-muted">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-1.5 shadow-xs">
              <CheckCircle2 className="size-3.5 text-primary" aria-hidden="true" />
              <span>100% Verified Bookings</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-1.5 shadow-xs">
              <MessageSquare className="size-3.5 text-accent" aria-hidden="true" />
              <span>{stats.totalReviews} Shared Stories</span>
            </span>
          </div>
        }
      >
        Honest memories, ratings, and genuine feedback from travellers who have explored
        temples, islands, and cultural trails across Cambodia with our local guides.
      </PageIntro>

      <section className="mx-auto max-w-[1320px] px-5 pb-24 lg:px-8" aria-label="Customer Reviews">
        {/* Rating Summary Header */}
        <div className="mb-10 rounded-3xl border border-border bg-surface/90 p-6 shadow-md backdrop-blur-xl sm:p-8 md:p-10">
          <div className="grid gap-8 md:grid-cols-[1.1fr_1.9fr] lg:grid-cols-[1fr_2fr] items-center">
            {/* Left Score Box */}
            <div className="flex flex-col items-center justify-center text-center md:border-r md:border-border md:pr-8">
              <div className="font-display text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="mt-2.5 flex items-center gap-1 text-amber-400">
                {Array.from({ length: 5 }, (_, i) => {
                  const filled = i < Math.round(stats.averageRating);
                  return (
                    <Star
                      key={i}
                      className={cn(
                        "size-5 sm:size-6",
                        filled ? "fill-amber-400 text-amber-400" : "fill-muted/20 text-muted/30"
                      )}
                      aria-hidden="true"
                    />
                  );
                })}
              </div>
              <p className="mt-2 text-sm font-semibold text-foreground">
                Overall traveller rating
              </p>
              <p className="mt-0.5 text-xs text-muted">
                Based on {stats.totalReviews} verified reviews across all Cambodia tours
              </p>
            </div>

            {/* Right Distribution Bars */}
            <div className="space-y-2.5">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = stats.ratingCounts[stars] || 0;
                const percentage = stats.totalReviews
                  ? Math.round((count / stats.totalReviews) * 100)
                  : 0;
                const isSelected = ratingFilter === String(stars);

                return (
                  <button
                    key={stars}
                    type="button"
                    onClick={() => setRatingFilter(isSelected ? "all" : String(stars))}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-2 py-1 text-xs outline-none transition-colors duration-150 hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-primary",
                      isSelected && "bg-primary/10 font-bold"
                    )}
                  >
                    <span className="flex w-14 shrink-0 items-center justify-end gap-1 font-semibold text-foreground">
                      <span>{stars}</span>
                      <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                    </span>

                    {/* Progress Bar Track */}
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-foreground/[0.08]">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-700",
                          isSelected ? "bg-primary" : "bg-amber-400/90"
                        )}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <span className="w-10 text-right text-xs text-muted font-medium">
                      {percentage}%
                    </span>
                    <span className="w-8 text-right text-xs font-semibold text-foreground">
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filter & Sort Controls */}
        <div className="mb-8 space-y-4 rounded-2xl border border-border/80 bg-surface/80 p-4 shadow-xs backdrop-blur-md sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Star Rating Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="mr-1 text-xs font-bold uppercase tracking-wider text-muted">
                Rating:
              </span>
              <button
                type="button"
                onClick={() => setRatingFilter("all")}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-semibold outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary active:scale-95",
                  ratingFilter === "all"
                    ? "bg-primary text-white shadow-xs"
                    : "border border-border bg-surface text-muted hover:border-foreground/30 hover:text-foreground"
                )}
              >
                All ({stats.totalReviews})
              </button>
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats.ratingCounts[rating] || 0;
                const isSelected = ratingFilter === String(rating);
                return (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setRatingFilter(isSelected ? "all" : String(rating))}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary active:scale-95",
                      isSelected
                        ? "bg-primary text-white shadow-xs"
                        : "border border-border bg-surface text-muted hover:border-foreground/30 hover:text-foreground"
                    )}
                  >
                    <span>{rating}★</span>
                    <span className="opacity-80">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Destination Select and Sort Select */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Destination Filter Dropdown */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-bold uppercase tracking-wider text-muted hidden sm:inline">
                  Region:
                </span>
                <select
                  value={destinationFilter}
                  onChange={(e) => setDestinationFilter(e.target.value)}
                  aria-label="Filter reviews by destination"
                  className="h-9 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-foreground outline-none transition-colors hover:border-foreground/30 focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">All Regions</option>
                  {destinations.map((dst) => (
                    <option key={dst.id} value={dst.id}>
                      {dst.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tour Filter Dropdown */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-bold uppercase tracking-wider text-muted hidden sm:inline">
                  Tour:
                </span>
                <select
                  value={tourFilter}
                  onChange={(e) => setTourFilter(e.target.value)}
                  aria-label="Filter reviews by tour"
                  className="h-9 max-w-[180px] truncate rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-foreground outline-none transition-colors hover:border-foreground/30 focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">All Tours</option>
                  {tours.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Order Control */}
              <div className="flex items-center gap-1.5 text-xs">
                <ArrowUpDown className="size-3.5 text-muted" aria-hidden="true" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort reviews"
                  className="h-9 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-foreground outline-none transition-colors hover:border-foreground/30 focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Chips & Clear */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 border-t border-border/50 pt-3">
              <span className="text-xs font-medium text-muted">Active filters:</span>
              {ratingFilter !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary-ink">
                  {ratingFilter} Stars
                  <button
                    type="button"
                    onClick={() => setRatingFilter("all")}
                    aria-label="Remove star rating filter"
                    className="ml-0.5 rounded hover:text-danger"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              )}
              {destinationFilter !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary-ink">
                  {destinations.find((d) => d.id === destinationFilter)?.name || destinationFilter}
                  <button
                    type="button"
                    onClick={() => setDestinationFilter("all")}
                    aria-label="Remove region filter"
                    className="ml-0.5 rounded hover:text-danger"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              )}
              {tourFilter !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary-ink">
                  {tours.find((t) => t.id === tourFilter)?.name || tourFilter}
                  <button
                    type="button"
                    onClick={() => setTourFilter("all")}
                    aria-label="Remove tour filter"
                    className="ml-0.5 rounded hover:text-danger"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-semibold text-danger-ink hover:underline ml-auto"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Results Counter */}
        <div className="mb-6 flex items-center justify-between text-xs text-muted">
          <span>
            Showing <strong className="text-foreground">{filteredReviews.length}</strong>{" "}
            {filteredReviews.length === 1 ? "review" : "reviews"}
          </span>
          <span className="text-xs text-muted">
            Sorted by {SORT_OPTIONS.find((s) => s.value === sortBy)?.label.toLowerCase()}
          </span>
        </div>

        {/* Reviews List */}
        {isError ? (
          <EmptyState
            icon={MessageSquare}
            title="Reviews could not be loaded"
            description="We were unable to load traveller reviews. Please check your connection and try again."
            action={<Button onClick={() => refetch()}>Try again</Button>}
          />
        ) : isLoading ? (
          <div className="grid gap-6 md:grid-cols-2" aria-label="Loading reviews">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="h-56 rounded-3xl overflow-hidden">
                <Skeleton className="size-full rounded-3xl" />
              </div>
            ))}
          </div>
        ) : filteredReviews.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No reviews match your filters"
            description="Try widening your star rating or selecting a different tour or region to see more traveller feedback."
            action={<Button onClick={clearFilters}>Clear filters</Button>}
          />
        ) : (
          <AnimatePresence mode="wait">
            <motion.ul
              key={`${ratingFilter}-${destinationFilter}-${tourFilter}-${sortBy}`}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, transition: { duration: reduceMotion ? 0 : 0.15 } }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.05 } } }}
              className="grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-2"
            >
              {filteredReviews.map((review) => (
                <motion.li
                  key={review.id}
                  variants={{
                    hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: reduceMotion ? 0 : 0.4, ease: motionEase },
                    },
                  }}
                  className="group relative flex flex-col justify-between rounded-3xl border border-border/80 bg-surface p-6 shadow-sm transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md sm:p-7"
                >
                  <div>
                    {/* Header: Reviewer info and rating */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="grid size-11 place-items-center rounded-2xl bg-primary/10 font-display text-sm font-bold text-primary-ink shadow-xs">
                          {review.initials || "TR"}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground text-sm sm:text-base">
                              {review.customerName}
                            </h3>
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary-ink">
                              <CheckCircle2 className="size-3" />
                              <span>Verified</span>
                            </span>
                          </div>
                          <p className="text-xs text-muted mt-0.5">
                            {formatDate(review.createdAt)}
                          </p>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "size-4",
                              i < review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "fill-muted/20 text-muted/30"
                            )}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Review Comment Text */}
                    <blockquote className="mt-4 text-sm leading-relaxed text-foreground/90 sm:text-[15px]">
                      &ldquo;{review.comment}&rdquo;
                    </blockquote>
                  </div>

                  {/* Footer: Tour reference badge */}
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-4 text-xs">
                    <div className="flex items-center gap-1.5 text-muted">
                      <MapPin className="size-3.5 text-accent shrink-0" aria-hidden="true" />
                      <span>{review.destination}</span>
                    </div>

                    <Link
                      to={
                        review.destinationId
                          ? `/tours?destination=${review.destinationId}`
                          : "/tours"
                      }
                      className="font-medium text-primary-ink hover:underline truncate max-w-[240px]"
                    >
                      {review.tourName}
                    </Link>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
        )}
      </section>
    </>
  );
}
