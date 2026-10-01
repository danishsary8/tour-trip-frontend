import { useRef } from "react";
import { Link } from "react-router-dom";
import { useInView } from "framer-motion";
import { ArrowUpRight, HandCoins, HeartHandshake, Languages, Star, UsersRound } from "lucide-react";
import { TOUR_PHOTOS } from "../../../mocks/tourImages";
import { EmptyState } from "../../../components/shared/EmptyState";
import { Skeleton } from "../../../components/shared/Skeleton";
import { AnimatedNumber } from "../../../components/ui/AnimatedNumber";
import { Button } from "../../../components/ui/Button";
import { cn } from "../../../lib/cn";

const heroPhoto = TOUR_PHOTOS["angkor-sunrise"][0];
const storyPhoto = TOUR_PHOTOS["angkor-sunrise"][2];
const storyPhotoSmall = TOUR_PHOTOS["kampot-adventure"][0];
import { Breadcrumbs } from "../components/Breadcrumbs";
import { CtaBand } from "../components/HomeSections";
import { Reveal, RevealItem } from "../components/Reveal";
import { RouteMark } from "../components/RouteMark";
import { SectionHeading } from "../components/SectionHeading";
import { ABOUT_STORY, ABOUT_VALUES, FOUNDED_YEAR, TEAM_COPY } from "../content";
import { useAbout, useCatalog } from "../hooks";
import { revealScale } from "../motion";

const container = "mx-auto max-w-[1320px] px-5 lg:px-8";
const VALUE_ICONS = [UsersRound, HeartHandshake, HandCoins];

function Hero({ stats }) {
  return (
    <div className={cn(container, "pt-28 sm:pt-32")}>
      <Reveal className="mb-7">
        <Breadcrumbs items={[{ label: "About us" }]} />
      </Reveal>
      <Reveal variants={revealScale} className="relative isolate flex h-[440px] items-end overflow-hidden rounded-[32px] bg-[#0b1215] sm:h-[540px]">
        <img
          src={heroPhoto.src}
          alt={heroPhoto.alt}
          width="1600"
          height="900"
          fetchPriority="high"
          className="absolute inset-0 -z-10 size-full object-cover animate-kenburns"
        />
        <span className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/35 to-black/5" aria-hidden="true" />
        <div className="flex w-full flex-col gap-6 p-6 pb-16 text-white sm:p-10 sm:pb-24 lg:flex-row lg:items-end lg:justify-between lg:px-14 lg:pb-24">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              <RouteMark tone="light" />
              About TourTrip · Since {FOUNDED_YEAR}
            </p>
            <h1 className="font-display text-[40px] font-semibold leading-[1.02] tracking-[-0.04em] text-balance sm:text-6xl lg:text-7xl">
              Your trusted guide to Cambodia
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
              A small Phnom Penh company of guides, drivers and trip planners who&apos;d rather show you their country than sell you a package.
            </p>
          </div>
          {stats?.rating && (
            <p className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-md lg:self-end">
              <Star className="size-4 fill-accent text-accent" aria-hidden="true" />
              {stats.rating.toFixed(1)} average from verified travellers
            </p>
          )}
        </div>
      </Reveal>
    </div>
  );
}

function Stat({ value, label, note, inView, format }) {
  return (
    <RevealItem className="px-2 py-6 sm:px-6 lg:py-8">
      <p className="font-display text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">
        <AnimatedNumber value={inView ? value : 0} duration={1.4} format={format} />
      </p>
      <p className="mt-2 text-sm font-semibold text-foreground">{label}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted">{note}</p>
    </RevealItem>
  );
}

/** Company figures counted from the shared bookings, tours and reviews stores. */
function StatsRow({ stats, loading }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const years = new Date().getFullYear() - FOUNDED_YEAR;

  return (
    <section aria-label="TourTrip in numbers" className={cn(container, "relative z-10 -mt-10 sm:-mt-14")}>
      <div ref={ref} className="mx-auto max-w-[1180px] rounded-panel border border-border bg-surface px-4 shadow-soft sm:px-6">
        {loading || !stats ? (
          <div className="grid grid-cols-2 gap-6 py-8 lg:grid-cols-4" aria-busy="true">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="space-y-3 px-2 sm:px-6">
                <Skeleton className="h-11 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        ) : (
          <Reveal stagger as="div" className="grid grid-cols-2 divide-border lg:grid-cols-4 lg:divide-x [&>*:nth-child(-n+2)]:border-b [&>*:nth-child(-n+2)]:border-border lg:[&>*:nth-child(-n+2)]:border-b-0">
            <Stat inView={inView} value={years} label="Years on the road" note={`Guiding since ${FOUNDED_YEAR}`} />
            <Stat inView={inView} value={stats.departures} label="Tours completed" note={`Departures run since online booking began in ${stats.since}`} />
            <Stat inView={inView} value={stats.travellers} label="Happy travellers" note="Guests on completed tours, same period" />
            <Stat inView={inView} value={stats.destinations} label="Destinations covered" note="From Siem Reap and Battambang down to the coast" />
          </Reveal>
        )}
      </div>
    </section>
  );
}

function Story() {
  return (
    <section aria-labelledby="about-story" className={cn(container, "grid items-center gap-12 pt-24 sm:pt-32 lg:grid-cols-[1fr_1.1fr] lg:gap-20")}>
      <Reveal variants={revealScale} className="relative mx-auto w-full max-w-md lg:max-w-none">
        <div className="aspect-[4/5] overflow-hidden rounded-[32px] bg-surface-2">
          <img src={storyPhoto.src} alt={storyPhoto.alt} width="800" height="1000" loading="lazy" decoding="async" className="size-full object-cover" />
        </div>
        <div className="absolute -bottom-8 -right-3 hidden aspect-square w-[44%] overflow-hidden rounded-panel border-[6px] border-background bg-surface-2 shadow-panel sm:block lg:-right-8">
          <img src={storyPhotoSmall.src} alt={storyPhotoSmall.alt} width="400" height="400" loading="lazy" decoding="async" className="size-full object-cover" />
        </div>
        <p className="absolute -left-3 top-8 grid size-28 place-items-center rounded-full bg-accent text-center font-display text-[#241a06] shadow-panel lg:-left-8">
          <span>
            <span className="block text-xs font-semibold uppercase tracking-[0.18em]">Est.</span>
            <span className="block text-3xl font-semibold tracking-[-0.03em]">{FOUNDED_YEAR}</span>
          </span>
        </p>
      </Reveal>

      <Reveal stagger>
        <RevealItem as="p" className="mb-3 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary-ink">
          <RouteMark />
          Our story
        </RevealItem>
        <RevealItem as="h2" id="about-story" className="font-display text-[34px] font-semibold leading-[1.05] tracking-[-0.035em] text-balance text-foreground sm:text-5xl">
          Three friends and one rented minivan
        </RevealItem>
        {ABOUT_STORY.map((paragraph) => (
          <RevealItem as="p" key={paragraph.slice(0, 24)} className="mt-5 text-base leading-relaxed text-pretty text-muted sm:text-lg">
            {paragraph}
          </RevealItem>
        ))}
        <RevealItem as="p" className="mt-7 font-display text-lg font-semibold text-foreground">
          Sokha, Dara &amp; Vanna <span className="font-sans text-sm font-normal text-muted">· founders</span>
        </RevealItem>
      </Reveal>
    </section>
  );
}

function Values() {
  return (
    <section aria-labelledby="about-values" className={cn(container, "pt-24 sm:pt-32")}>
      <SectionHeading id="about-values" eyebrow="How we travel" title="What we won't compromise on" />
      <Reveal stagger as="ul" className="grid gap-x-10 gap-y-8 border-t border-foreground/80 pt-8 md:grid-cols-3">
        {ABOUT_VALUES.map((value, index) => {
          const Icon = VALUE_ICONS[index] ?? HeartHandshake;
          return (
            <RevealItem as="li" key={value.title} variants={revealScale}>
              <span className="grid size-11 place-items-center rounded-full border border-primary/25 text-primary-ink">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold tracking-[-0.02em] text-foreground">{value.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-pretty text-muted">{value.body}</p>
            </RevealItem>
          );
        })}
      </Reveal>
    </section>
  );
}

function TeamCard({ guide }) {
  const copy = TEAM_COPY[guide.id] ?? { role: "Local guide", bio: "One of our licensed Cambodian guides." };
  return (
    <article className="group flex h-full flex-col">
      <div className="relative">
        <div className="aspect-[16/10] overflow-hidden rounded-card bg-surface-2">
          {guide.image && (
            <img
              src={guide.image}
              alt=""
              width="640"
              height="400"
              loading="lazy"
              decoding="async"
              className="size-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
            />
          )}
        </div>
        <span className="absolute inset-0 rounded-card bg-gradient-to-t from-black/45 to-transparent" aria-hidden="true" />
        <span
          className="absolute -bottom-7 left-5 grid size-16 place-items-center rounded-full border-4 border-background bg-primary font-display text-xl font-semibold text-white shadow-soft"
          aria-hidden="true"
        >
          {guide.initials}
        </span>
      </div>
      <div className="flex flex-1 flex-col pt-10">
        <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-foreground">{guide.name}</h3>
        <p className="mt-1 text-sm font-semibold text-primary-ink">{copy.role}</p>
        <p className="mt-3 text-sm leading-relaxed text-pretty text-muted">{copy.bio}</p>
        <div className="mt-auto space-y-3 pt-5">
          {guide.languages.length > 0 && (
            <p className="flex items-center gap-2 text-xs text-muted">
              <Languages className="size-4 shrink-0" aria-hidden="true" />
              <span className="sr-only">Speaks </span>
              {guide.languages.join(" · ")}
            </p>
          )}
          {guide.tours.length > 0 && (
            <ul className="flex flex-wrap gap-2" aria-label={`Tours led by ${guide.name}`}>
              {guide.tours.map((tour) => (
                <li key={tour.id}>
                  <Link
                    to={`/tours/${tour.id}`}
                    className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground outline-none transition-colors hover:border-primary/40 hover:bg-primary/[0.06] focus-visible:ring-2 focus-visible:ring-primary/60"
                  >
                    {tour.name}
                    <ArrowUpRight className="size-3" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  );
}

function Team({ team, loading, error, onRetry }) {
  return (
    <section id="team" aria-labelledby="about-team" className={cn(container, "scroll-mt-20 pt-24 sm:pt-32")}>
      <SectionHeading id="about-team" eyebrow="Meet the team" title="The people who'll show you around">
        Every TourTrip guide is licensed and Cambodian. They lead the tours they helped design at home, and travel with you as tour leader on International Escapes.
      </SectionHeading>
      {error ? (
        <EmptyState icon={UsersRound} title="We couldn't load the team" description="Please check your connection and try again." action={<Button onClick={onRetry}>Try again</Button>} />
      ) : (
        <Reveal stagger as="ul" amount={0.1} className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }, (_, index) => (
                <li key={index}>
                  <Skeleton className="h-[420px] rounded-panel" />
                </li>
              ))
            : team.map((guide) => (
                <RevealItem as="li" key={guide.id}>
                  <TeamCard guide={guide} />
                </RevealItem>
              ))}
        </Reveal>
      )}
    </section>
  );
}

/** About Us: hero, company figures, founding story, values, the guiding team and a closing CTA. */
export default function AboutPage() {
  const about = useAbout();
  const catalog = useCatalog();

  return (
    <>
      <Hero stats={about.data?.stats} />
      <StatsRow stats={about.data?.stats} loading={about.isLoading} />
      <Story />
      <Values />
      <Team team={about.data?.team ?? []} loading={about.isLoading} error={about.isError} onRetry={() => about.refetch()} />
      <CtaBand tourCount={catalog.data?.tours.length} />
    </>
  );
}
