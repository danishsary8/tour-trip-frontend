import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Compass } from "lucide-react";
import { EmptyState } from "../../../components/shared/EmptyState";
import { Skeleton } from "../../../components/shared/Skeleton";
import { Button } from "../../../components/ui/Button";
import { cn } from "../../../lib/cn";
import { PageIntro } from "../components/PageIntro";
import { Reveal, RevealItem } from "../components/Reveal";
import { RouteMark } from "../components/RouteMark";
import { useCatalog } from "../hooks";

const container = "mx-auto max-w-[1320px] px-5 lg:px-8";
const tourLabel = (count) => (count ? `${count} ${count === 1 ? "tour" : "tours"}` : "Tours coming soon");

/** One Cambodian destination: photo, then name, province and blurb set on the page. */
function DestinationTile({ destination, lead = false }) {
  const content = (
    <>
      <div className={cn("overflow-hidden rounded-card bg-surface-2", lead ? "aspect-[16/10]" : "aspect-[4/5]")}>
        <img
          src={destination.image}
          alt=""
          loading={lead ? "eager" : "lazy"}
          decoding="async"
          className={cn("size-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] motion-reduce:transition-none", !destination.tourCount && "grayscale-[45%]")}
        />
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className={cn("font-display font-semibold tracking-[-0.03em] text-foreground decoration-primary/40 decoration-2 underline-offset-4 group-hover:underline", lead ? "text-3xl sm:text-4xl" : "text-2xl")}>{destination.name}</h3>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted">{destination.province} province</p>
          <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted">{destination.blurb}</p>
        </div>
        <span className="mt-1 inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary-ink">
          {tourLabel(destination.tourCount)} {destination.tourCount > 0 && <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />}
        </span>
      </div>
    </>
  );
  return destination.tourCount ? (
    <Link to={`/tours?destination=${destination.id}`} className="group block rounded-card outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background">
      {content}
    </Link>
  ) : (
    <div className="group">{content}</div>
  );
}

/**
 * Destinations: Cambodia's provinces as an editorial grid (Siem Reap, the busiest, leads), then
 * the International Escapes on the same ink band as Home.
 */
export default function DestinationsPage() {
  const catalog = useCatalog();
  const destinations = useMemo(() => catalog.data?.destinations ?? [], [catalog.data]);
  const home = destinations.filter((item) => !item.international).sort((a, b) => b.tourCount - a.tourCount);
  const abroad = destinations.filter((item) => item.international);
  const [lead, ...rest] = home;

  return (
    <>
      <PageIntro
        breadcrumbs={[{ label: "Destinations" }]}
        eyebrow="Destinations"
        title="Six provinces, and three escapes"
        aside={!catalog.isLoading && <p className="text-sm text-muted"><span className="font-display text-4xl font-semibold text-foreground">{catalog.data?.tours.length ?? 0}</span> tours in {destinations.length} places</p>}
      >
        From dawn at Angkor Wat to the pepper farms of Kampot and the beaches of Koh Rong, see Cambodia province by province, then three journeys beyond the border.
      </PageIntro>

      {catalog.isError ? (
        <div className={cn(container, "pb-24")}>
          <EmptyState icon={Compass} title="Destinations didn't load" description="Check your connection, then try again." action={<Button onClick={() => catalog.refetch()}>Try again</Button>} />
        </div>
      ) : catalog.isLoading ? (
        <div className={cn(container, "grid gap-8 pb-24 sm:grid-cols-2 lg:grid-cols-3")} aria-label="Loading destinations">
          {Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="aspect-[4/5] rounded-card" />)}
        </div>
      ) : (
        <>
          <section aria-labelledby="destinations-cambodia" className={cn(container, "pb-24 sm:pb-28")}>
            <h2 id="destinations-cambodia" className="sr-only">Cambodia</h2>
            <div className="border-t border-foreground/80 pt-10">
              {lead && (
                <Reveal className="mb-14">
                  <DestinationTile destination={lead} lead />
                </Reveal>
              )}
              <Reveal stagger as="ul" amount={0.08} className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((destination) => (
                  <RevealItem as="li" key={destination.id}>
                    <DestinationTile destination={destination} />
                  </RevealItem>
                ))}
              </Reveal>
            </div>
          </section>

          {abroad.length > 0 && (
            <section aria-labelledby="destinations-abroad" className="dark bg-background py-20 text-foreground sm:py-24">
              <div className={container}>
                <Reveal stagger className="mb-12 max-w-2xl">
                  <RevealItem as="p" className="mb-3 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                    <RouteMark tone="light" /> International Escapes
                  </RevealItem>
                  <RevealItem as="h2" id="destinations-abroad" className="font-display text-[34px] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl">
                    Beyond Cambodia
                  </RevealItem>
                  <RevealItem as="p" className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
                    Small-group journeys to Indonesia, Vietnam and Japan, with a TourTrip tour leader from Phnom Penh.
                  </RevealItem>
                </Reveal>
                <Reveal stagger as="ul" className="grid gap-6 md:grid-cols-3">
                  {abroad.map((destination) => (
                    <RevealItem as="li" key={destination.id}>
                      <Link
                        to={`/tours?destination=${destination.id}`}
                        className="group relative isolate flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-panel p-6 text-white outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                      >
                        <img src={destination.image} alt="" loading="lazy" decoding="async" className="absolute inset-0 -z-10 size-full object-cover transition-transform duration-700 group-hover:scale-[1.05] motion-reduce:transition-none" />
                        <span className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(0,0,0,.5)_0%,rgba(0,0,0,.05)_35%,rgba(0,0,0,.85)_100%)]" aria-hidden="true" />
                        <span className="font-display text-4xl font-semibold tracking-[-0.04em]">{destination.country}</span>
                        <span>
                          <span className="block font-display text-2xl font-semibold">{destination.name}</span>
                          <span className="mt-1 block text-sm text-white/80">{destination.blurb}</span>
                          <span className="mt-4 flex items-center justify-between border-t border-white/25 pt-4 text-sm font-semibold">
                            {tourLabel(destination.tourCount)}
                            <ArrowUpRight className="size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                          </span>
                        </span>
                      </Link>
                    </RevealItem>
                  ))}
                </Reveal>
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}
