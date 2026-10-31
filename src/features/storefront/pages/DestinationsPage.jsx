import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Compass, MapPin } from "lucide-react";
import { EmptyState } from "../../../components/shared/EmptyState";
import { Skeleton } from "../../../components/shared/Skeleton";
import { Button } from "../../../components/ui/Button";
import { cn } from "../../../lib/cn";
import { PageIntro } from "../components/PageIntro";
import { Reveal, RevealItem } from "../components/Reveal";
import { useCatalog } from "../hooks";

export default function DestinationsPage() {
  const catalog = useCatalog();

  const destinations = useMemo(() => catalog.data?.destinations ?? [], [catalog.data]);
  const tours = useMemo(() => catalog.data?.tours ?? [], [catalog.data]);

  // Compute total tours across all destinations from shared mock data
  const totalTours = useMemo(
    () => tours.filter((t) => t.status !== "Inactive").length,
    [tours]
  );

  return (
    <>
      <PageIntro
        breadcrumbs={[{ label: "Destinations" }]}
        eyebrow="Destinations"
        title="Six provinces, and three escapes"
        actions={
          catalog.isLoading ? (
            <div className="flex gap-2.5" aria-hidden="true">
              <Skeleton className="h-8 w-28 rounded-full" />
              <Skeleton className="h-8 w-40 rounded-full" />
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold text-muted">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-1.5 shadow-xs">
                <MapPin className="size-3.5 text-primary" aria-hidden="true" />
                <span>{destinations.length} regions</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-1.5 shadow-xs">
                <Compass className="size-3.5 text-accent" aria-hidden="true" />
                <span>{totalTours} small-group tours</span>
              </span>
            </div>
          )
        }
      >
        From the majestic dawn at Angkor Wat to the tranquil pepper farms of Kampot
        and the pristine turquoise waters of Koh Rong, discover Cambodia region by region, then three journeys beyond the border.
      </PageIntro>

      <section className="mx-auto max-w-[1320px] px-5 pb-24 lg:px-8" aria-label="Destinations">
        {catalog.isError ? (
          <EmptyState
            icon={Compass}
            title="Destinations could not be loaded"
            description="We were unable to connect to the catalogue. Please try again."
            action={<Button onClick={() => catalog.refetch()}>Try again</Button>}
          />
        ) : catalog.isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading destinations">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="h-[380px] sm:h-[420px] rounded-3xl overflow-hidden">
                <Skeleton className="size-full rounded-3xl" />
              </div>
            ))}
          </div>
        ) : (
          [
            { id: "cambodia", title: "Cambodia", items: destinations.filter((item) => !item.international) },
            { id: "abroad", title: "Beyond Cambodia", items: destinations.filter((item) => item.international) },
          ].filter((group) => group.items.length).map((group) => (
          <div key={group.id} className="mt-12 first:mt-0">
          <h2 className="mb-6 font-display text-2xl font-semibold tracking-tight text-foreground">{group.title}</h2>
          <Reveal
            stagger
            amount={0.08}
            as="ul"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {group.items.map((destination) => {
              // Tour count COMPUTED directly by counting matching tours in shared mock catalogue
              const tourCount = tours.filter((t) => t.destinationId === destination.id).length;
              const hasTours = tourCount > 0;

              const cardContent = (
                <>
                  {/* Photo with subtle zoom on hover */}
                  <img
                    src={destination.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className={cn(
                      "absolute inset-0 size-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]",
                      !hasTours && "grayscale-[45%]"
                    )}
                  />

                  {/* Atmospheric gradient overlay */}
                  <span
                    className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent transition-opacity duration-300 group-hover:opacity-95"
                    aria-hidden="true"
                  />

                  {/* Card Content Top Tag */}
                  <div className="relative z-10 flex items-start justify-between p-6">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-md border border-white/10">
                      <MapPin className="size-3 text-accent" aria-hidden="true" />
                      {destination.international ? destination.country : destination.province || destination.name}
                    </span>

                    {hasTours ? (
                      <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white shadow-xs backdrop-blur-md border border-white/20">
                        {tourCount} {tourCount === 1 ? "tour" : "tours"}
                      </span>
                    ) : (
                      <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-[#241a06] shadow-xs">
                        Coming soon
                      </span>
                    )}
                  </div>

                  {/* Card Content Bottom Details */}
                  <div className="relative z-10 mt-auto flex items-end justify-between gap-4 p-6 sm:p-7 text-white">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-2xl font-bold tracking-tight sm:text-3xl text-balance drop-shadow-sm">
                        {destination.name}
                      </h3>
                      <p className="mt-2 text-sm text-white/80 line-clamp-2 leading-relaxed">
                        {destination.blurb}
                      </p>
                    </div>

                    {hasTours ? (
                      <span
                        className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-[#1a1f21] shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:rotate-45"
                        aria-hidden="true"
                      >
                        <ArrowUpRight className="size-5" />
                      </span>
                    ) : (
                      <span className="shrink-0 text-xs font-semibold text-white/60">
                        Stay tuned
                      </span>
                    )}
                  </div>
                </>
              );

              return (
                <RevealItem as="li" key={destination.id} className="h-full">
                  {hasTours ? (
                    <Link
                      to={`/tours?destination=${destination.id}`}
                      aria-label={`${destination.name}, ${destination.province}: ${tourCount} tours available`}
                      className="group relative flex h-[380px] sm:h-[420px] w-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-surface shadow-md outline-none transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-0 active:scale-[0.99]"
                    >
                      {cardContent}
                    </Link>
                  ) : (
                    <div
                      aria-label={`${destination.name}, ${destination.province}: tours coming soon`}
                      className="group relative flex h-[380px] sm:h-[420px] w-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-surface shadow-md"
                    >
                      {cardContent}
                    </div>
                  )}
                </RevealItem>
              );
            })}
          </Reveal>
          </div>
          ))
        )}
      </section>
    </>
  );
}
