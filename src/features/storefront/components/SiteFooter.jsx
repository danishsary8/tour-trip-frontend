import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BadgeCheck, BadgeDollarSign, Banknote, CalendarCheck, Check, Clock, CreditCard, Landmark, Lock, Mail, MapPin, Phone, Smartphone } from "lucide-react";
import { AngkorLines } from "../../../components/effects/AngkorLines";
import { BrandMark } from "../../../components/ui/BrandMark";
import { motionEase } from "../../../lib/motion";
import { CONTACT, PAYMENT_METHOD_NAMES, SOCIAL_LINKS, TRUST_BADGES } from "../content";
import { Reveal, RevealItem } from "./Reveal";

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { label: "All tours", to: "/tours" },
      { label: "Destinations", to: "/destinations" },
      { label: "Photo gallery", to: "/gallery" },
      { label: "Traveller reviews", to: "/reviews" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", to: "/about" },
      { label: "Meet the guides", to: "/about#team" },
      { label: "Contact", to: "/contact" },
      { label: "FAQ", to: "/faq" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help centre & FAQ", to: "/faq" },
      { label: "Cancellations & refunds", to: "/faq#faq-cancellation" },
      { label: "Payment options", to: "/faq#faq-booking" },
      { label: "Contact support", to: "/contact" },
    ],
  },
];

const BADGE_ICONS = { Lock, BadgeCheck, BadgeDollarSign, CalendarCheck };
/** Icons for the four domain payment methods, keyed by customer-facing name. */
const PAYMENT_ICONS = { Cash: Banknote, "Bank Transfer": Landmark, "ABA Pay": Smartphone, "Credit Card": CreditCard };

const linkClass =
  "rounded text-sm text-muted outline-none transition-colors duration-300 hover:text-foreground focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-accent/60";
const headingClass = "mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-foreground";

function Newsletter() {
  const id = useId();
  const reduceMotion = useReducedMotion();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function onSubmit(event) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address");
      return;
    }
    setError("");
    setSubscribed(true);
  }

  const swap = reduceMotion
    ? {}
    : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: 0.3, ease: motionEase } };

  return (
    <div className="space-y-2">
      <p id={`${id}-title`} className="text-sm font-semibold text-foreground">
        Travel notes, once a month
      </p>
      <p className="text-sm leading-relaxed text-muted">Seasonal tour ideas, festival dates and the odd early-booking code. No spam.</p>
      <AnimatePresence mode="wait" initial={false}>
        {subscribed ? (
          <motion.div key="done" {...swap} role="status" className="flex items-center gap-3 rounded-full border border-success/30 bg-success/10 py-2 pl-2 pr-4">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-success text-white">
              <Check className="size-4" aria-hidden="true" />
            </span>
            <span className="min-w-0 text-sm">
              <span className="font-semibold text-foreground">Thanks! You&apos;re on the list.</span>{" "}
              <button
                type="button"
                onClick={() => {
                  setSubscribed(false);
                  setEmail("");
                }}
                className="rounded text-muted underline-offset-2 outline-none hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-accent/60"
              >
                Use another email
              </button>
            </span>
          </motion.div>
        ) : (
          <motion.form key="form" {...swap} onSubmit={onSubmit} noValidate aria-labelledby={`${id}-title`} className="flex gap-2">
            <label htmlFor={id} className="sr-only">
              Email address
            </label>
            <input
              id={id}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${id}-error` : undefined}
              className="h-11 min-w-0 flex-1 rounded-full border border-border bg-surface px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted hover:border-foreground/25 focus:border-primary focus:ring-2 focus:ring-primary/20 aria-[invalid=true]:border-danger/70"
            />
            <button
              type="submit"
              className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-primary px-5 text-sm font-semibold text-white outline-none transition-[background-color,transform] duration-300 hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95"
            >
              Subscribe <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </motion.form>
        )}
      </AnimatePresence>
      {error && !subscribed && (
        <p id={`${id}-error`} role="alert" className="text-xs text-danger-ink">
          {error}
        </p>
      )}
    </div>
  );
}

function TrustRow() {
  return (
    <div className="relative border-t border-border">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-5 px-5 py-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <ul className="flex flex-wrap gap-2" aria-label="Why travellers trust TourTrip">
          {TRUST_BADGES.map((badge) => {
            const Icon = BADGE_ICONS[badge.icon] ?? BadgeCheck;
            return (
              <li key={badge.label} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-semibold text-foreground">
                <Icon className="size-4 text-success-ink" aria-hidden="true" />
                {badge.label}
              </li>
            );
          })}
        </ul>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-medium text-muted">We accept</span>
          <ul className="flex flex-wrap gap-2" aria-label="Payment methods">
            {PAYMENT_METHOD_NAMES.map((method) => {
              const Icon = PAYMENT_ICONS[method] ?? CreditCard;
              return (
                <li key={method} className="inline-flex items-center gap-1.5 rounded-control border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-foreground">
                  <Icon className="size-3.5 text-muted" aria-hidden="true" />
                  {method}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-surface-2/60">
      <AngkorLines className="pointer-events-none absolute -right-10 bottom-24 h-40 w-[520px] max-w-[90%] text-accent/15" />
      <Reveal stagger className="relative mx-auto grid max-w-[1320px] grid-cols-[minmax(0,1fr)] gap-10 px-5 py-16 sm:grid-cols-3 lg:grid-cols-[1.35fr_0.75fr_0.75fr_0.85fr_1.4fr] lg:gap-8 lg:px-8">
        <RevealItem className="space-y-4 sm:col-span-3 lg:col-span-1">
          <BrandMark className="text-foreground" />
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            Small-group journeys across Cambodia with local guides — from sunrise at Angkor Wat to Kampot&apos;s pepper farms and the islands off Kep.
          </p>
          <ul className="space-y-1.5 text-sm text-muted">
            <li className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0" aria-hidden="true" /> Street 240, Phnom Penh
            </li>
            <li>
              <a href={CONTACT.phoneHref} className={`${linkClass} inline-flex items-center gap-2`}>
                <Phone className="size-4 shrink-0" aria-hidden="true" /> {CONTACT.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT.email}`} className={`${linkClass} inline-flex items-center gap-2`}>
                <Mail className="size-4 shrink-0" aria-hidden="true" /> {CONTACT.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="size-4 shrink-0" aria-hidden="true" /> 24/7 support in English &amp; Khmer
            </li>
          </ul>
        </RevealItem>

        {COLUMNS.map((column) => (
          <RevealItem as="nav" key={column.title} aria-label={column.title}>
            <h2 className={headingClass}>{column.title}</h2>
            <ul className="space-y-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </RevealItem>
        ))}

        <RevealItem className="space-y-6 sm:col-span-3 lg:col-span-1">
          <Newsletter />
          <div>
            <h2 className={headingClass}>Follow the journey</h2>
            <ul className="flex gap-2">
              {SOCIAL_LINKS.map(({ label, Icon }) => (
                <li key={label}>
                  {/* Social accounts are placeholders until TourTrip's real profiles exist. */}
                  <a
                    href="#"
                    onClick={(event) => event.preventDefault()}
                    aria-label={`TourTrip on ${label}`}
                    className="grid size-10 place-items-center rounded-full border border-border text-muted outline-none transition-[color,background-color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:text-primary-ink focus-visible:ring-2 focus-visible:ring-accent/70 active:translate-y-0"
                  >
                    <Icon className="size-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </RevealItem>
      </Reveal>

      <TrustRow />

      <div className="relative border-t border-border">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-2 px-5 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} TourTrip Cambodia. All rights reserved.</p>
          <p>Prices in USD · Made with care in Phnom Penh</p>
        </div>
      </div>
    </footer>
  );
}
