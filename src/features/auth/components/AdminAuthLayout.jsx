import { ShieldCheck } from "lucide-react";
import { useThemeScope } from "../../../app/providers/ThemeProvider";
import { BrandMark } from "../../../components/ui/BrandMark";

// A faint diamond lattice (a nod to carved Khmer stone screens) that fades out from the centre.
const LATTICE = {
  backgroundImage: [
    "repeating-linear-gradient(45deg, color-mix(in oklab, var(--foreground) 7%, transparent) 0 1px, transparent 1px 34px)",
    "repeating-linear-gradient(-45deg, color-mix(in oklab, var(--foreground) 7%, transparent) 0 1px, transparent 1px 34px)",
  ].join(","),
  maskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, #000 0%, transparent 75%)",
  WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, #000 0%, transparent 75%)",
};

/**
 * Admin console sign-in shell: deliberately quiet and photo-free so it never reads as the
 * storefront. Always dark (the `dark` class scopes the dark tokens).
 */
export function AdminAuthLayout({ children }) {
  useThemeScope("admin");

  return (
    <main className="dark relative flex min-h-dvh flex-col overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0" style={LATTICE} aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[60vh] bg-[radial-gradient(ellipse_60%_70%_at_50%_0%,color-mix(in_oklab,var(--accent)_9%,transparent),transparent_70%)]"
        aria-hidden="true"
      />

      <header className="relative z-10 flex items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <div className="flex items-center gap-3 text-foreground">
          <BrandMark compact />
          <span className="h-5 w-px bg-border" aria-hidden="true" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Admin console</span>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full border border-border bg-surface/60 px-3 py-1 text-[11px] font-medium text-muted sm:inline-flex">
          <span className="size-1.5 rounded-full bg-success" aria-hidden="true" /> Restricted access
        </span>
      </header>

      <div className="relative z-10 flex flex-1 items-center justify-center px-4 pb-10 pt-2">{children}</div>

      <footer className="relative z-10 flex flex-col items-center gap-1 px-5 pb-6 text-center text-[11px] text-muted sm:flex-row sm:justify-center sm:gap-3">
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="size-3.5" aria-hidden="true" /> Authorized staff only. Sign-in activity is recorded.
        </span>
        <span className="hidden sm:inline" aria-hidden="true">·</span>
        <span>© {new Date().getFullYear()} TourTrip</span>
      </footer>
    </main>
  );
}
