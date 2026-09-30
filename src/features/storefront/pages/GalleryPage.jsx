import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Camera, Compass, MapPin, Maximize2, Tag, X } from "lucide-react";
import { EmptyState } from "../../../components/shared/EmptyState";
import { Lightbox } from "../../../components/shared/Lightbox";
import { Skeleton } from "../../../components/shared/Skeleton";
import { Button } from "../../../components/ui/Button";
import { cn } from "../../../lib/cn";
import { motionEase } from "../../../lib/motion";
import { PageIntro } from "../components/PageIntro";
import { useCatalog, useGallery } from "../hooks";

export default function GalleryPage() {
  const { data: photos = [], isLoading, isError, refetch } = useGallery();
  const catalog = useCatalog();
  const reduceMotion = useReducedMotion();

  const [activeDestination, setActiveDestination] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const destinations = useMemo(() => catalog.data?.destinations ?? [], [catalog.data]);
  const categories = useMemo(() => catalog.data?.categories ?? [], [catalog.data]);

  // Filter photos based on destination and category
  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      const matchDest = activeDestination === "all" || photo.destinationId === activeDestination;
      const matchCat = activeCategory === "all" || photo.categoryId === activeCategory;
      return matchDest && matchCat;
    });
  }, [photos, activeDestination, activeCategory]);

  const hasActiveFilters = activeDestination !== "all" || activeCategory !== "all";

  function clearFilters() {
    setActiveDestination("all");
    setActiveCategory("all");
  }

  function handleOpenLightbox(index) {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }

  return (
    <>
      <PageIntro
        breadcrumbs={[{ label: "Gallery" }]}
        eyebrow="Cambodia in Focus"
        title="Visual stories from the Kingdom"
        actions={
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold text-muted">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-1.5 shadow-xs">
              <Camera className="size-3.5 text-primary" aria-hidden="true" />
              <span>{photos.length} Captured Perspectives</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-1.5 shadow-xs">
              <Compass className="size-3.5 text-accent" aria-hidden="true" />
              <span>Click Any Photo to Expand</span>
            </span>
          </div>
        }
      >
        A curated collection of moments captured across ancient temple ruins, serene
        waterways, palm-fringed islands, and bustling night markets with local guides.
      </PageIntro>

      <section className="mx-auto max-w-[1320px] px-5 pb-24 lg:px-8" aria-label="Photo Gallery">
        {/* Filter Controls Bar */}
        <div className="mb-10 space-y-4 rounded-3xl border border-border/80 bg-surface/80 p-5 shadow-xs backdrop-blur-md sm:p-6">
          {/* Destination Filter Chips */}
          <div className="flex flex-col gap-2.5">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted">
              <MapPin className="size-3.5 text-primary" aria-hidden="true" />
              <span>Filter by Region</span>
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveDestination("all")}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-semibold outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary active:scale-95",
                  activeDestination === "all"
                    ? "bg-primary text-white shadow-xs"
                    : "border border-border bg-surface text-muted hover:border-foreground/30 hover:text-foreground"
                )}
              >
                All Regions ({photos.length})
              </button>
              {destinations.map((dst) => {
                const count = photos.filter((p) => p.destinationId === dst.id).length;
                if (count === 0) return null;
                const isSelected = activeDestination === dst.id;
                return (
                  <button
                    key={dst.id}
                    type="button"
                    onClick={() => setActiveDestination(isSelected ? "all" : dst.id)}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-xs font-semibold outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary active:scale-95",
                      isSelected
                        ? "bg-primary text-white shadow-xs"
                        : "border border-border bg-surface text-muted hover:border-foreground/30 hover:text-foreground"
                    )}
                  >
                    {dst.name} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category / Style Filter Chips */}
          <div className="flex flex-col gap-2.5 border-t border-border/60 pt-4">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted">
              <Tag className="size-3.5 text-accent" aria-hidden="true" />
              <span>Filter by Travel Style</span>
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={cn(
                  "rounded-full px-3.5 py-1 text-xs font-medium outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary active:scale-95",
                  activeCategory === "all"
                    ? "bg-surface-2 text-foreground font-semibold border border-foreground/30"
                    : "border border-border bg-surface text-muted hover:border-foreground/20 hover:text-foreground"
                )}
              >
                All Styles
              </button>
              {categories.map((cat) => {
                const count = photos.filter((p) => p.categoryId === cat.id).length;
                if (count === 0) return null;
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(isSelected ? "all" : cat.id)}
                    className={cn(
                      "rounded-full px-3.5 py-1 text-xs font-medium outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary active:scale-95",
                      isSelected
                        ? "bg-surface-2 text-foreground font-semibold border border-foreground/30"
                        : "border border-border bg-surface text-muted hover:border-foreground/20 hover:text-foreground"
                    )}
                  >
                    {cat.name} ({count})
                  </button>
                );
              })}

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-danger-ink hover:underline focus-visible:ring-2 focus-visible:ring-primary/60 outline-none rounded"
                >
                  <X className="size-3.5" aria-hidden="true" />
                  <span>Clear filters</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Info Counter */}
        <div className="mb-6 flex items-center justify-between text-xs text-muted">
          <span>
            Showing <strong className="text-foreground">{filteredPhotos.length}</strong>{" "}
            {filteredPhotos.length === 1 ? "photo" : "photos"}
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs text-primary-ink font-medium hover:underline outline-none"
            >
              Reset to all photos
            </button>
          )}
        </div>

        {/* Gallery Grid */}
        {isError ? (
          <EmptyState
            icon={Camera}
            title="Gallery photos could not be loaded"
            description="We were unable to load the photo collection. Please try again."
            action={<Button onClick={() => refetch()}>Try again</Button>}
          />
        ) : isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading photos">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="aspect-[4/3] rounded-3xl overflow-hidden">
                <Skeleton className="size-full rounded-3xl" />
              </div>
            ))}
          </div>
        ) : filteredPhotos.length === 0 ? (
          <EmptyState
            icon={Camera}
            title="No photos match your filters"
            description="Try selecting another region or style to see more photos from the journey."
            action={<Button onClick={clearFilters}>Clear filters</Button>}
          />
        ) : (
          <AnimatePresence mode="wait">
            <motion.ul
              key={`${activeDestination}-${activeCategory}`}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, transition: { duration: reduceMotion ? 0 : 0.15 } }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.05 } } }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filteredPhotos.map((photo, index) => (
                <motion.li
                  key={photo.id}
                  variants={{
                    hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: reduceMotion ? 0 : 0.45, ease: motionEase },
                    },
                  }}
                  className="group relative"
                >
                  <button
                    type="button"
                    onClick={() => handleOpenLightbox(index)}
                    aria-label={`View photo in full size: ${photo.title} in ${photo.destination}`}
                    className="relative flex aspect-[4/3] w-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-surface shadow-sm outline-none transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-0 active:scale-[0.99] text-left cursor-pointer"
                  >
                    {/* Photo with subtle hover zoom */}
                    <img
                      src={photo.src}
                      alt={photo.title}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
                    />

                    {/* Gradient Overlay */}
                    <span
                      className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-85 transition-opacity duration-300 group-hover:opacity-95"
                      aria-hidden="true"
                    />

                    {/* Top Badges */}
                    <div className="relative z-10 flex items-center justify-between p-4 sm:p-5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-0.5 text-[11px] font-semibold text-white/90 backdrop-blur-md border border-white/10">
                        <MapPin className="size-3 text-accent" aria-hidden="true" />
                        {photo.destination}
                      </span>

                      <span
                        className="grid size-8 place-items-center rounded-full bg-white/20 text-white shadow-sm backdrop-blur-md border border-white/20 opacity-0 transition-[opacity,transform] duration-200 group-hover:opacity-100 group-hover:scale-105"
                        aria-hidden="true"
                      >
                        <Maximize2 className="size-4" />
                      </span>
                    </div>

                    {/* Bottom Caption Overlay */}
                    <div className="relative z-10 mt-auto p-4 sm:p-5 text-white">
                      <h3 className="font-display text-lg font-bold tracking-tight text-white drop-shadow-sm truncate">
                        {photo.title}
                      </h3>
                      <p className="mt-1 text-xs text-white/80 line-clamp-1">
                        {photo.caption}
                      </p>
                    </div>
                  </button>
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
        )}
      </section>

      {/* Shared Lightbox */}
      <Lightbox
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        items={filteredPhotos}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
      />
    </>
  );
}
