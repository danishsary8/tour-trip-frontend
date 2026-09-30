import { lazy } from "react";
import { Navigate } from "react-router-dom";
import AdminLoginPage from "../pages/auth/AdminLoginPage";

const CustomerLoginPage = lazy(() => import("../features/storefront/pages/CustomerLoginPage"));
const CustomerRegisterPage = lazy(() => import("../features/storefront/pages/CustomerRegisterPage"));
const ForgotPassword = lazy(() => import("../pages/customer/ForgotPassword"));
const TourDetail = lazy(() => import("../components/tour/TourDetailHero"));
const TripDetailPage = lazy(() => import("../pages/public/trips/TripDetailPage"));
const PublicHome = lazy(() => import("../pages/public/PublicHome"));

export const publicRoutes = [
  { path: "/login", element: <CustomerLoginPage /> },
  { path: "/register", element: <CustomerRegisterPage /> },
  { path: "/admin/login", element: <AdminLoginPage /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/tour/detail", element: <TourDetail /> },
  { path: "/trips/:id", element: <TripDetailPage /> },
  // The legacy checkout (components/booking/BookingPage) offered non-domain payment methods;
  // bookings now start from a tour page and run through /booking/:tourId.
  { path: "/booking", element: <Navigate to="/tours" replace /> },
  { path: "/explore", element: <PublicHome /> },
];
