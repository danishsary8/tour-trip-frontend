import { lazy } from "react";
import { Navigate } from "react-router-dom";
import { ComingSoon } from "../components/shared/ComingSoon";

const DashboardPage = lazy(() => import("../pages/admin/dashboard/DashboardPage"));
const ReportsPage = lazy(() => import("../pages/admin/reports/ReportsPage"));
const SettingsPage = lazy(() => import("../pages/admin/settings/SettingsPage"));
const DashboardOverview = lazy(() => import("../pages/admin/dashboard/DashboardOverview"));
const ManageMasters = lazy(() => import("../pages/admin/masters/ManageMaster"));
const BookingsPage = lazy(() => import("../pages/admin/bookings/BookingsPage"));
const ManageBooking = lazy(() => import("../pages/admin/bookings/ManageBooking"));
const CategoriesPage = lazy(() => import("../pages/admin/masters/CategoriesPage"));
const LegacyCategoriesPage = lazy(() => import("../pages/admin/categories/CategoriesPage"));
const CreateCategoryPage = lazy(() => import("../pages/admin/categories/CreateCategoryPage"));
const CustomersPage = lazy(() => import("../pages/admin/customers/CustomersPage"));
const CustomerList = lazy(() => import("../pages/CustomerList"));
const CreateCustomer = lazy(() => import("../pages/admin/customers/CreateCustomer"));
const ReviewsPage = lazy(() => import("../pages/admin/reviews/ReviewsPage"));
const CreateDestination = lazy(() => import("../pages/admin/destinations/CreateDestination"));
const DestinationsPage = lazy(() => import("../pages/admin/masters/DestinationsPage"));
const LegacyDestinationsPage = lazy(() => import("../pages/admin/destinations"));
const TourSchedules = lazy(() => import("../pages/admin/tours/TourSchedules"));
const SchedulesPage = lazy(() => import("../pages/admin/masters/SchedulesPage"));
const ToursPage = lazy(() => import("../pages/admin/masters/ToursPage"));
const GuidesPage = lazy(() => import("../pages/admin/masters/GuidesPage"));
const LegacyGuidesPage = lazy(() => import("../pages/admin/guides/GuidesPage"));
const CreateTour = lazy(() => import("../components/tour/CreateTour"));
const EditTour = lazy(() => import("../components/tour/EditTour"));
const DeleteTour = lazy(() => import("../components/tour/DeleteTour"));

export const adminRoutes = [
  { index: true, element: <DashboardPage /> },
  // Teammate's original dashboard stays reachable until Phase 3 replaces it.
  { path: "dashboard/legacy", element: <DashboardOverview /> },
  { path: "masters", element: <Navigate to="/admin/masters/tours" replace /> },
  { path: "masters/legacy", element: <ManageMasters /> },
  { path: "masters/tours", element: <ToursPage /> },
  { path: "masters/tours/create", element: <Navigate to="/admin/masters/tours?create=1" replace /> },
  { path: "masters/tours/legacy/create", element: <CreateTour /> },
  { path: "masters/tours/edit/:id", element: <EditTour /> },
  { path: "masters/tours/delete/:id", element: <DeleteTour /> },
  { path: "masters/categories", element: <CategoriesPage /> },
  { path: "masters/guides", element: <GuidesPage /> },
  { path: "masters/schedules", element: <SchedulesPage /> },
  { path: "masters/destinations", element: <DestinationsPage /> },
  { path: "masters/destinations/create", element: <CreateDestination /> },
  { path: "bookings", element: <BookingsPage /> },
  { path: "bookings/legacy", element: <ManageBooking /> },
  { path: "categories", element: <Navigate to="/admin/masters/categories" replace /> },
  { path: "categories/create", element: <Navigate to="/admin/masters/categories?create=1" replace /> },
  { path: "categories/legacy", element: <LegacyCategoriesPage /> },
  { path: "categories/legacy/create", element: <CreateCategoryPage /> },
  { path: "customers", element: <CustomersPage /> },
  { path: "customers/create", element: <Navigate to="/admin/customers?create=1" replace /> },
  { path: "customers/legacy", element: <CustomerList /> },
  { path: "customers/legacy/create", element: <CreateCustomer /> },
  { path: "reviews", element: <ReviewsPage /> },
  { path: "destinations", element: <Navigate to="/admin/masters/destinations" replace /> },
  { path: "destinations/create", element: <Navigate to="/admin/masters/destinations?create=1" replace /> },
  { path: "destinations/legacy", element: <LegacyDestinationsPage /> },
  { path: "destinations/legacy/create", element: <CreateDestination /> },
  { path: "tour-schedules", element: <Navigate to="/admin/masters/schedules" replace /> },
  { path: "tour-schedules/legacy", element: <TourSchedules /> },
  { path: "guides", element: <Navigate to="/admin/masters/guides" replace /> },
  { path: "guides/legacy", element: <LegacyGuidesPage /> },
  { path: "reports", element: <ReportsPage /> },
  { path: "settings", element: <SettingsPage /> },
  { path: "profile", element: <ComingSoon title="Profile" description="Your account details, password and two-step verification." /> },
];

// Design review gallery; tree-shaken out of production builds.
if (import.meta.env.DEV) {
  const ComponentKit = lazy(() => import("../pages/admin/kit/ComponentKit"));
  adminRoutes.push({ path: "_kit", element: <ComponentKit /> });
}
