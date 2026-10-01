/**
 * Public-facing view of the shared mock catalogue. Nothing here is a second copy of the
 * tour list: tours, categories and destinations come from `mastersDb` (the Masters admin
 * data, which the dashboard also uses), popularity from the shared bookings store and
 * ratings from the reviews store. This file only adds storefront presentation copy.
 */
import { HOME_COUNTRY, dashboardDb, toKey, addDays } from "../../mocks/dashboard";
import { mastersDb } from "../../mocks/masters";
import { getReviewsDb } from "../../mocks/reviews";
import { TOUR_PHOTOS } from "../../mocks/tourImages";

/** Marketing copy keyed by tour id; tours without an entry fall back to their Masters description. */
const TOUR_COPY = {
  "angkor-sunrise": { tagline: "Watch dawn break over the five towers, then explore Bayon and Ta Prohm before the crowds.", duration: "Full day · from 5 am" },
  "phnom-penh-city": { tagline: "The Royal Palace, Silver Pagoda and riverside markets, with time for a Mekong sunset.", duration: "Full day" },
  "koh-rong": { tagline: "Speedboat to Saracen Bay, snorkel clear water and stay for bioluminescent plankton.", duration: "3 days · 2 nights" },
  "kampot-adventure": { tagline: "Kayak the green river at golden hour and taste pepper straight from the vine.", duration: "2 days · 1 night" },
  "kulen-mountain": { tagline: "Waterfalls, the River of a Thousand Lingas and a reclining Buddha carved in stone.", duration: "Full day" },
  "bokor-hill": { tagline: "Misty colonial ruins, cool mountain air and sweeping views of the Gulf of Thailand.", duration: "Full day" },
  "tonle-sap-village": { tagline: "Glide between stilted homes and flooded forest on Southeast Asia's largest lake.", duration: "Half day" },
  "siem-reap-street-food": { tagline: "Night markets, grilled skewers and num banh chok by tuk-tuk with a local foodie.", duration: "Evening · 4 hours" },
  "kep-rabbit-island": { tagline: "Fresh crab with Kampot pepper at the market, then a lazy afternoon on Rabbit Island.", duration: "Full day" },
  "battambang-countryside": { tagline: "Ride the bamboo train through green fields, meet local makers and explore Battambang's slower rhythms.", duration: "Full day" },
  "bali-highlands": { tagline: "Walk the Tegallalang rice terraces at first light, then cross the cool highlands to the lake temple of Ulun Danu Beratan.", duration: "5 days · 4 nights" },
  "hanoi-halong-bay": { tagline: "Old Quarter mornings and train-street coffee in Hanoi, then a night aboard a junk among Ha Long Bay's limestone islands.", duration: "4 days · 3 nights" },
  "kyoto-temples-gardens": { tagline: "Climb through Fushimi Inari's vermilion gates, wander Gion at dusk and walk the bamboo grove at Arashiyama before the crowds.", duration: "5 days · 4 nights" },
};

/** Short descriptions for the Home destination cards. */
const DESTINATION_COPY = {
  "siem-reap": "Temples, floating villages and night markets",
  "phnom-penh": "Royal palaces and riverside life",
  kampot: "Pepper farms, rivers and misty hills",
  sihanoukville: "Gateway to Koh Rong's beaches",
  kep: "Crab markets and island afternoons",
  battambang: "Bamboo trains, creative makers and countryside",
  bali: "Rice terraces, lake temples and highland villages",
  "hanoi-ha-long": "Old Quarter streets and a night on Ha Long Bay",
  kyoto: "Shrines, gardens and the bamboo grove at Arashiyama",
};

const POPULAR_WINDOW_DAYS = 90;

function approvedReviews() {
  return getReviewsDb().filter((review) => review.status === "Approved");
}

function popularity() {
  const since = toKey(addDays(dashboardDb.today, -POPULAR_WINDOW_DAYS));
  const counts = new Map();
  for (const booking of dashboardDb.bookings) {
    if (booking.bookingDate >= since && booking.status !== "Cancelled") counts.set(booking.tourId, (counts.get(booking.tourId) ?? 0) + 1);
  }
  return counts;
}

/** Active tours in the public shape used by TourCard and the listing filters. */
export function publicTours() {
  const categories = new Map(mastersDb.categories.map((category) => [category.id, category]));
  const reviews = approvedReviews();
  const bookings = popularity();
  const active = mastersDb.tours.filter((tour) => tour.status !== "Inactive");
  const ranked = [...active].sort((a, b) => (bookings.get(b.id) ?? 0) - (bookings.get(a.id) ?? 0));

  return active.map((tour) => {
    const tourReviews = reviews.filter((review) => review.tourName === tour.name);
    const rating = tourReviews.length ? tourReviews.reduce((sum, review) => sum + review.rating, 0) / tourReviews.length : null;
    const rank = ranked.indexOf(tour);
    const copy = TOUR_COPY[tour.id];
    const days = tour.durationDays ?? 1;
    return {
      id: tour.id,
      name: tour.name,
      destination: tour.destination,
      destinationId: tour.destinationId,
      country: tour.country ?? HOME_COUNTRY,
      international: (tour.country ?? HOME_COUNTRY) !== HOME_COUNTRY,
      category: categories.get(tour.categoryId)?.name ?? "",
      categoryId: tour.categoryId,
      price: tour.price,
      durationDays: days,
      durationLabel: copy?.duration ?? (days > 1 ? `${days} days` : "Full day"),
      groupSize: tour.capacity,
      image: tour.coverImage ?? tour.image,
      tagline: copy?.tagline ?? tour.description,
      rating,
      reviewCount: tourReviews.length,
      popularity: bookings.get(tour.id) ?? 0,
      tag: rank === 0 ? "Bestseller" : rank < 3 ? "Popular" : !tourReviews.length ? "New" : null,
    };
  });
}

export function publicCategories() {
  const tours = mastersDb.tours.filter((tour) => tour.status !== "Inactive");
  return mastersDb.categories
    .filter((category) => category.status !== "Inactive")
    .map((category) => ({
      id: category.id,
      name: category.name,
      icon: category.icon,
      description: category.description,
      tourCount: tours.filter((tour) => tour.categoryId === category.id).length,
    }));
}

export function publicDestinations() {
  const tours = mastersDb.tours.filter((tour) => tour.status !== "Inactive");
  return mastersDb.destinations
    .filter((destination) => destination.status !== "Inactive")
    .map((destination) => ({
      id: destination.id,
      name: destination.name,
      province: destination.province,
      country: destination.country ?? HOME_COUNTRY,
      international: (destination.country ?? HOME_COUNTRY) !== HOME_COUNTRY,
      image: destination.image,
      blurb: DESTINATION_COPY[destination.id] ?? destination.description,
      tourCount: tours.filter((tour) => tour.destinationId === destination.id).length,
    }));
}

/** Approved 4–5★ reviews for the Home testimonials, newest first. */
export function publicTestimonials(limit = 8) {
  return approvedReviews()
    .filter((review) => review.rating >= 4)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit)
    .map((review) => ({
      id: review.id,
      name: review.customerName,
      initials: review.initials,
      tourName: review.tourName,
      tourId: mastersDb.tours.find((tour) => tour.name === review.tourName)?.id ?? null,
      rating: review.rating,
      quote: review.comment,
      date: review.createdAt,
    }));
}

/** Site-wide gallery: every photo of every active tour (cover first), labelled with where it was taken. */
export function publicGallery() {
  const categories = new Map(mastersDb.categories.map((category) => [category.id, category.name]));
  return mastersDb.tours
    .filter((tour) => tour.status !== "Inactive")
    .flatMap((tour) =>
      (TOUR_PHOTOS[tour.id] ?? []).map((photo, index) => ({
        id: `gal-${tour.id}-${index}`,
        src: photo.src,
        title: photo.title,
        caption: photo.alt,
        tourId: tour.id,
        tourName: tour.name,
        destinationId: tour.destinationId,
        destination: tour.destination,
        categoryId: tour.categoryId,
        category: categories.get(tour.categoryId) ?? "",
      })),
    );
}

/** Approved reviews across all tours with aggregate rating stats (pending and hidden ones stay private). */
export function publicReviews() {
  const reviews = approvedReviews();
  const toursMap = new Map(mastersDb.tours.map((t) => [t.name, t]));

  const list = reviews.map((review) => {
    const tour = toursMap.get(review.tourName);
    return {
      id: review.id,
      customerName: review.customerName,
      initials: review.initials,
      tourName: review.tourName,
      tourId: tour?.id ?? null,
      destinationId: tour?.destinationId ?? null,
      destination: tour?.destination ?? "Cambodia",
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      dateKey: review.dateKey,
      daysAgo: review.daysAgo,
      status: review.status,
    };
  });

  const totalReviews = list.length;
  const averageRating = totalReviews
    ? Number((list.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
    : 5.0;

  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  for (const item of list) {
    if (ratingCounts[item.rating] !== undefined) {
      ratingCounts[item.rating] += 1;
    }
  }

  return {
    reviews: list,
    stats: {
      totalReviews,
      averageRating,
      ratingCounts,
    },
  };
}

/** Guides from Masters for the About page team grid, with the active tours each one leads. */
export function publicGuides() {
  const tours = mastersDb.tours.filter((tour) => tour.status !== "Inactive");
  return mastersDb.guides
    .filter((guide) => guide.status !== "Inactive")
    .map((guide) => {
      const leads = tours.filter((tour) => tour.guideId === guide.id);
      return {
        id: guide.id,
        name: guide.name,
        initials: guide.initials,
        languages: guide.languages ?? [],
        image: leads[0]?.coverImage ?? leads[0]?.image ?? null,
        tours: leads.map((tour) => ({ id: tour.id, name: tour.name })),
      };
    });
}

/**
 * About page figures, counted from the shared stores rather than typed in. Departures and
 * travellers come from Completed bookings; `since` is the first year in the bookings data.
 */
export function publicCompanyStats() {
  const completed = dashboardDb.bookings.filter((booking) => booking.status === "Completed");
  const departures = new Set(completed.map((booking) => `${booking.tourId}|${booking.travelDate}`));
  const firstBooking = dashboardDb.bookings.reduce((min, booking) => (booking.bookingDate < min ? booking.bookingDate : min), toKey(dashboardDb.today));
  const tours = mastersDb.tours.filter((tour) => tour.status !== "Inactive");
  const reviews = approvedReviews();
  return {
    departures: departures.size,
    travellers: completed.reduce((sum, booking) => sum + booking.guests, 0),
    destinations: new Set(tours.map((tour) => tour.destinationId)).size,
    since: Number(firstBooking.slice(0, 4)),
    rating: reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : null,
  };
}
