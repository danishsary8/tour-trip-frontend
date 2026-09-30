import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Compass } from "lucide-react";
import { Skeleton } from "../../../components/shared/Skeleton";
import { cn } from "../../../lib/cn";
import { CATEGORY_ICONS } from "../categoryIcons";
import { revealScale } from "../motion";
import { Reveal, RevealItem } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { TourCard, TourCardSkeleton } from "./TourCard";


const container = "mx-auto max-w-[1320px] px-5 lg:px-8";

export function CategoriesSection({ categories, loading }) {
  return (
    <section aria-labelledby="home-categories" className={cn(container, "pt-24 sm:pt-32")}>
      <SectionHeading id="home-categories" eyebrow="Travel your way" title="Find the trip that feels like you" link={{ to: "/tours", label: "Browse all tours" }}>
        From temple sunrises to street-food nights, pick a style and we&apos;ll show you where it leads.
      </SectionHeading>
      <Reveal stagger as="ul" className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-6 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
        {loading
          ? Array.from({ length: 6 }, (_, index) => (
              <li key={index} className="w-44 shrink-0 lg:w-auto">
                <Skeleton className="h-44 rounded-panel" />
              </li>
            ))
          : categories.map((category) => {
              const Icon = CATEGORY_ICONS[category.icon] ?? Compass;
              return (
                <RevealItem as="li" key={category.id} variants={revealScale} className="w-44 shrink-0 snap-start lg:w-auto">
                  <Link
                    to={`/tours?category=${category.id}`}
                    className="group flex h-full flex-col justify-between gap-6 rounded-panel border border-border bg-surface p-5 outline-none transition-[transform,box-shadow,border-color,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-panel focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background active:translate-y-0"
                  >
                    <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary-ink transition-[transform,background-color,color] duration-500 group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block font-display text-lg font-semibold leading-tight tracking-[-0.02em] text-foreground">{category.name}</span>
                      <span className="mt-1 block text-sm text-muted">
                        {category.tourCount} {category.tourCount === 1 ? "tour" : "tours"}
                      </span>
                    </span>
                  </Link>
                </RevealItem>
              );
            })}
      </Reveal>
    </section>
  );
}

export function FeaturedToursSection({ tours, loading }) {
  return (
    <section aria-labelledby="home-featured" className={cn(container, "pt-24 sm:pt-32")}>
      <SectionHeading id="home-featured" eyebrow="Traveller favourites" title="Featured tours" link={{ to: "/tours?sort=popular", label: "See every tour" }}>
        The journeys our guests book most, each led by a guide who grew up nearby.
      </SectionHeading>
      <Reveal stagger as="ul" amount={0.1} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {loading
          ? Array.from({ length: 6 }, (_, index) => (
              <li key={index}>
                <TourCardSkeleton />
              </li>
            ))
          : tours.map((tour) => (
              <RevealItem as="li" key={tour.id}>
                <TourCard tour={tour} />
              </RevealItem>
            ))}
      </Reveal>
    </section>
  );
}

export function DestinationsSection({ destinations, loading }) {
  return (
    <section id="destinations" aria-labelledby="home-destinations" className={cn(container, "scroll-mt-24 pt-24 sm:pt-32")}>
      <SectionHeading id="home-destinations" eyebrow="Where to go" title="Six places, one kingdom">
        Temples and forests in the north, rivers and pepper farms in the south, islands on the coast.
      </SectionHeading>
      <Reveal stagger as="ul" amount={0.1} className="grid auto-rows-[260px] gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[280px] lg:gap-5">
        {loading
          ? Array.from({ length: 6 }, (_, index) => (
              <li key={index} className={cn(index === 0 && "lg:col-span-2 lg:row-span-2")}>
                <Skeleton className="size-full rounded-panel" />
              </li>
            ))
          : destinations.map((destination, index) => {
              const available = destination.tourCount > 0;
              const body = (
                <>
                  <img
                    src={destination.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className={cn("absolute inset-0 size-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]", !available && "grayscale-[60%]")}
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" aria-hidden="true" />
                  <span className="relative mt-auto flex items-end justify-between gap-3 p-6 text-white">
                    <span>
                      <span className={cn("block font-display font-semibold tracking-[-0.03em]", index === 0 ? "text-4xl" : "text-2xl")}>{destination.name}</span>
                      <span className="mt-1 block text-sm text-white/80">{destination.blurb}</span>
                    </span>
                    {available ? (
                      <span className="flex shrink-0 items-center gap-2">
                        <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                          {destination.tourCount} {destination.tourCount === 1 ? "tour" : "tours"}
                        </span>
                        <span className="grid size-10 place-items-center rounded-full bg-white text-[#1a1f21] transition-transform duration-500 group-hover:rotate-45">
                          <ArrowUpRight className="size-5" aria-hidden="true" />
                        </span>
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-full bg-accent px-3 py-1 text-xs font-bold text-[#241a06]">Coming soon</span>
                    )}
                  </span>
                </>
              );
              return (
                <RevealItem as="li" key={destination.id} variants={revealScale} className={cn(index === 0 && "sm:col-span-2 lg:row-span-2")}>
                  {available ? (
                    <Link
                      to={`/tours?destination=${destination.id}`}
                      aria-label={`${destination.name}: ${destination.tourCount} tours`}
                      className="group relative flex size-full overflow-hidden rounded-panel outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background active:scale-[0.99]"
                    >
                      {body}
                    </Link>
                  ) : (
                    <div className="group relative flex size-full overflow-hidden rounded-panel" aria-label={`${destination.name}: tours coming soon`}>
                      {body}
                    </div>
                  )}
                </RevealItem>
              );
            })}
      </Reveal>
    </section>
  );
}

export function CtaBand({ tourCount }) {
  return (
    <section aria-labelledby="home-cta" className={cn(container, "py-24 sm:py-32")}>
      <Reveal variants={revealScale} className="relative overflow-hidden rounded-[32px] bg-[#0b1215] px-6 py-16 text-center text-white sm:px-12 sm:py-20">
        <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(200,85,61,.55),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(233,185,73,.35),transparent_55%)]" aria-hidden="true" />
        <div className="relative mx-auto max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#f1c968]">Your trip starts here</p>
          <h2 id="home-cta" className="font-display text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-balance sm:text-6xl">
            Ready to explore Cambodia?
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">
            {tourCount ? `${tourCount} small-group tours` : "Small-group tours"}, local guides and honest prices in US dollars. Pick a date that suits you.
          </p>
          <Link
            to="/tours"
            className="group mt-9 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-[15px] font-semibold text-[#1a1f21] outline-none transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-14px_rgba(233,185,73,.8)] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-[#0b1215] active:translate-y-0"
          >
            Explore all tours <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
