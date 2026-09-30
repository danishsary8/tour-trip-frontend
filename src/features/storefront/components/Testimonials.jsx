import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Skeleton } from "../../../components/shared/Skeleton";
import { cn } from "../../../lib/cn";
import { motionEase } from "../../../lib/motion";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const ADVANCE_MS = 6500;
const dateFormat = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });

function Stars({ rating }) {
  return (
    <span className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} className={cn("size-5", index < rating ? "fill-accent text-accent" : "text-border")} aria-hidden="true" />
      ))}
    </span>
  );
}

/**
 * Approved traveller reviews in a carousel: auto-advances (paused on hover/focus and under
 * reduced motion), arrow buttons, dots, keyboard arrows and swipe.
 */
export function Testimonials({ reviews = [], loading }) {
  const reduceMotion = useReducedMotion();
  const [[index, direction], setState] = useState([0, 1]);
  const [paused, setPaused] = useState(false);
  const count = reviews.length;

  const go = useCallback((delta) => setState(([current]) => [(current + delta + count) % count, delta]), [count]);

  useEffect(() => {
    if (reduceMotion || paused || count < 2) return undefined;
    const timer = window.setTimeout(() => go(1), ADVANCE_MS);
    return () => window.clearTimeout(timer);
  }, [index, paused, reduceMotion, count, go]);

  const review = reviews[index % Math.max(count, 1)];

  return (
    <section id="reviews" aria-labelledby="home-reviews" className="scroll-mt-24 bg-surface-2/60 py-24 sm:py-32">
      <div className="mx-auto max-w-[1320px] px-5 lg:px-8">
        <SectionHeading id="home-reviews" eyebrow="In their words" title="What travellers say" align="center">
          Approved reviews from guests who travelled with us this season.
        </SectionHeading>

        <Reveal
          className="relative mx-auto max-w-4xl"
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          {loading || !review ? (
            <div className="rounded-[32px] border border-border bg-surface p-8 sm:p-12" aria-hidden={loading}>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-4/5" />
                  <Skeleton className="h-12 w-56" />
                </div>
              ) : (
                <p className="text-center text-muted">Reviews will appear here once they are approved.</p>
              )}
            </div>
          ) : (
            <div
              role="region"
              aria-roledescription="carousel"
              aria-label="Traveller reviews"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight") go(1);
                if (event.key === "ArrowLeft") go(-1);
              }}
              className="relative overflow-hidden rounded-[32px] border border-border bg-surface shadow-soft outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
            >
              <Quote className="pointer-events-none absolute right-8 top-8 size-24 text-primary/10" aria-hidden="true" />
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.figure
                  key={review.id}
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${count}`}
                  custom={direction}
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * -60 }}
                  transition={{ duration: 0.45, ease: motionEase }}
                  drag={reduceMotion ? false : "x"}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.25}
                  onDragEnd={(_event, info) => {
                    if (info.offset.x < -60) go(1);
                    else if (info.offset.x > 60) go(-1);
                  }}
                  className="relative cursor-grab p-8 active:cursor-grabbing sm:p-12"
                >
                  <Stars rating={review.rating} />
                  <blockquote className="mt-6 font-display text-2xl font-medium leading-snug tracking-[-0.02em] text-pretty text-foreground sm:text-[32px] sm:leading-[1.25]">
                    “{review.quote}”
                  </blockquote>
                  <figcaption className="mt-8 flex flex-wrap items-center gap-4">
                    <span className="grid size-12 place-items-center rounded-full bg-gradient-to-br from-primary to-accent font-display text-sm font-bold text-white">{review.initials}</span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-foreground">{review.name}</span>
                      <span className="block text-sm text-muted">
                        {review.tourId ? (
                          <Link to={`/tours/${review.tourId}`} className="rounded font-medium text-primary-ink outline-none hover:underline focus-visible:ring-2 focus-visible:ring-accent/60">
                            {review.tourName}
                          </Link>
                        ) : (
                          review.tourName
                        )}{" "}
                        · {dateFormat.format(new Date(review.date))}
                      </span>
                    </span>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>
          )}

          {count > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous review"
                className="grid size-11 place-items-center rounded-full border border-border bg-surface text-foreground outline-none transition-[background-color,border-color,transform] duration-300 hover:border-primary/40 hover:bg-primary/[0.06] focus-visible:ring-2 focus-visible:ring-accent/70 active:scale-95"
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>
              <div className="flex gap-2" role="group" aria-label="Choose a review">
                {reviews.map((item, dotIndex) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setState([dotIndex, dotIndex > index ? 1 : -1])}
                    aria-label={`Review ${dotIndex + 1} by ${item.name}`}
                    aria-pressed={dotIndex === index}
                    className={cn(
                      "h-2 rounded-full outline-none transition-[width,background-color] duration-500 focus-visible:ring-2 focus-visible:ring-accent/70",
                      dotIndex === index ? "w-8 bg-primary" : "w-2 bg-foreground/20 hover:bg-foreground/40",
                    )}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next review"
                className="grid size-11 place-items-center rounded-full border border-border bg-surface text-foreground outline-none transition-[background-color,border-color,transform] duration-300 hover:border-primary/40 hover:bg-primary/[0.06] focus-visible:ring-2 focus-visible:ring-accent/70 active:scale-95"
              >
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
