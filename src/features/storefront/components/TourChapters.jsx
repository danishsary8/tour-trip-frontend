import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight, BedDouble, Binoculars, Camera, Car, Check, Church, Clock3, Coffee, Compass, Droplets, Expand, Fish, Footprints,
  Hammer, House, Landmark, Languages, Leaf, MapPin, Minus, Moon, Mountain, Plane, Sailboat, Ship, ShoppingBasket, Soup, Sparkles,
  Star, Sun, Sunrise, Sunset, TrainFront, TreePine, Users, Utensils, Wheat, Waves,
} from "lucide-react";
import { cn } from "../../../lib/cn";
import { formatUsd } from "../../../lib/format";
import { readableDeparture, seatTone, seatsLeft } from "../booking";
import { CANCELLATION_WINDOW } from "../content";
import { coordinatesOf } from "../places";
import { Breadcrumbs } from "./Breadcrumbs";
import { Reveal, RevealItem } from "./Reveal";
import { RouteMark } from "./RouteMark";

const HIGHLIGHT_ICONS = {
  BedDouble, Binoculars, Camera, Car, Church, Coffee, Compass, Droplets, Fish, Footprints, Hammer, House, Landmark, Leaf, MapPin,
  Moon, Mountain, Plane, Sailboat, Ship, ShoppingBasket, Soup, Sparkles, Sunrise, Sunset, TrainFront, TreePine, Users, Utensils, Wheat, Waves,
};

/** The chapters in reading order; the sticky nav and the scroll-spy use the same list. */
const CHAPTERS = [
  { id: "overview", label: "Overview" },
  { id: "highlights", label: "Highlights" },
  { id: "photos", label: "Photos" },
  { id: "itinerary", label: "Itinerary" },
  { id: "included", label: "What's included" },
  { id: "departures", label: "Departures" },
  { id: "reviews", label: "Reviews" },
];

/* ------------------------------------------------------------------ hero */

/**
 * Full-bleed cover with the title set over it. Always dark (the `dark` class scopes the dark
 * tokens) because it sits on photography; the facts strip carries what people scan for first.
 */
export function TourHero({ tour, cover, photoCount, onOpenPhotos }) {
  const reduceMotion = useReducedMotion();
  const coordinates = coordinatesOf(tour.id);
  const where = tour.international ? `${tour.destination}, ${tour.country}` : tour.destination;
  const facts = [
    { label: "Length", value: tour.durationLabel },
    { label: "Group", value: `Up to ${tour.groupSize}` },
    { label: "Rated", value: tour.rating ? `${tour.rating.toFixed(1)} · ${tour.reviewCount} review${tour.reviewCount === 1 ? "" : "s"}` : "New tour" },
  ];

  return (
    <section aria-labelledby="tour-title" className="dark relative isolate flex min-h-[600px] items-end overflow-hidden bg-background text-foreground h-[88svh] max-h-[900px]">
      <motion.img
        src={cover.src}
        alt={cover.alt}
        fetchPriority="high"
        initial={reduceMotion ? false : { scale: 1.06, opacity: 0.6 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 1.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 -z-20 size-full object-cover"
      />
      <span className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(5,10,12,.62)_0%,rgba(5,10,12,.08)_26%,rgba(5,10,12,.18)_50%,rgba(5,10,12,.9)_100%)]" aria-hidden="true" />

      <Reveal stagger className="mx-auto w-full max-w-[1320px] px-5 pb-10 pt-28 sm:pb-14 lg:px-8">
        <RevealItem>
          <Breadcrumbs className="mb-8 text-white/75 [&_[aria-current]]:text-white" items={[{ label: "Tours", to: "/tours" }, { label: tour.destination, to: `/tours?destination=${tour.destinationId}` }, { label: tour.name }]} />
        </RevealItem>
        <RevealItem as="p" className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          <RouteMark tone="light" />
          <span>{tour.category}</span>
          <span className="text-white/45" aria-hidden="true">/</span>
          <span className="text-white/90">{where}</span>
        </RevealItem>
        <RevealItem as="h1" id="tour-title" className="max-w-5xl font-display text-[clamp(2.6rem,7vw,6.25rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-balance text-white">
          {tour.name}
        </RevealItem>
        <RevealItem as="p" className="mt-5 max-w-2xl text-base leading-relaxed text-pretty text-white/80 sm:text-lg">
          {tour.tagline}
        </RevealItem>

        <RevealItem className="mt-10 flex flex-col gap-6 border-t border-white/20 pt-6 lg:flex-row lg:items-end lg:justify-between">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-4 sm:flex sm:flex-wrap sm:gap-x-0">
            {facts.map((fact) => (
              <div key={fact.label} className="sm:border-l sm:border-white/20 sm:px-6 sm:first:border-l-0 sm:first:pl-0">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">{fact.label}</dt>
                <dd className="mt-1 text-sm font-semibold text-white sm:text-base">{fact.value}</dd>
              </div>
            ))}
            <div className="sm:border-l sm:border-white/20 sm:px-6">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">From</dt>
              <dd className="mt-1 text-sm text-white sm:text-base">
                <strong className="font-display text-xl font-semibold tabular-nums sm:text-2xl">{formatUsd(tour.price)}</strong> <span className="text-white/70">/ person</span>
              </dd>
            </div>
          </dl>
          <div className="flex flex-wrap items-center gap-4">
            {coordinates && <p className="text-xs tabular-nums tracking-wide text-white/65">{coordinates}</p>}
            {photoCount > 1 && (
              <button
                type="button"
                onClick={onOpenPhotos}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md outline-none transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-accent active:scale-[0.98]"
              >
                <Expand className="size-4" aria-hidden="true" /> All {photoCount} photos
              </button>
            )}
          </div>
        </RevealItem>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ chapter nav */

/** Sticky in-page navigation with scroll-spy. Anchors work without JS; with it they scroll smoothly. */
export function ChapterNav({ chapters = CHAPTERS }) {
  const [active, setActive] = useState(chapters[0].id);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const sections = chapters.map((chapter) => document.getElementById(chapter.id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-140px 0px -55% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [chapters]);

  function go(event, id) {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
    setActive(id);
  }

  return (
    <nav aria-label="Tour sections" className="sticky top-[72px] z-30 border-b border-border bg-background/92 backdrop-blur-xl">
      <ol className="mx-auto flex max-w-[1320px] gap-1 overflow-x-auto px-3 [scrollbar-width:none] lg:px-6 [&::-webkit-scrollbar]:hidden">
        {chapters.map((chapter) => (
          <li key={chapter.id} className="shrink-0">
            <a
              href={`#${chapter.id}`}
              onClick={(event) => go(event, chapter.id)}
              aria-current={active === chapter.id ? "location" : undefined}
              className={cn(
                "relative block rounded-md px-3 py-4 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/60",
                active === chapter.id ? "text-foreground" : "text-muted hover:text-foreground",
              )}
            >
              {chapter.label}
              {active === chapter.id && (
                <motion.span layoutId="chapter-underline" className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary" transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }} />
              )}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ------------------------------------------------------------------ chapters */

function Chapter({ id, eyebrow, title, aside, children, className }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("scroll-mt-36 border-t border-border pt-12 sm:pt-14", className)}>
      <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary-ink">
            <RouteMark />
            {eyebrow}
          </p>
          <h2 id={`${id}-title`} className="font-display text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-balance text-foreground sm:text-[40px]">
            {title}
          </h2>
        </div>
        {aside}
      </Reveal>
      {children}
    </section>
  );
}

export function OverviewChapter({ tour, story }) {
  const facts = [
    { icon: Clock3, label: "Length", value: tour.durationLabel },
    { icon: Users, label: "Group size", value: `Up to ${tour.groupSize} travellers` },
    { icon: Languages, label: "Guided in", value: story.languages.join(", ") },
    { icon: MapPin, label: "Meeting point", value: story.meetingPoint },
  ];
  return (
    <section id="overview" aria-labelledby="overview-title" className="scroll-mt-36 pt-12 sm:pt-16">
      <h2 id="overview-title" className="sr-only">Overview</h2>
      <Reveal>
        <p className="text-xl leading-[1.6] text-pretty text-foreground sm:text-[22px]">{story.overview}</p>
      </Reveal>
      <Reveal as="dl" stagger className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
        {facts.map(({ icon: Icon, label, value }) => (
          <RevealItem key={label} className="border-t border-foreground/80 pt-3">
            <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              <Icon className="size-3.5" aria-hidden="true" /> {label}
            </dt>
            <dd className="mt-1.5 text-sm font-semibold leading-snug text-foreground">{value}</dd>
          </RevealItem>
        ))}
      </Reveal>
    </section>
  );
}

export function HighlightsChapter({ highlights }) {
  return (
    <Chapter id="highlights" eyebrow="At a glance" title="Why this one is worth it">
      <Reveal as="ul" stagger className="grid gap-x-10 sm:grid-cols-2">
        {highlights.map(([icon, text]) => {
          const Icon = HIGHLIGHT_ICONS[icon] ?? Compass;
          return (
            <RevealItem as="li" key={text} className="flex items-center gap-4 border-b border-border py-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full border border-primary/25 bg-primary/[0.06] text-primary-ink">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="text-[15px] font-medium leading-snug text-foreground">{text}</span>
            </RevealItem>
          );
        })}
      </Reveal>
    </Chapter>
  );
}

/** Editorial mosaic: the lead photo large, two beside it; every tile opens the lightbox. */
export function PhotosChapter({ photos, onOpen }) {
  const tiles = photos.slice(0, 3);
  const extra = photos.length - tiles.length;
  const tile =
    "group relative block overflow-hidden rounded-card bg-surface-2 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";
  return (
    <Chapter id="photos" eyebrow="In pictures" title="What you'll see">
      <Reveal className={cn("grid gap-3", tiles.length >= 3 ? "grid-cols-2 sm:h-[460px] sm:grid-cols-3 sm:grid-rows-2" : tiles.length === 2 ? "sm:grid-cols-2" : "")}>
        {tiles.map((photo, index) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => onOpen(index)}
            aria-label={`Open photo ${index + 1} of ${photos.length}: ${photo.alt}`}
            className={cn(tile, tiles.length >= 3 && index === 0 ? "col-span-2 aspect-[16/10] sm:row-span-2 sm:aspect-auto" : "aspect-[4/3] sm:aspect-auto", tiles.length < 3 && "aspect-[16/10]")}
          >
            <img src={photo.src} alt="" loading="lazy" decoding="async" className="size-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] motion-reduce:transition-none" />
            {index === tiles.length - 1 && extra > 0 && (
              <span className="absolute inset-0 grid place-items-center bg-black/45 font-display text-2xl font-semibold text-white">+{extra}</span>
            )}
          </button>
        ))}
      </Reveal>
      <p className="mt-3 text-sm text-muted">{photos[0]?.alt}</p>
    </Chapter>
  );
}

/** The route rail: a dashed line joining each day's waypoint, like the logo's flight path. */
export function ItineraryChapter({ days }) {
  const single = days.length === 1;
  return (
    <Chapter id="itinerary" eyebrow={single ? "The day" : "Day by day"} title={single ? "How the day unfolds" : `${days.length} days, step by step`}>
      <Reveal as="ol" stagger className="relative">
        {days.map((day, index) => (
          <RevealItem as="li" key={`${index}-${day.title}`} className="relative grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-5 pb-10 last:pb-0">
            {index < days.length - 1 && <span className="absolute bottom-0 left-7 top-14 border-l-[1.5px] border-dashed border-primary/45" aria-hidden="true" />}
            <span className="relative z-10 grid size-14 place-items-center rounded-full border border-primary/30 bg-background text-center">
              {single ? (
                <Sun className="size-5 text-primary-ink" aria-hidden="true" />
              ) : (
                <span className="leading-none">
                  <span className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-muted">Day</span>
                  <span className="mt-0.5 block font-display text-lg font-semibold tabular-nums text-primary-ink">{index + 1}</span>
                </span>
              )}
            </span>
            <div className="pt-2.5">
              <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-foreground">{day.title}</h3>
              <p className="mt-2 max-w-prose text-[15px] leading-7 text-muted">{day.description}</p>
            </div>
          </RevealItem>
        ))}
      </Reveal>
      <p className="mt-8 text-sm text-muted">Your guide may change the order for weather or the best light.</p>
    </Chapter>
  );
}

export function IncludedChapter({ included, excluded }) {
  return (
    <Chapter id="included" eyebrow="The details" title="What's included">
      <div className="grid gap-10 sm:grid-cols-2 sm:gap-0">
        <div className="sm:pr-10">
          <h3 className="text-sm font-semibold text-foreground">Included in the price</h3>
          <ul className="mt-4 divide-y divide-border border-t border-border">
            {included.map((item) => (
              <li key={item} className="flex items-start gap-3 py-3 text-[15px] leading-relaxed text-foreground">
                <Check className="mt-1 size-4 shrink-0 text-success-ink" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="sm:border-l sm:border-border sm:pl-10">
          <h3 className="text-sm font-semibold text-foreground">Not included</h3>
          <ul className="mt-4 divide-y divide-border border-t border-border">
            {excluded.map((item) => (
              <li key={item} className="flex items-start gap-3 py-3 text-[15px] leading-relaxed text-muted">
                <Minus className="mt-1 size-4 shrink-0" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Chapter>
  );
}

/** Upcoming departures as a list; choosing one selects it in the booking card (or opens the mobile sheet). */
export function DeparturesChapter({ tour, selection }) {
  const { future, selected, choose, setOpen } = selection;
  function pick(schedule) {
    choose(schedule);
    if (!window.matchMedia("(min-width: 1024px)").matches) setOpen(true);
  }
  return (
    <Chapter id="departures" eyebrow="Dates" title="Upcoming departures" aside={<p className="text-sm text-muted">Free cancellation up to {CANCELLATION_WINDOW} before.</p>}>
      {future.length ? (
        <ul className="divide-y divide-border border-y border-border">
          {future.slice(0, 6).map((schedule) => {
            const left = seatsLeft(schedule);
            const active = selected?.id === schedule.id;
            return (
              <li key={schedule.id} className={cn("grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 py-4 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto]", active && "bg-primary/[0.05]")}>
                <div className="pl-1">
                  <p className="font-display text-lg font-semibold text-foreground">{readableDeparture(schedule.date)}</p>
                  <p className="text-sm text-muted">Departs {schedule.time} · {formatUsd(schedule.priceOverride ?? tour.price)} / person</p>
                </div>
                <div className="col-span-2 row-start-2 sm:col-span-1 sm:row-start-auto">
                  <p className="text-xs font-medium text-muted">{left ? `${left} of ${schedule.capacity} seats left` : "Sold out"}</p>
                  <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-border" aria-hidden="true">
                    <span className={cn("block h-full rounded-full", seatTone(schedule))} style={{ width: `${(schedule.seatsBooked / schedule.capacity) * 100}%` }} />
                  </span>
                </div>
                <button
                  type="button"
                  disabled={!left}
                  onClick={() => pick(schedule)}
                  aria-pressed={active}
                  aria-label={`${active ? "Selected" : "Select"} ${readableDeparture(schedule.date)} at ${schedule.time}`}
                  className={cn(
                    "inline-flex min-w-24 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/60 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-45",
                    active ? "bg-primary text-white" : "border border-border text-foreground hover:border-primary/50 hover:bg-primary/[0.06]",
                  )}
                >
                  {active ? <><Check className="size-4" aria-hidden="true" /> Selected</> : "Select"}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="border-y border-border py-6 text-[15px] text-muted">
          No departures are scheduled yet.{" "}
          <Link to="/contact" className="font-semibold text-primary-ink underline-offset-2 hover:underline">Ask us about private dates</Link>.
        </p>
      )}
    </Chapter>
  );
}

export function ReviewsChapter({ children, action, count, average }) {
  return (
    <Chapter
      id="reviews"
      eyebrow="Traveller voices"
      title={count ? "What travellers say" : "No reviews yet"}
      aside={
        <div className="flex items-center gap-4">
          {count > 0 && (
            <p className="flex items-center gap-1.5 text-sm text-muted">
              <Star className="size-4 fill-accent text-accent" aria-hidden="true" />
              <span className="font-semibold text-foreground">{average.toFixed(1)}</span> from {count} review{count === 1 ? "" : "s"}
            </p>
          )}
          {action}
        </div>
      }
    >
      {children}
    </Chapter>
  );
}

export function RelatedHeading() {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary-ink">
          <RouteMark /> Keep exploring
        </p>
        <h2 id="related-tours-title" className="font-display text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-[40px]">
          Further along the route
        </h2>
      </div>
      <Link to="/tours" className="group inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground outline-none transition-colors hover:border-primary/40 hover:bg-primary/[0.06] focus-visible:ring-2 focus-visible:ring-primary/60">
        All tours <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </Link>
    </div>
  );
}
