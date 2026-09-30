import { Link, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Compass, Home } from "lucide-react";
import { AngkorLines } from "../../../components/effects/AngkorLines";
import { motionEase } from "../../../lib/motion";
import { Reveal, RevealItem } from "../components/Reveal";

const SUGGESTIONS = [
  { label: "Destinations", to: "/destinations" },
  { label: "Photo gallery", to: "/gallery" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact us", to: "/contact" },
];

/** "4 ☉ 4": a setting sun with a slowly turning compass rose stands in for the zero, over Angkor's towers. */
function LostIllustration() {
  const reduceMotion = useReducedMotion();
  return (
    <div className="relative mx-auto h-44 w-full max-w-md sm:h-56" aria-hidden="true">
      <AngkorLines className="absolute inset-x-0 bottom-0 h-24 w-full text-foreground/15 sm:h-28" />
      <div className="absolute inset-x-0 top-0 flex items-center justify-center gap-3 font-display text-[112px] font-semibold leading-none tracking-[-0.06em] text-foreground sm:gap-5 sm:text-[160px]">
        <span>4</span>
        <span className="relative grid size-[96px] place-items-center sm:size-[136px]">
          <span className="absolute inset-0 rounded-full bg-gradient-to-b from-accent to-primary shadow-[0_20px_60px_-20px_var(--primary)]" />
          <motion.svg
            viewBox="0 0 100 100"
            className="relative size-[70%] text-white"
            animate={reduceMotion ? undefined : { rotate: [0, 18, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeOpacity=".45" strokeWidth="2" strokeDasharray="2 6" />
            <path d="M50 8 L58 50 L50 92 L42 50 Z" fill="currentColor" fillOpacity=".35" />
            <path d="M50 8 L58 50 L42 50 Z" fill="currentColor" />
            <path d="M8 50 L50 44 L92 50 L50 56 Z" fill="currentColor" fillOpacity=".25" />
            <circle cx="50" cy="50" r="5" fill="#241a06" />
          </motion.svg>
        </span>
        <span>4</span>
      </div>
    </div>
  );
}

/** Catch-all for unknown storefront URLs. */
export default function NotFoundPage() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden px-5 pb-24 pt-32 sm:pb-32 sm:pt-40" aria-labelledby="not-found-title">
      <span className="pointer-events-none absolute left-1/2 top-24 size-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(233,185,73,.18),transparent_65%)]" aria-hidden="true" />
      <div className="relative mx-auto max-w-2xl text-center">
        <motion.div initial={reduceMotion ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: motionEase }}>
          <LostIllustration />
        </motion.div>
        <Reveal stagger className="mt-10">
          <RevealItem as="p" className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-ink">
            Page not found
          </RevealItem>
          <RevealItem as="h1" id="not-found-title" className="mt-3 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-balance text-foreground sm:text-5xl">
            This path isn&apos;t on our map
          </RevealItem>
          <RevealItem as="p" className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-pretty text-muted sm:text-lg">
            Even our guides take a wrong turn at Ta Prohm now and then. The page{" "}
            <code className="break-all rounded-md bg-foreground/[0.06] px-1.5 py-0.5 font-mono text-sm text-foreground">{location.pathname}</code> has moved or never existed.
          </RevealItem>
          <RevealItem className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_24px_-10px_var(--primary)] outline-none transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-0"
            >
              <Home className="size-4" aria-hidden="true" /> Back to Home
            </Link>
            <Link
              to="/tours"
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface px-7 py-3.5 text-sm font-semibold text-foreground outline-none transition-[background-color,border-color] duration-300 hover:border-primary/40 hover:bg-primary/[0.06] focus-visible:ring-2 focus-visible:ring-accent/70"
            >
              <Compass className="size-4" aria-hidden="true" /> Browse tours
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </RevealItem>
          <RevealItem as="nav" aria-label="Popular pages" className="mt-12 border-t border-border pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Or try</p>
            <ul className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              {SUGGESTIONS.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="rounded font-semibold text-foreground underline-offset-4 outline-none transition-colors hover:text-primary-ink hover:underline focus-visible:ring-2 focus-visible:ring-primary/60">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}
