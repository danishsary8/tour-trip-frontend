import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, CalendarCheck, CheckCircle2, Compass, ShieldCheck, Sparkles } from "lucide-react";
import { BrandMark } from "../../../components/ui/BrandMark";
import { ThemeToggle } from "../../../components/ui/ThemeToggle";
import { useThemeScope } from "../../../app/providers/ThemeProvider";
import { safeRedirect } from "./redirect";

export function CustomerAuthShell({
  image,
  imageAlt = "Cambodia travel scenery",
  tagline = "Sacred Heritage & Tropical Sanctuaries",
  title = "Welcome back, traveller",
  subtitle = "Sign in to manage your bookings and explore Cambodia.",
  cardControls,
  children,
  footer,
}) {
  useThemeScope("storefront");
  const [params] = useSearchParams();
  // Arriving from "Book now": offer the way back to that tour (the guest flow's "continue browsing").
  const bookingTourId = safeRedirect(params.get("redirect"), "").match(/^\/booking\/([^/?#]+)/)?.[1];
  const backTo = bookingTourId ? `/tours/${bookingTourId}` : "/";

  return (
    <div className="relative min-h-dvh w-full bg-background text-foreground transition-colors duration-300">
      {/* Top Bar with Brand and Back Navigation */}
      <header className="absolute inset-x-0 top-0 z-30 flex h-18 items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link
          to="/"
          aria-label="TourTrip home"
          className="group flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <BrandMark />
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle tooltip={false} />
          <Link
            to="/tours"
            className="hidden items-center gap-1.5 rounded-full border border-border bg-surface/70 px-4 py-1.5 text-xs font-semibold text-foreground backdrop-blur transition-all duration-200 hover:border-primary/40 hover:bg-surface hover:text-primary focus-visible:ring-2 focus-visible:ring-accent sm:inline-flex"
          >
            <Compass className="size-3.5 text-primary" />
            Explore Tours
          </Link>
          <Link
            to={backTo}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/70 px-3.5 py-1.5 text-xs font-medium text-muted backdrop-blur transition-colors hover:bg-surface hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent"
          >
            <ArrowLeft className="size-3.5" />
            <span className="hidden sm:inline">{bookingTourId ? "Back to tour" : "Back to Home"}</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>
      </header>

      {/* Main Split Layout Grid */}
      <main className="grid min-h-dvh w-full lg:grid-cols-12">
        {/* Left Column: Atmospheric Photo & Travel Storytelling (Desktop) */}
        <section className="relative hidden overflow-hidden lg:col-span-5 lg:flex lg:flex-col lg:justify-between lg:p-12 xl:col-span-6 xl:p-16">
          {/* Background Travel Image */}
          <div className="absolute inset-0 z-0 select-none overflow-hidden">
            <img
              src={image}
              alt={imageAlt}
              className="h-full w-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
              loading="eager"
            />
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/35" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/60" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(233,185,73,.22),transparent_60%)]" />
          </div>

          {/* Left Top Content */}
          <div className="relative z-10 pt-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md">
              <Sparkles className="size-3.5 text-accent" />
              <span>{tagline}</span>
            </div>
          </div>

          {/* Left Bottom Content */}
          <div className="relative z-10 space-y-6 pb-6">
            <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl xl:text-5xl">
              Authentic journeys across the Kingdom of Cambodia
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-white/80">
              Immerse yourself in dawn temple ascents, pristine island hideaways, and the living pulse of the Mekong — led by accredited local guides.
            </p>

            {/* Highlights List */}
            <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
              <div className="flex items-center gap-2.5 text-sm text-white/90">
                <CheckCircle2 className="size-4 shrink-0 text-accent" />
                <span>100% verified local guides</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/90">
                <CheckCircle2 className="size-4 shrink-0 text-accent" />
                <span>Instant reservation hold</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/90">
                <ShieldCheck className="size-4 shrink-0 text-accent" />
                <span>Secure payment simulation</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/90">
                <CheckCircle2 className="size-4 shrink-0 text-accent" />
                <span>24/7 travel concierge</span>
              </div>
            </div>

            {/* Reassurance Badge */}
            <div className="inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-black/40 px-4 py-3 backdrop-blur-lg">
              <div className="flex -space-x-1.5 overflow-hidden">
                <span className="inline-grid size-7 place-items-center rounded-full bg-accent text-[11px] font-bold text-accent-ink ring-2 ring-black/40">
                  SM
                </span>
                <span className="inline-grid size-7 place-items-center rounded-full bg-primary text-[11px] font-bold text-white ring-2 ring-black/40">
                  TD
                </span>
                <span className="inline-grid size-7 place-items-center rounded-full bg-emerald-600 text-[11px] font-bold text-white ring-2 ring-black/40">
                  KL
                </span>
              </div>
              <div className="text-xs text-white/90">
                <span className="font-semibold text-white">4.9 / 5.0</span> from 2,300+ traveller reviews
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Glass Card Form Container */}
        <section className="relative flex flex-col items-center justify-center px-4 py-24 sm:px-6 md:px-10 lg:col-span-7 lg:py-16 xl:col-span-6 xl:px-16">
          {/* Subtle warm background radial light for light and dark modes */}
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_20%,rgba(200,85,61,.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_20%,rgba(233,185,73,.07),transparent_50%)]" />

          {/* Form Card */}
          <motion.div
            animate={cardControls}
            className="w-full max-w-md rounded-3xl border border-border bg-surface/90 p-6 shadow-xl backdrop-blur-2xl transition-[background-color,border-color,box-shadow] duration-200 sm:p-8 md:p-9"
          >
            {/* Header Titles */}
            <div className="mb-6 space-y-1.5">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {title}
              </h2>
              <p className="text-sm leading-relaxed text-muted">
                {subtitle}
              </p>
            </div>

            {bookingTourId && (
              <p className="mb-5 flex items-start gap-2.5 rounded-card border border-primary/20 bg-primary/[0.06] p-3.5 text-sm leading-relaxed text-foreground">
                <CalendarCheck className="mt-0.5 size-4 shrink-0 text-primary-ink" aria-hidden="true" />
                <span>
                  Sign in to finish your booking. Your date and travellers are saved.{" "}
                  <Link to={backTo} className="font-semibold text-primary-ink underline-offset-2 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-primary/60">
                    Keep browsing this tour
                  </Link>
                </span>
              </p>
            )}

            {/* Injected Form Body */}
            {children}

            {/* Injected Footer Link */}
            {footer && <div className="mt-6 pt-5 border-t border-border text-center text-sm text-muted">{footer}</div>}
          </motion.div>
        </section>
      </main>
    </div>
  );
}
