import { Navigate, useParams } from "react-router-dom";

const TARGETS = { "sign-in": "/login", register: "/register" };

/**
 * Compatibility handler for legacy /account/:mode links: sign-in and register go to the
 * customer auth pages, anything else to My Bookings (guests are asked to sign in first).
 */
export default function AccountPage() {
  const { mode } = useParams();
  return <Navigate to={TARGETS[mode] ?? "/my-bookings"} replace />;
}
