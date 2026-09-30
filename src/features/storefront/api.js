import apiClient from "../../lib/axios";
import {
  publicCategories,
  publicCompanyStats,
  publicDestinations,
  publicGallery,
  publicGuides,
  publicReviews,
  publicTestimonials,
  publicTours,
} from "./mocks";
import { mastersDb } from "../../mocks/masters";
import { getReviewsDb } from "../../mocks/reviews";
import { tourPhotos, tourStory } from "../../mocks/storefrontDetails";

const useMock = import.meta.env.VITE_USE_MOCK !== "false";
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function respond(path, build) {
  if (!useMock) return apiClient.get(path).then(({ data }) => data);
  await wait(450);
  return build();
}

/** Public catalogue: tours, categories and destinations in one request. */
export const getCatalog = () =>
  respond("/public/catalog", () => ({ tours: publicTours(), categories: publicCategories(), destinations: publicDestinations() }));

export const getTestimonials = () => respond("/public/testimonials", () => publicTestimonials());

/** Public general gallery photos. */
export const getGallery = () => respond("/public/gallery", () => publicGallery());

/** Public reviews across all tours with rating statistics. */
export const getStorefrontReviews = () => respond("/public/reviews", () => publicReviews());

/** About page: the guiding team and company figures. */
export const getAbout = () => respond("/public/about", () => ({ team: publicGuides(), stats: publicCompanyStats() }));


/** Contact form. Mock mode just waits and returns a reference number. */
export async function sendContactMessage(message) {
  if (!useMock) return apiClient.post("/public/contact", message).then(({ data }) => data);
  await wait(900);
  return { reference: `MSG-${Date.now().toString(36).slice(-6).toUpperCase()}` };
}

/** One active tour, with the same catalogue, review and departure stores used elsewhere. */
export const getTourDetail = (id) => respond(`/public/tours/${encodeURIComponent(id)}`, () => {
  const tour = publicTours().find((item) => item.id === id);
  if (!tour) return null;
  const master = mastersDb.tours.find((item) => item.id === id);
  const guide = mastersDb.guides.find((item) => item.id === master.guideId);
  return {
    tour,
    master,
    photos: tourPhotos(master),
    story: tourStory(master, guide),
    reviews: getReviewsDb().filter((review) => review.status === "Approved" && review.tourName === tour.name),
    schedules: mastersDb.schedules.filter((schedule) => schedule.tourId === id && schedule.status !== "Inactive"),
  };
});
