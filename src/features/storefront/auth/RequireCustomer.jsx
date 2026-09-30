import { Navigate, useLocation } from "react-router-dom";
import { useCustomerAuth } from "./CustomerAuthContext";
import { authPath } from "./redirect";

/** Customer-only page: guests are sent to sign in and come straight back here afterwards. */
export function RequireCustomer({ children }) {
  const { isAuthenticated } = useCustomerAuth();
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to={authPath(`${location.pathname}${location.search}`)} replace />;
  return children;
}
