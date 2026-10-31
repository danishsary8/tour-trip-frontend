import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Camera } from "lucide-react";
import { EmptyState } from "../../../components/shared/EmptyState";
import { Lightbox } from "../../../components/shared/Lightbox";
import { Skeleton } from "../../../components/shared/Skeleton";
import { Button } from "../../../components/ui/Button";
import { cn } from "../../../lib/cn";
import { motionEase } from "../../../lib/motion";
import { PageIntro } from "../components/PageIntro";
import { useCatalog, useGallery } from "../hooks";

const chip = (active) =>
  cn(
    "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/60 active:scale-[0.97]",
    active ? "bg-foreground text-background" : "text-muted hover:bg-foreground/[0.06] hover:text-foreground",
  );

/** A row of quiet filter chips with a label; scrolls sideways on small screens. */
function FilterRow({ label, options, value, onChange }) {
  return (
    <div className="flex items-center gap-4 border-b border-border py-3">
      <span className="w-14 shrink-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{label}</span>
      <div className="-mr-5 flex gap-1 overflow-x-auto pr-5 [scrollbar-width:none] lg:mr-0 lg:flex-wrap lg:pr-0 [&::-webkit-scrollbar]:hidden" role="group" aria-label={`Filter photos by ${label.toLowerCase()}`}>
        {options.map((option) => (
          <button key={option.id} type="button" aria-pressed={value === option.id} onClick={() => onChange(option.id)} className={chip(value === option.id)}>
            {option.name}
            {option.count !== undefined && <span className="ml-1.5 text-xs tabular-nums opacity-60">{option.count}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Gallery: every photo from every tour, unboxed in a masonry of natural aspect ratios, each
 * captioned with what it shows and which tour goes there. Filters by place and travel style.
 */
export default function GalleryPage() {
  const { data: photos = [], isLoading, isError, refetch } = useGallery();
  const catalog = useCatalog();
  const reduceMotion = useReducedMotion();
  const [place, setPlace] = useState("all");
  const [style, setStyle] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const destinations = useMemo(() => catalog.data?.destinations ?? [], [catalog.data]);
  const categories = useMemo(() => catalog.data?.categories ?? [], [catalog.data]);
  const shown = useMemo(
    () => photos.filter((photo) => (place === "all" || photo.destinationId === place) && (style === "all" || photo.categoryId === style)),
    [photos, place, style],
  );

  const placeOptions = [
    { id: "all", name: "Everywhere", count: photos.length },
    ...destinations.map((item) => ({ id: item.id, name: item.name, count: photos.filter((photo) => photo.destinationId === item.id).length })).filter((item) => item.count),
  ];
  const styleOptions = [
    { id: "all", name: "All styles" },
    ...categories.map((item) => ({ id: item.id, name: item.name, count: photos.filter((photo) => photo.categoryId === item.id).length })).filter((item) => item.count),
  ];
  const clear = () => {
    setPlace("all");
    setStyle("all");
  };

  return (
    <>
      <PageIntro
        breadcrumbs={[{ label: "Gallery" }]}
        eyebrow="Gallery"
        title="Photographs from the road"
        aside={!isLoading && <p className="text-sm text-muted"><span className="font-display text-4xl font-semibold text-foreground">{photos.length}</span> photos, {destinations.length} destinations</p>}
      >
        Real photographs of the places our tours go, from Angkor at dawn to Kyoto&apos;s torii gates. Open any photo to see it full size, or follow it to the tour.
      </PageIntro>

      <section className="mx-auto max-w-[1320px] px-5 pb-24 lg:px-8" aria-label="Photo gallery">
        <div className="mb-10 border-t border-foreground/80">
          <FilterRow label="Where" options={placeOptions} value={place} onChange={setPlace} />
          <FilterRow label="Style" options={styleOptions} value={style} onChange={setStyle} />
        </div>

        {isError ? (
          <EmptyState
            icon={Camera}
            title="The gallery didn't load"
            description="Check your connection, then try again."
            action={<Button onClick={() => refetch()}>Try again</Button>}
          />
        ) : isLoading ? (
          <div className="columns-1 gap-6 sm:columns-2 lg:columns-3" aria-label="Loading photos">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className={cn("mb-8 w-full rounded-card", index % 2 ? "aspect-[3/4]" : "aspect-[4/3]")} />
            ))}
          </div>
        ) : shown.length === 0 ? (
          <EmptyState
            icon={Camera}
            title="No photos for that combination"
            description="Pick another place or style, or show every photo."
            action={<Button onClick={clear}>Show all photos</Button>}
          />
        ) : (
          <AnimatePresence mode="wait">
            <motion.ul
              key={`${place}-${style}`}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, transition: { duration: reduceMotion ? 0 : 0.15 } }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.04 } } }}
              className="columns-1 gap-6 sm:columns-2 lg:columns-3"
            >
              {shown.map((photo, index) => (
                <motion.li
                  key={photo.id}
                  variants={{
                    hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 },
                    visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.4, ease: motionEase } },
                  }}
                  className="mb-8 break-inside-avoid"
                >
                  <figure>
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(index)}
                      aria-label={`View full size: ${photo.caption}`}
                      className="group block w-full overflow-hidden rounded-card bg-surface-2 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <img
                        src={photo.src}
                        alt={photo.caption}
                        width={photo.width}
                        height={photo.height}
                        loading={index < 6 ? "eager" : "lazy"}
                        decoding="async"
                        className="h-auto w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transition-none"
                      />
                    </button>
                    <figcaption className="mt-3 flex items-baseline justify-between gap-4">
                      <span className="min-w-0">
                        <span className="block font-display text-base font-semibold text-foreground">{photo.title}</span>
                        <span className="text-xs text-muted">{photo.destination}</span>
                      </span>
                      <Link to={`/tours/${photo.tourId}`} className="shrink-0 rounded text-xs font-semibold text-primary-ink underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-primary/60">
                        See the tour
                      </Link>
                    </figcaption>
                  </figure>
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
        )}
      </section>

      <Lightbox open={lightboxIndex !== null} onClose={() => setLightboxIndex(null)} items={shown} index={lightboxIndex ?? 0} onIndexChange={setLightboxIndex} />
    </>
  );
}
