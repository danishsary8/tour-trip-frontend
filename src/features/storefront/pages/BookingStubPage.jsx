import { Link, useParams, useSearchParams } from "react-router-dom";
import { CalendarDays, ChevronLeft, Compass, Ticket, Users } from "lucide-react";
import { Skeleton } from "../../../components/shared/Skeleton";
import { formatUsd } from "../../../lib/format";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Reveal, RevealItem } from "../components/Reveal";
import { useCatalog } from "../hooks";

const dateFormat = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const pill = "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-accent/70";

/**
 * Where "Book now" lands once signed in: confirms the tour, date and travellers carried through
 * the login hop. Review, payment and confirmation arrive with the booking flow (Phase 7c).
 */
export default function BookingStubPage() {
  const { tourId } = useParams();
  const [params] = useSearchParams();
  const catalog = useCatalog();
  const tour = catalog.data?.tours.find((item) => item.id === tourId);
  const date = params.get("date");
  const adults = Number(params.get("adults") ?? 1) || 1;
  const children = Number(params.get("children") ?? 0) || 0;
  const travellers = adults + children;

  return (
    <div className="mx-auto max-w-3xl px-5 pb-24 pt-28 sm:pb-32 sm:pt-32">
      <Breadcrumbs
        className="mb-8"
        items={[{ label: "Tours", to: "/tours" }, ...(tour ? [{ label: tour.name, to: `/tours/${tour.id}` }] : []), { label: "Booking" }]}
      />
      <Reveal stagger>
        <RevealItem as="p" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary-ink">
          <Ticket className="size-4" aria-hidden="true" /> Your booking
        </RevealItem>
        <RevealItem as="h1" className="mt-3 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-balance text-foreground sm:text-5xl">
          Almost there
        </RevealItem>
        <RevealItem as="p" className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
          Here&apos;s what you picked. Review, payment and confirmation open in the next release, so nothing has been reserved or charged yet.
        </RevealItem>

        <RevealItem className="mt-8 overflow-hidden rounded-panel border border-border bg-surface shadow-soft">
          {catalog.isLoading ? (
            <div className="flex gap-4 p-5" aria-busy="true">
              <Skeleton className="size-24 shrink-0 rounded-card" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
              {tour && <img src={tour.image} alt="" width="160" height="120" className="aspect-[4/3] w-full shrink-0 rounded-card object-cover sm:w-40" />}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-ink">{tour?.destination ?? "Tour"}</p>
                <h2 className="mt-1 font-display text-2xl font-semibold tracking-[-0.02em] text-foreground">{tour?.name ?? tourId}</h2>
                <ul className="mt-3 space-y-1.5 text-sm text-muted">
                  <li className="flex items-center gap-2">
                    <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
                    {date ? dateFormat.format(new Date(`${date}T12:00:00Z`)) : "No date selected yet"}
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="size-4 shrink-0" aria-hidden="true" />
                    {adults} {adults === 1 ? "adult" : "adults"}
                    {children > 0 && `, ${children} ${children === 1 ? "child" : "children"}`}
                  </li>
                </ul>
              </div>
              {tour && (
                <p className="shrink-0 border-t border-border pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0 sm:text-right">
                  <span className="block text-xs text-muted">Estimated total</span>
                  <span className="font-display text-3xl font-semibold tabular-nums text-foreground">{formatUsd(tour.price * travellers)}</span>
                </p>
              )}
            </div>
          )}
        </RevealItem>

        <RevealItem className="mt-8 flex flex-wrap gap-3">
          <Link to={`/tours/${tourId}`} className={`${pill} border border-border text-foreground hover:bg-foreground/[0.06]`}>
            <ChevronLeft className="size-4" aria-hidden="true" /> Change date or travellers
          </Link>
          <Link to="/tours" className={`${pill} bg-primary text-white hover:bg-primary/90`}>
            <Compass className="size-4" aria-hidden="true" /> Keep exploring
          </Link>
        </RevealItem>
      </Reveal>
    </div>
  );
}
