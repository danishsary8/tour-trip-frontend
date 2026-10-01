import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, CalendarCheck, ChevronLeft, ChevronRight, Compass } from "lucide-react";
import { BrandMark } from "../../../components/ui/BrandMark";
import { useThemeScope } from "../../../app/providers/ThemeProvider";
import { Aurora } from "../../../components/effects/Aurora";
import { TextSlideshow } from "../../../components/effects/TextSlideshow";
import { useAbout, useCatalog } from "../hooks";
import { AUTH_SLIDES } from "./authSlides";
import { useBookingReturn } from "./redirect";

/** Traveller-facing figures, computed from the shared mock catalogue, bookings and reviews. */
function useTravellerStats() {
  const { data: about } = useAbout();
  const { data: catalog } = useCatalog();

  return useMemo(() => {
    const stats = [];
    const travellers = about?.stats?.travellers;
    if (travellers) {
      const floor = travellers >= 100 ? Math.floor(travellers / 50) * 50 : travellers;
      stats.push({ value: `${floor.toLocaleString("en-US")}+`, label: "Happy travellers" });
    }
    if (catalog?.tours?.length) stats.push({ value: String(catalog.tours.length), label: "Tours to book" });
    if (about?.stats?.rating) stats.push({ value: `${about.stats.rating.toFixed(1)}★`, label: "Average rating" });
    return stats;
  }, [about, catalog]);
}

/**
 * Customer sign-in, registration and password reset share this photo-led shell: a crossfading
 * destination slideshow with traveller stats on the left and a glass card on the right. It is
 * always dark (the `dark` class scopes the dark tokens) so the form reads over photography,
 * whatever the storefront theme is.
 */
export function CustomerAuthLayout({ children }) {
  useThemeScope("storefront");
  const [activeSlide, setActiveSlide] = useState(0);
  const reduceMotion = useReducedMotion();
  const stats = useTravellerStats();
  const { tourId, backTo } = useBookingReturn();

  const step = (offset) => setActiveSlide((prev) => (prev + offset + AUTH_SLIDES.length) % AUTH_SLIDES.length);

  return (
    <main className="dark grain relative min-h-dvh overflow-hidden bg-[#081013] text-white">
      <div className="pointer-events-none absolute inset-0 select-none overflow-hidden">
        {AUTH_SLIDES.map((slide, i) => {
          const isActive = activeSlide === i;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? "z-0 opacity-100" : "-z-10 opacity-0"}`}
              aria-hidden={!isActive}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                className="h-full w-full scale-[1.02] object-cover object-center"
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
              />
              <div className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${slide.glowStyle} ${isActive ? "opacity-100" : "opacity-0"}`} />
            </div>
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(5,12,15,.93)_0%,rgba(5,12,15,.72)_45%,rgba(5,12,15,.52)_68%,rgba(5,12,15,.78)_100%)] max-lg:bg-[linear-gradient(180deg,rgba(5,12,15,.62)_0%,rgba(5,12,15,.86)_38%,rgba(5,12,15,.97)_100%)]" />
      <Aurora className="pointer-events-none z-10 opacity-45" />

      <button
        type="button"
        onClick={() => step(-1)}
        aria-label="Previous destination slide"
        className="group absolute left-3 top-1/2 z-40 -translate-y-1/2 rounded-full border border-white/15 bg-black/40 p-2.5 text-white/70 shadow-2xl backdrop-blur-md transition-all duration-200 hover:scale-110 hover:border-white/35 hover:bg-black/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-95 sm:left-4 lg:left-6 xl:left-8 max-lg:hidden"
      >
        <ChevronLeft className="size-5 transition-transform group-hover:-translate-x-0.5" />
      </button>
      <button
        type="button"
        onClick={() => step(1)}
        aria-label="Next destination slide"
        className="group absolute right-3 top-1/2 z-40 -translate-y-1/2 rounded-full border border-white/15 bg-black/40 p-2.5 text-white/70 shadow-2xl backdrop-blur-md transition-all duration-200 hover:scale-110 hover:border-white/35 hover:bg-black/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-95 sm:right-4 lg:right-6 xl:right-8 max-lg:hidden"
      >
        <ChevronRight className="size-5 transition-transform group-hover:translate-x-0.5" />
      </button>

      <header className="relative z-40 mx-auto flex w-full max-w-[1680px] items-center justify-between gap-3 px-5 pt-6 sm:px-12 lg:px-16 xl:px-24 2xl:px-32">
        <Link to="/" aria-label="TourTrip home" className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-accent">
          <BrandMark className="text-white" />
        </Link>
        <nav aria-label="Leave sign-in" className="flex items-center gap-2">
          <Link
            to="/tours"
            className="hidden items-center gap-1.5 rounded-full border border-white/15 bg-black/30 px-4 py-1.5 text-xs font-semibold text-white/85 backdrop-blur transition-colors hover:border-white/35 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:inline-flex"
          >
            <Compass className="size-3.5 text-accent" aria-hidden="true" /> Explore tours
          </Link>
          <Link
            to={backTo}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/30 px-3.5 py-1.5 text-xs font-medium text-white/70 backdrop-blur transition-colors hover:border-white/35 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            {tourId ? "Back to tour" : "Back to home"}
          </Link>
        </nav>
      </header>

      <div className="relative z-30 mx-auto grid min-h-[calc(100dvh-4.5rem)] w-full min-w-0 max-w-[1680px] grid-cols-[minmax(0,1.15fr)_minmax(460px,.85fr)] items-center gap-12 px-8 pb-8 sm:px-12 lg:px-16 xl:px-24 2xl:px-32 max-lg:grid-cols-1 max-lg:content-start max-lg:gap-0 max-lg:px-5 max-lg:pb-10">
        <section className="flex min-w-0 flex-col justify-end py-8 max-lg:pb-6 max-lg:pt-8">
          <div className="max-w-[700px]">
            <TextSlideshow slides={AUTH_SLIDES} activeIndex={activeSlide} onSlideChange={setActiveSlide} />

            {stats.length > 0 && (
              <motion.ul
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.09, delayChildren: 0.3 } } }}
                className="mt-6 flex flex-wrap gap-3 max-lg:hidden"
                aria-label="TourTrip in numbers"
              >
                {stats.map((stat) => (
                  <motion.li
                    key={stat.label}
                    variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } }}
                    whileHover={reduceMotion ? undefined : { y: -3 }}
                    className="rounded-full border border-white/13 bg-white/8 px-4 py-2.5 shadow-lg backdrop-blur-xl"
                  >
                    <span className="font-display text-sm font-semibold text-white">{stat.value}</span>
                    <span className="ml-2 text-xs text-white/60">{stat.label}</span>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </div>
        </section>

        <section className="flex min-w-0 items-center justify-center max-lg:w-full">{children}</section>
      </div>
    </main>
  );
}

/** The glass form card. `cardControls` lets a page shake it on a failed submit. */
export function AuthCard({
  kicker,
  title,
  subtitle,
  bookingNote = "Sign in to finish your booking. Your date and travellers are saved.",
  cardControls,
  footer,
  children,
}) {
  const { tourId, backTo } = useBookingReturn();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="w-full min-w-0 max-w-[480px]"
    >
      <motion.div
        animate={cardControls}
        className="rounded-[24px] border border-white/14 bg-[#10191d]/94 p-6 shadow-[0_24px_70px_rgba(0,0,0,.55),inset_0_1px_rgba(255,255,255,.12)] sm:p-8 lg:p-9"
      >
        <div className="mb-6">
          {kicker}
          <h2 className="font-display text-3xl font-semibold tracking-[-0.04em] text-white sm:text-[2.15rem]">{title}</h2>
          {subtitle && <p className="mt-2 text-sm leading-relaxed text-white/60">{subtitle}</p>}
        </div>

        {tourId && (
          <p className="mb-5 flex items-start gap-2.5 rounded-control border border-accent/25 bg-accent/10 p-3.5 text-sm leading-relaxed text-white/85">
            <CalendarCheck className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
            <span>
              {bookingNote}{" "}
              <Link to={backTo} className="font-semibold text-accent underline-offset-2 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-accent">
                Keep browsing this tour
              </Link>
            </span>
          </p>
        )}

        {children}

        {footer && <div className="mt-6 border-t border-white/10 pt-5 text-center text-sm text-white/60">{footer}</div>}
      </motion.div>
    </motion.div>
  );
}

/** Small pill shown above a card title, e.g. "Traveller account". */
export function AuthKicker({ icon: Icon, children }) {
  return (
    <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.17em] text-white/65">
      {Icon && <Icon className="size-3 text-accent" aria-hidden="true" />} {children}
    </span>
  );
}
