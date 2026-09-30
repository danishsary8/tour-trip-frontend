import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Compass } from "lucide-react";
import { StorefrontLayout } from "../features/storefront/layouts/StorefrontLayout";
import { AdminLayout } from "../layouts/AdminLayout";
import { adminRoutes } from "./admin.routes";
import { publicRoutes } from "./public.routes";
import { storefrontRoutes } from "./storefront.routes";
import { ProtectedRoute } from "./ProtectedRoute";

function PageLoader() {
  return (
    <div className="grid min-h-screen place-items-center bg-background text-foreground transition-colors duration-150" role="status">
      <div className="flex flex-col items-center gap-3">
        <Compass className="size-8 animate-spin text-accent" aria-hidden="true" />
        <span className="text-sm font-medium text-muted">Preparing your journey…</span>
      </div>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<StorefrontLayout />}>
          {storefrontRoutes.map((route) => (
            <Route key={route.index ? "storefront-index" : route.path} {...route} />
          ))}
        </Route>

        {publicRoutes.map((route) => (
          <Route key={route.path} {...route} />
        ))}

        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            {adminRoutes.map((route) => (
              <Route key={route.index ? "admin-index" : route.path} {...route} />
            ))}
          </Route>
        </Route>

        <Route path="/admin/manageBooking" element={<Navigate to="/admin/bookings" replace />} />
        <Route path="/admin/customerList" element={<Navigate to="/admin/customers" replace />} />
        <Route path="/admin/categoriesPage" element={<Navigate to="/admin/categories" replace />} />
        <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Suspense>
  );
}
