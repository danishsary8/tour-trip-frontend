import { lazy } from "react";
import { RequireCustomer } from "../features/storefront/auth/RequireCustomer";

const HomePage = lazy(() => import("../features/storefront/pages/HomePage"));
const AccountPage = lazy(() => import("../features/storefront/pages/AccountPage"));
const ToursPage = lazy(() => import("../features/storefront/pages/ToursPage"));
const DestinationsPage = lazy(() => import("../features/storefront/pages/DestinationsPage"));
const GalleryPage = lazy(() => import("../features/storefront/pages/GalleryPage"));
const ReviewsPage = lazy(() => import("../features/storefront/pages/ReviewsPage"));
const AboutPage = lazy(() => import("../features/storefront/pages/AboutPage"));
const ContactPage = lazy(() => import("../features/storefront/pages/ContactPage"));
const FaqPage = lazy(() => import("../features/storefront/pages/FaqPage"));
const NotFoundPage = lazy(() => import("../features/storefront/pages/NotFoundPage"));
const TourDetailPage = lazy(() => import("../features/storefront/pages/TourDetailPage"));
const BookingStubPage = lazy(() => import("../features/storefront/pages/BookingStubPage"));
const WishlistPage = lazy(() => import("../features/storefront/pages/WishlistPage"));
const CustomerBookingsPage = lazy(() => import("../features/storefront/pages/CustomerBookingsPage"));

/** Public storefront pages rendered inside StorefrontLayout. */
export const storefrontRoutes = [
  { index: true, element: <HomePage /> },
  { path: "tours", element: <ToursPage /> },
  { path: "destinations", element: <DestinationsPage /> },
  { path: "gallery", element: <GalleryPage /> },
  { path: "reviews", element: <ReviewsPage /> },
  { path: "about", element: <AboutPage /> },
  { path: "contact", element: <ContactPage /> },
  { path: "faq", element: <FaqPage /> },
  { path: "tours/:id", element: <TourDetailPage /> },
  { path: "wishlist", element: <WishlistPage /> },
  { path: "booking/:tourId", element: <RequireCustomer><BookingStubPage /></RequireCustomer> },
  { path: "account/bookings", element: <RequireCustomer><CustomerBookingsPage /></RequireCustomer> },
  { path: "account/:mode", element: <AccountPage /> },
  // Any URL no other route claims (public, not /admin) lands on the branded 404.
  { path: "*", element: <NotFoundPage /> },
];
