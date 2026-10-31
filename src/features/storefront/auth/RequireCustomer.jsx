import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useCustomerAuth } from "./CustomerAuthContext";
import { authPath } from "./redirect";

/** Customer-only page: guests are sent to sign in and come straight back here afterwards. */
export function RequireCustomer({ children }) {
  const { isAuthenticated } = useCustomerAuth();
  const location = useLocation();
  const [ownPath] = useState(location.pathname);
  if (!isAuthenticated) {
    // Signing out navigates home while this page is still animating out. The exiting page keeps
    // its old router location, so compare with the browser's real path and don't bounce to sign-in.
    if (window.location.pathname !== ownPath) return null;
    return <Navigate to={authPath(`${location.pathname}${location.search}`)} replace />;
  }
  return children;
}
