import { useMemo } from "react";
import { HomeHero } from "../components/HomeHero";
import { CategoriesSection, CtaBand, DestinationsSection, FeaturedToursSection, InternationalSection } from "../components/HomeSections";
import { WhyBookSection } from "../components/HomeTrust";
import { PromoBanner } from "../components/PromoBanner";
import { RecentlyViewed } from "../components/RecentlyViewed";
import { Testimonials } from "../components/Testimonials";
import { useCatalog, useTestimonials } from "../hooks";

const FEATURED_COUNT = 6;

/** Home: hero search, early-booking offer, categories, featured tours, International Escapes, recently viewed, why book, destinations, reviews and a closing CTA. */
export default function HomePage() {
  const catalog = useCatalog();
  const testimonials = useTestimonials();
  const tours = useMemo(() => catalog.data?.tours ?? [], [catalog.data]);
  // Featured tours and the destination mosaic stay Cambodian; International Escapes get their own band.
  const featured = useMemo(
    () => tours.filter((tour) => !tour.international).sort((a, b) => b.popularity - a.popularity).slice(0, FEATURED_COUNT),
    [tours],
  );
  const international = useMemo(() => tours.filter((tour) => tour.international), [tours]);
  const homeDestinations = useMemo(() => (catalog.data?.destinations ?? []).filter((item) => !item.international), [catalog.data]);

  return (
    <>
      <HomeHero destinations={catalog.data?.destinations ?? []} />
      <PromoBanner />
      <CategoriesSection categories={catalog.data?.categories ?? []} loading={catalog.isLoading} />
      <FeaturedToursSection tours={featured} loading={catalog.isLoading} />
      <InternationalSection tours={international} loading={catalog.isLoading} />
      <RecentlyViewed tours={tours} className="pt-20 sm:pt-24" />
      <WhyBookSection />
      <DestinationsSection destinations={homeDestinations} loading={catalog.isLoading} />
      <div className="h-24 sm:h-32" aria-hidden="true" />
      <Testimonials reviews={testimonials.data ?? []} loading={testimonials.isLoading} />
      <CtaBand tourCount={catalog.data?.tours.length} />
    </>
  );
}
