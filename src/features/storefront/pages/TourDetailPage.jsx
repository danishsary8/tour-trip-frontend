import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Clock3, MapPin, Star, Users } from "lucide-react";
import { EmptyState } from "../../../components/shared/EmptyState";
import { Skeleton } from "../../../components/shared/Skeleton";
import { formatUsd } from "../../../lib/format";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Reveal, RevealItem } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";
import { TourGallery } from "../components/TourGallery";
import { TourSections } from "../components/TourSections";
import { BookingCard } from "../components/BookingCard";
import { TourCard } from "../components/TourCard";
import { useCustomerAuth } from "../auth/CustomerAuthContext";
import { authPath } from "../auth/redirect";
import { useCatalog, useTourDetail } from "../hooks";
import { recordTourView } from "../recentlyViewed";

export default function TourDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const customer = useCustomerAuth();
  const detail = useTourDetail(id);
  const catalog = useCatalog();
  const viewedId = detail.data?.tour?.id;
  // Feeds the "Recently viewed" strip on Home and /tours.
  useEffect(() => {
    if (viewedId) recordTourView(viewedId);
  }, [viewedId]);
  if (detail.isLoading) return <div className="mx-auto max-w-[1320px] space-y-5 px-5 pb-24 pt-28 lg:px-8" role="status" aria-label="Loading tour details">
    <Skeleton className="h-6 w-56" /><Skeleton className="h-12 w-3/4" /><Skeleton className="aspect-[16/9] w-full rounded-panel" />
  </div>;
  if (!detail.data || detail.isError) return <div className="mx-auto max-w-3xl px-5 pb-24 pt-32"><EmptyState title="We couldn't find that tour" description="It may have been renamed or retired. There are more Cambodia journeys waiting for you."
    action={<Link to="/tours" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white outline-none transition-all hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-accent active:scale-95">Browse all tours</Link>} /></div>;

  const { tour, photos, story, reviews, schedules } = detail.data;
  const related = (catalog.data?.tours ?? []).filter((item) => item.id !== tour.id)
    .sort((a, b) => Number(b.destinationId === tour.destinationId) - Number(a.destinationId === tour.destinationId)
      || Number(b.categoryId === tour.categoryId) - Number(a.categoryId === tour.categoryId)
      || b.popularity - a.popularity).slice(0, 3);
  function book(selection) {
    const params = new URLSearchParams({ date: selection.date, adults: String(selection.adults), children: String(selection.children) });
    const target = `/booking/${tour.id}?${params}`;
    // Guests sign in first and come back to the same departure and traveller counts.
    navigate(customer.isAuthenticated ? target : authPath(target));
  }
  return <div className="mx-auto max-w-[1320px] px-5 pb-24 pt-28 lg:px-8">
    <Breadcrumbs className="mb-7" items={[{ label: "Tours", to: "/tours" }, { label: tour.destination, to: `/tours?destination=${tour.destinationId}` }, { label: tour.name }]} />
    <Reveal stagger className="mb-7 flex flex-col gap-5 sm:mb-9 md:flex-row md:items-end md:justify-between">
      <RevealItem><p className="mb-3 inline-flex rounded-full border border-primary/20 bg-primary/[0.08] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.13em] text-primary-ink">{tour.category}</p>
        <h1 className="font-display text-[clamp(2.5rem,5.4vw,4.75rem)] font-semibold leading-[1.03] tracking-[-0.045em] text-balance text-foreground">{tour.name}</h1>
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
          <span className="inline-flex items-center gap-1.5"><MapPin className="size-4 text-primary-ink" />{tour.destination}</span>
          <span className="inline-flex items-center gap-1.5"><Clock3 className="size-4 text-primary-ink" />{tour.durationLabel}</span>
          <span className="inline-flex items-center gap-1.5"><Users className="size-4 text-primary-ink" />Up to {tour.groupSize}</span>
          <span className="inline-flex items-center gap-1.5"><Star className="size-4 fill-accent text-accent" />{tour.rating ? `${tour.rating.toFixed(1)} (${tour.reviewCount} reviews)` : "New experience"}</span>
        </div></RevealItem>
      <RevealItem className="shrink-0 md:text-right"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">From / person</p>
        <p className="mt-1 font-display text-4xl font-semibold tabular-nums text-foreground">{formatUsd(tour.price)}</p></RevealItem>
    </Reveal>
    <Reveal><TourGallery images={photos} title={tour.name} /></Reveal>
    <div className="mt-12 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px] xl:gap-12"><TourSections tour={tour} story={story} reviews={reviews} /><BookingCard tour={tour} schedules={schedules} onBook={book} /></div>
    {related.length > 0 && <section className="mt-16 border-t border-border pt-12 sm:mt-24 sm:pt-16" aria-labelledby="related-tours-title">
      <SectionHeading id="related-tours-title" eyebrow="Keep exploring" title="More journeys to love" link={{ to: "/tours", label: "View all tours" }} />
      <Reveal stagger as="ul" amount={0.1} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">{related.map((item) => <RevealItem as="li" key={item.id}><TourCard tour={item} /></RevealItem>)}</Reveal>
    </section>}
    <Link to="/tours" className="mt-6 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground outline-none transition-all hover:-translate-y-0.5 hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary active:scale-95"><ArrowLeft className="size-4" /> All tours</Link>
  </div>;
}
