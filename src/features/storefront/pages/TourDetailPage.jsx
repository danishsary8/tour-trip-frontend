import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { EmptyState } from "../../../components/shared/EmptyState";
import { Lightbox } from "../../../components/shared/Lightbox";
import { Skeleton } from "../../../components/shared/Skeleton";
import { BookingCard } from "../components/BookingCard";
import { useBookingSelection } from "../useBookingSelection";
import { Reveal, RevealItem } from "../components/Reveal";
import {
  ChapterNav, DeparturesChapter, HighlightsChapter, IncludedChapter, ItineraryChapter, OverviewChapter, PhotosChapter,
  RelatedHeading, ReviewsChapter, TourHero,
} from "../components/TourChapters";
import { ReviewButton, TourReviews } from "../components/TourReviews";
import { TourCard } from "../components/TourCard";
import { ReviewDialog } from "../components/booking/ReviewDialog";
import { useMyBookings } from "../../bookings/hooks";
import { useReviewsForBookings } from "../../reviews/hooks";
import { useCustomerAuth } from "../auth/CustomerAuthContext";
import { authPath } from "../auth/redirect";
import { useCatalog, useTourDetail } from "../hooks";
import { useHeroHeader } from "../layouts/heroHeader";
import { recordTourView } from "../recentlyViewed";

/**
 * Tour Detail as one long, editorial page: a full-bleed hero, then chapters (overview,
 * highlights, photos, itinerary, inclusions, departures, reviews) with a sticky section nav,
 * and the sticky booking card beside them (a bottom bar and sheet on small screens).
 */
export default function TourDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const customer = useCustomerAuth();
  const detail = useTourDetail(id);
  const catalog = useCatalog();
  const tour = detail.data?.tour;
  const viewedId = tour?.id;
  // A signed-in traveller may review this tour once per Completed booking of it.
  const mine = useMyBookings(customer.isAuthenticated ? customer.user.email : null);
  const completed = (mine.data ?? []).filter((booking) => booking.tourId === viewedId && booking.status === "Completed");
  const myReviews = useReviewsForBookings(completed.map((booking) => booking.id));
  const reviewable = completed.find((booking) => !myReviews.data?.some((review) => review.bookingId === booking.id));
  const [reviewing, setReviewing] = useState({ booking: null, open: false });
  const [lightboxIndex, setLightboxIndex] = useState(null);

  function book(selection) {
    const params = new URLSearchParams({ date: selection.date, adults: String(selection.adults), children: String(selection.children) });
    const target = `/booking/${viewedId}?${params}`;
    // Guests sign in first and come back to the same departure and traveller counts.
    navigate(customer.isAuthenticated ? target : authPath(target));
  }
  const selection = useBookingSelection(detail.data?.schedules ?? [], book);
  // The header goes transparent over the dark hero (and its dark loading placeholder).
  useHeroHeader(detail.isLoading || Boolean(tour));

  // Feeds the "Recently viewed" strip on Home and /tours.
  useEffect(() => {
    if (viewedId) recordTourView(viewedId);
  }, [viewedId]);

  if (detail.isLoading) {
    return (
      <div role="status" aria-label="Loading tour details">
        <div className="dark h-[88svh] max-h-[900px] min-h-[600px] bg-background">
          <div className="mx-auto flex h-full max-w-[1320px] flex-col justify-end gap-4 px-5 pb-14 lg:px-8">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-16 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
          </div>
        </div>
      </div>
    );
  }
  if (!tour || detail.isError) {
    return (
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-32">
        <EmptyState
          title="We couldn't find that tour"
          description="It may have been renamed or retired. Every tour we run is on the tours page."
          action={<Link to="/tours" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white outline-none transition-all hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-accent active:scale-95">Browse all tours</Link>}
        />
      </div>
    );
  }

  const { photos, story, reviews } = detail.data;
  const average = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  const related = (catalog.data?.tours ?? [])
    .filter((item) => item.id !== tour.id)
    .sort((a, b) => Number(b.international === tour.international) - Number(a.international === tour.international)
      || Number(b.destinationId === tour.destinationId) - Number(a.destinationId === tour.destinationId)
      || Number(b.categoryId === tour.categoryId) - Number(a.categoryId === tour.categoryId)
      || b.popularity - a.popularity)
    .slice(0, 3);
  const reviewAction = !customer.isAuthenticated ? { state: "guest" }
    : reviewable ? { state: "eligible", onWrite: () => setReviewing({ booking: reviewable, open: true }) }
    : completed.length ? { state: "reviewed" } : { state: "none" };

  return (
    <div className="pb-24 lg:pb-0">
      <TourHero tour={tour} cover={photos[0]} photoCount={photos.length} onOpenPhotos={() => setLightboxIndex(0)} />
      <ChapterNav />

      <div className="mx-auto grid max-w-[1320px] items-start gap-12 px-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 xl:gap-20">
        <div className="min-w-0 max-w-[760px] space-y-16 sm:space-y-20">
          <OverviewChapter tour={tour} story={story} />
          <HighlightsChapter highlights={story.highlights} />
          <PhotosChapter photos={photos} onOpen={setLightboxIndex} />
          <ItineraryChapter days={story.itinerary} />
          <IncludedChapter included={story.included} excluded={story.excluded} />
          <DeparturesChapter tour={tour} selection={selection} />
          <ReviewsChapter count={reviews.length} average={average} action={<ReviewButton action={reviewAction} />}>
            <TourReviews reviews={reviews} />
          </ReviewsChapter>
        </div>
        <div className="pt-12 sm:pt-16 lg:self-stretch">
          <BookingCard tour={tour} selection={selection} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="mx-auto mt-24 max-w-[1320px] border-t border-border px-5 py-16 sm:mt-28 sm:py-20 lg:px-8" aria-labelledby="related-tours-title">
          <RelatedHeading />
          <Reveal stagger as="ul" amount={0.1} className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
            {related.map((item) => (
              <RevealItem as="li" key={item.id}>
                <TourCard tour={item} />
              </RevealItem>
            ))}
          </Reveal>
        </section>
      )}

      <Lightbox open={lightboxIndex !== null} items={photos} index={lightboxIndex ?? 0} onIndexChange={setLightboxIndex} onClose={() => setLightboxIndex(null)} />
      {reviewing.booking && <ReviewDialog key={reviewing.booking.id} booking={reviewing.booking} open={reviewing.open} onClose={() => setReviewing((current) => ({ ...current, open: false }))} />}
    </div>
  );
}
