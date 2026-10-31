import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Compass } from "lucide-react";
import { StorefrontLayout } from "../features/storefront/layouts/StorefrontLayout";
import { AdminLayout } from "../layouts/AdminLayout";
import { adminRoutes } from "./admin.routes";
import { publicRoutes } from "./public.routes";
import { storefrontRoutes } from "./storefront.routes";

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
          <Route index element={<Navigate to="/admin" replace />} />
          {storefrontRoutes.filter((route) => !route.index).map((route) => (
            <Route key={route.path} {...route} />
          ))}
        </Route>

        <Route path="/storefront" element={<StorefrontLayout />}>
          <Route index element={storefrontRoutes.find((route) => route.index)?.element} />
        </Route>

        {publicRoutes.map((route) => (
          <Route key={route.path} {...route} />
        ))}

        <Route path="/admin" element={<AdminLayout />}>
          {adminRoutes.map((route) => (
            <Route key={route.index ? "admin-index" : route.path} {...route} />
          ))}
        </Route>

        <Route path="/admin/manageBooking" element={<Navigate to="/admin/bookings" replace />} />
        <Route path="/admin/customerList" element={<Navigate to="/admin/customers" replace />} />
        <Route path="/admin/categoriesPage" element={<Navigate to="/admin/categories" replace />} />
        <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Suspense>
  );
}
