import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MessageSquare, Star } from "lucide-react";
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

const dateLabel = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
const select =
  "h-10 min-w-0 cursor-pointer rounded-full border border-border bg-transparent px-4 text-sm font-medium text-foreground outline-none transition-colors hover:border-foreground/30 focus-visible:ring-2 focus-visible:ring-primary/60";

function Stars({ value, size = "size-4" }) {
  return (
    <span className="flex gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((number) => (
        <Star key={number} className={cn(size, number <= Math.round(value) ? "fill-accent text-accent" : "text-muted/30")} aria-hidden="true" />
      ))}
    </span>
  );
}

/** Approved reviews from every tour: a ruled rating summary, quiet filters and a two-column list. */
export default function ReviewsPage() {
  const { data, isLoading, isError, refetch } = useStorefrontReviews();
  const catalog = useCatalog();
  const reduceMotion = useReducedMotion();
  const [rating, setRating] = useState("all");
  const [destination, setDestination] = useState("all");
  const [tour, setTour] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const reviews = useMemo(() => data?.reviews ?? [], [data?.reviews]);
  const stats = data?.stats ?? { totalReviews: 0, averageRating: 0, ratingCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
  const destinations = useMemo(() => (catalog.data?.destinations ?? []).filter((item) => reviews.some((review) => review.destinationId === item.id)), [catalog.data, reviews]);
  const tours = useMemo(() => (catalog.data?.tours ?? []).filter((item) => reviews.some((review) => review.tourId === item.id)), [catalog.data, reviews]);

  const shown = useMemo(() => {
    const list = reviews.filter(
      (review) =>
        (rating === "all" || review.rating === Number(rating)) &&
        (destination === "all" || review.destinationId === destination) &&
        (tour === "all" || review.tourId === tour),
    );
    const byDate = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);
    return [...list].sort((a, b) =>
      sortBy === "rating-desc" ? b.rating - a.rating || byDate(a, b) : sortBy === "rating-asc" ? a.rating - b.rating || byDate(a, b) : byDate(a, b),
    );
  }, [reviews, rating, destination, tour, sortBy]);

  const filtered = rating !== "all" || destination !== "all" || tour !== "all";
  function clear() {
    setRating("all");
    setDestination("all");
    setTour("all");
  }

  return (
    <>
      <PageIntro breadcrumbs={[{ label: "Reviews" }]} eyebrow="Traveller reviews" title="What travellers say">
        Every review comes from a traveller with a completed booking, and we publish the critical ones too.
      </PageIntro>

      <section className="mx-auto max-w-[1320px] px-5 pb-24 lg:px-8" aria-label="Traveller reviews">
        {isLoading ? (
          <Skeleton className="mb-10 h-40 w-full rounded-card" />
        ) : (
          !isError && (
            <div className="mb-10 grid gap-8 border-y border-foreground/80 py-8 md:grid-cols-[240px_minmax(0,1fr)] md:items-center">
              <div>
                <p className="font-display text-7xl font-semibold leading-none tracking-[-0.04em] text-foreground">{stats.averageRating.toFixed(1)}</p>
                <div className="mt-3"><Stars value={stats.averageRating} /></div>
                <p className="mt-2 text-sm text-muted">Average of {stats.totalReviews} published reviews</p>
              </div>
              <ul className="space-y-2.5" aria-label="Reviews by rating">
                {[5, 4, 3, 2, 1].map((value) => {
                  const count = stats.ratingCounts[value] ?? 0;
                  const share = stats.totalReviews ? count / stats.totalReviews : 0;
                  return (
                    <li key={value}>
                      <button
                        type="button"
                        onClick={() => setRating(rating === String(value) ? "all" : String(value))}
                        aria-pressed={rating === String(value)}
                        disabled={!count}
                        className="group grid w-full grid-cols-[3rem_minmax(0,1fr)_2.5rem] items-center gap-3 rounded text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/60 disabled:cursor-default"
                      >
                        <span className={cn("text-left font-medium", rating === String(value) ? "text-primary-ink" : "text-foreground")}>{value} star</span>
                        <span className="h-2 overflow-hidden rounded-full bg-foreground/[0.08]">
                          <span className={cn("block h-full rounded-full transition-colors", rating === String(value) ? "bg-primary" : "bg-accent group-hover:bg-primary/80")} style={{ width: `${share * 100}%` }} />
                        </span>
                        <span className="text-right tabular-nums text-muted">{count}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )
        )}

        <div className="mb-8 flex flex-wrap items-center gap-3">
          <label className="sr-only" htmlFor="reviews-destination">Destination</label>
          <select id="reviews-destination" value={destination} onChange={(event) => setDestination(event.target.value)} className={select}>
            <option value="all">All destinations</option>
            {destinations.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <label className="sr-only" htmlFor="reviews-tour">Tour</label>
          <select id="reviews-tour" value={tour} onChange={(event) => setTour(event.target.value)} className={cn(select, "max-w-[16rem]")}>
            <option value="all">All tours</option>
            {tours.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          {filtered && (
            <button type="button" onClick={clear} className="rounded px-2 text-sm font-semibold text-primary-ink outline-none hover:underline focus-visible:ring-2 focus-visible:ring-primary/60">
              Clear filters
            </button>
          )}
          <span className="ml-auto flex items-center gap-3">
            <span className="text-sm text-muted" aria-live="polite">{shown.length} {shown.length === 1 ? "review" : "reviews"}</span>
            <label className="sr-only" htmlFor="reviews-sort">Sort reviews</label>
            <select id="reviews-sort" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className={select}>
              {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </span>
        </div>

        {isError ? (
          <EmptyState icon={MessageSquare} title="Reviews didn't load" description="Check your connection, then try again." action={<Button onClick={() => refetch()}>Try again</Button>} />
        ) : isLoading ? (
          <div className="grid gap-x-12 md:grid-cols-2">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="mb-8 h-40 w-full rounded-card" />)}</div>
        ) : shown.length === 0 ? (
          <EmptyState icon={MessageSquare} title="No reviews match" description="Try another rating, destination or tour." action={<Button onClick={clear}>Show all reviews</Button>} />
        ) : (
          <AnimatePresence mode="wait">
            <motion.ul
              key={`${rating}-${destination}-${tour}-${sortBy}`}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, transition: { duration: reduceMotion ? 0 : 0.15 } }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.04 } } }}
              className="grid gap-x-12 md:grid-cols-2"
            >
              {shown.map((review) => (
                <motion.li
                  key={review.id}
                  variants={{ hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.4, ease: motionEase } } }}
                  className="border-t border-border py-7"
                >
                  <article>
                    <div className="flex items-center justify-between gap-4">
                      <Stars value={review.rating} size="size-3.5" />
                      <time dateTime={review.createdAt} className="text-xs text-muted">{dateLabel.format(new Date(review.createdAt))}</time>
                    </div>
                    <p className="mt-4 text-[17px] leading-[1.65] text-pretty text-foreground">&ldquo;{review.comment}&rdquo;</p>
                    <footer className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                      <span className="grid size-8 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary-ink" aria-hidden="true">{review.initials}</span>
                      <span className="font-semibold text-foreground">{review.customerName}</span>
                      <span className="text-muted" aria-hidden="true">·</span>
                      {review.tourId ? (
                        <Link to={`/tours/${review.tourId}`} className="rounded text-primary-ink underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-primary/60">{review.tourName}</Link>
                      ) : (
                        <span className="text-muted">{review.tourName}</span>
                      )}
                    </footer>
                  </article>
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
        )}
      </section>
    </>
  );
}
