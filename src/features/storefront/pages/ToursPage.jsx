import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CalendarDays, Compass, Search, SlidersHorizontal, Users, X } from "lucide-react";
import { Drawer } from "../../../components/shared/Drawer";
import { EmptyState } from "../../../components/shared/EmptyState";
import { Button } from "../../../components/ui/Button";
import { cn } from "../../../lib/cn";
import { formatUsd } from "../../../lib/format";
import { motionEase } from "../../../lib/motion";
import { FilterPanel } from "../components/FilterPanel";
import { PageIntro } from "../components/PageIntro";
import { RecentlyViewed } from "../components/RecentlyViewed";
import { TourCard, TourCardSkeleton } from "../components/TourCard";
import { FILTER_KEYS, SORT_OPTIONS, applyFilters, countActiveFilters, parseFilters, priceBounds, withFilters } from "../filters";
import { useCatalog } from "../hooks";

const PAGE_SIZE = 6;
const shortDate = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });

function Chip({ children, onRemove, label }) {
  return (
    <motion.li layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.25 }}>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove filter: ${label}`}
        className="group inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/[0.08] py-1.5 pl-3.5 pr-2.5 text-sm font-medium text-primary-ink outline-none transition-colors duration-200 hover:border-primary/45 hover:bg-primary/15 focus-visible:ring-2 focus-visible:ring-primary/60 active:scale-95"
      >
        {children}
        <X className="size-3.5 transition-transform duration-200 group-hover:rotate-90" aria-hidden="true" />
      </button>
    </motion.li>
  );
}

/** Search debounced into the URL so typing doesn't create a history entry per key. */
function SearchBox({ value, onCommit }) {
  const [draft, setDraft] = useState(value);
  const [prev, setPrev] = useState(value);
  if (value !== prev) {
    setPrev(value);
    setDraft(value);
  }
  useEffect(() => {
    if (draft === value) return undefined;
    const timer = window.setTimeout(() => onCommit(draft), 300);
    return () => window.clearTimeout(timer);
  }, [draft, value, onCommit]);

  return (
    <label className="relative block min-w-0 flex-1 sm:max-w-sm">
      <span className="sr-only">Search tours</span>
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
      <input
        type="search"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Search tours, places or styles"
        className="h-12 w-full rounded-full border border-border bg-surface pl-11 pr-4 text-[15px] text-foreground outline-none transition-colors placeholder:text-muted hover:border-foreground/25 focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}

/** Search & Tour Listing: URL-driven filters, sort, chips, load more, and a mobile filter drawer. */
export default function ToursPage() {
  const [params, setParams] = useSearchParams();
  const catalog = useCatalog();
  const reduceMotion = useReducedMotion();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const filters = useMemo(() => parseFilters(params), [params]);

  const tours = useMemo(() => catalog.data?.tours ?? [], [catalog.data]);
  const destinations = catalog.data?.destinations ?? [];
  const categories = catalog.data?.categories ?? [];
  const bounds = useMemo(() => priceBounds(tours), [tours]);
  const results = useMemo(() => applyFilters(tours, filters), [tours, filters]);
  const activeCount = countActiveFilters(filters);

  // Visible count resets whenever the filter/sort combination changes.
  const signature = [...FILTER_KEYS, "sort"].map((key) => params.get(key) ?? "").join("|");
  const [visible, setVisible] = useState({ signature, count: PAGE_SIZE });
  if (visible.signature !== signature) setVisible({ signature, count: PAGE_SIZE });
  const shown = results.slice(0, visible.count);

  function update(changes) {
    setParams((current) => withFilters(current, changes), { replace: true });
  }

  function clearFilters() {
    setParams((current) => withFilters(current, Object.fromEntries(FILTER_KEYS.map((key) => [key, ""]))), { replace: true });
  }

  const nameOf = (list, id) => {
    const norm = id.toLowerCase();
    return list.find((item) => item.id === id || item.id === norm || item.id === norm.replace(/ /g, "-") || item.name.toLowerCase() === norm)?.name ?? id;
  };
  const chips = [
    filters.q && { key: "q", label: `“${filters.q}”`, remove: () => update({ q: "" }) },
    ...filters.destination.map((id) => ({ key: `d-${id}`, label: nameOf(destinations, id), remove: () => update({ destination: filters.destination.filter((value) => value !== id) }) })),
    ...filters.category.map((id) => ({ key: `c-${id}`, label: nameOf(categories, id), remove: () => update({ category: filters.category.filter((value) => value !== id) }) })),
    (filters.min !== null || filters.max !== null) && {
      key: "price",
      label: `${formatUsd(filters.min ?? bounds.min)} – ${formatUsd(filters.max ?? bounds.max)}`,
      remove: () => update({ min: null, max: null }),
    },
    filters.duration && { key: "duration", label: filters.duration === "day" ? "Day trips" : "2–3 days", remove: () => update({ duration: "" }) },
    filters.rating && { key: "rating", label: `${filters.rating}★ & up`, remove: () => update({ rating: "" }) },
  ].filter(Boolean);

  const panel = (
    <FilterPanel filters={filters} onChange={update} destinations={destinations} categories={categories} bounds={bounds} />
  );

  return (
    <>
      <PageIntro breadcrumbs={[{ label: "Tours" }]} eyebrow="Search tours" title="Find your Cambodia">
        {catalog.isLoading
          ? "Loading tours…"
          : `${tours.length} small-group tours across ${destinations.filter((item) => item.tourCount).length} destinations. Filter by place, style, price and length.`}
      </PageIntro>

      <div className="mx-auto grid max-w-[1320px] gap-10 px-5 pb-24 lg:grid-cols-[272px_minmax(0,1fr)] lg:px-8">
        <aside aria-label="Filters" className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto rounded-panel border border-border bg-surface p-6 [scrollbar-width:thin]">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-foreground">Filters</h2>
              {activeCount > 0 && (
                <button type="button" onClick={clearFilters} className="rounded text-sm font-semibold text-primary-ink outline-none hover:underline focus-visible:ring-2 focus-visible:ring-primary/60">
                  Clear all
                </button>
              )}
            </div>
            {panel}
          </div>
        </aside>

        <section aria-labelledby="tour-results" className="min-w-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchBox value={filters.q} onCommit={(q) => update({ q })} />
            <div className="flex gap-2 sm:ml-auto">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full border border-border bg-surface px-5 text-sm font-semibold text-foreground outline-none transition-colors hover:border-foreground/25 focus-visible:ring-2 focus-visible:ring-primary/60 active:scale-[0.98] lg:hidden"
              >
                <SlidersHorizontal className="size-4" aria-hidden="true" /> Filters
                {activeCount > 0 && <span className="grid size-5 place-items-center rounded-full bg-primary text-[11px] font-bold text-white">{activeCount}</span>}
              </button>
              <label className="relative min-w-0 flex-1 sm:flex-none">
                <span className="sr-only">Sort tours</span>
                <select
                  value={filters.sort}
                  onChange={(event) => update({ sort: event.target.value })}
                  className="h-12 w-full cursor-pointer appearance-none rounded-full border border-border bg-surface pl-5 pr-10 text-sm font-semibold text-foreground outline-none transition-colors hover:border-foreground/25 focus-visible:ring-2 focus-visible:ring-primary/60"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <SlidersHorizontal className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
              </label>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
            <h2 id="tour-results" className="text-sm text-muted" aria-live="polite">
              {catalog.isLoading ? (
                "Finding tours…"
              ) : (
                <>
                  <span className="font-semibold text-foreground">{results.length}</span> {results.length === 1 ? "tour" : "tours"} found
                </>
              )}
            </h2>
            {(filters.date || filters.travelers) && (
              <p className="inline-flex flex-wrap items-center gap-3 text-sm text-muted">
                {filters.date && (
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="size-4" aria-hidden="true" /> {shortDate.format(new Date(`${filters.date}T00:00:00Z`))}
                  </span>
                )}
                {filters.travelers && (
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="size-4" aria-hidden="true" /> {filters.travelers} {filters.travelers === "1" ? "traveller" : "travellers"}
                  </span>
                )}
                <span className="text-xs">· Tours run daily; availability is confirmed when you book.</span>
              </p>
            )}
          </div>

          {chips.length > 0 && (
            <ul className="mt-4 flex flex-wrap items-center gap-2" aria-label="Active filters">
              <AnimatePresence initial={false}>
                {chips.map((chip) => (
                  <Chip key={chip.key} label={chip.label} onRemove={chip.remove}>
                    {chip.label}
                  </Chip>
                ))}
              </AnimatePresence>
              <li>
                <button type="button" onClick={clearFilters} className="rounded px-2 py-1.5 text-sm font-semibold text-muted outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/60">
                  Clear all
                </button>
              </li>
            </ul>
          )}

          <div className="mt-8">
            {catalog.isError ? (
              <EmptyState
                icon={Compass}
                title="Tours could not be loaded"
                description="Please check your connection and try again."
                action={<Button onClick={() => catalog.refetch()}>Try again</Button>}
              />
            ) : catalog.isLoading ? (
              <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3" aria-label="Loading tours">
                {Array.from({ length: PAGE_SIZE }, (_, index) => (
                  <li key={index}>
                    <TourCardSkeleton />
                  </li>
                ))}
              </ul>
            ) : results.length === 0 ? (
              <EmptyState
                icon={Compass}
                title="No tours match your filters"
                description="Try another destination or style, widen the price range, or clear everything to see all tours."
                action={<Button onClick={clearFilters}>Clear filters</Button>}
              />
            ) : (
              <AnimatePresence mode="wait" initial={false}>
                {/* Re-keyed per filter combination so results fade out and re-stagger in. */}
                <motion.ul
                  key={signature}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, transition: { duration: reduceMotion ? 0 : 0.15 } }}
                  variants={{ hidden: {}, visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.06 } } }}
                  className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                >
                  {shown.map((tour, index) => (
                    <motion.li
                      key={tour.id}
                      layout={reduceMotion ? false : "position"}
                      variants={{
                        hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 },
                        visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.45, ease: motionEase } },
                      }}
                    >
                      <TourCard tour={tour} priority={index < 3} />
                    </motion.li>
                  ))}
                </motion.ul>
              </AnimatePresence>
            )}
          </div>

          {results.length > 0 && !catalog.isLoading && (
            <div className="mt-12 flex flex-col items-center gap-3">
              <p className="text-sm text-muted">
                Showing {shown.length} of {results.length} tours
              </p>
              {shown.length < results.length && (
                <Button variant="outline" onClick={() => setVisible({ signature, count: visible.count + PAGE_SIZE })} className="rounded-full bg-surface px-8 hover:bg-foreground/[0.05]">
                  Load more tours
                </Button>
              )}
              <div className="h-1 w-40 overflow-hidden rounded-full bg-foreground/10" aria-hidden="true">
                <div className={cn("h-full rounded-full bg-primary transition-[width] duration-500")} style={{ width: `${(shown.length / results.length) * 100}%` }} />
              </div>
            </div>
          )}
        </section>
      </div>

      <RecentlyViewed tours={tours} className="border-t border-border pb-24 pt-14 sm:pb-28" />

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Filters"
        description={`${results.length} ${results.length === 1 ? "tour" : "tours"} match`}
        footer={
          <>
            <Button variant="outline" onClick={clearFilters} disabled={!activeCount} className="bg-transparent hover:bg-foreground/[0.06]">
              Clear all
            </Button>
            <Button onClick={() => setDrawerOpen(false)}>
              Show {results.length} {results.length === 1 ? "tour" : "tours"}
            </Button>
          </>
        }
      >
        {panel}
      </Drawer>
    </>
  );
}
