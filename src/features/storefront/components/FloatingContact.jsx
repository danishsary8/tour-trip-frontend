import { useEffect, useId, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronRight, HelpCircle, Mail, MessageCircle, Phone, X } from "lucide-react";
import { usePopover } from "../../../hooks/usePopover";
import { cn } from "../../../lib/cn";
import { motionEase } from "../../../lib/motion";
import { CONTACT } from "../content";
import { WhatsappIcon } from "./SocialIcons";

/** Office hours in Phnom Penh time decide the "online now" dot; WhatsApp is answered 24/7 for guests on tour. */
function isOfficeOpen(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Phnom_Penh", weekday: "short", hour: "numeric", hourCycle: "h23" }).formatToParts(now);
  const hour = Number(parts.find((part) => part.type === "hour")?.value);
  const sunday = parts.find((part) => part.type === "weekday")?.value === "Sun";
  return sunday ? hour >= 9 && hour < 17 : hour >= 8 && hour < 20;
}

const OPTIONS = [
  {
    key: "whatsapp",
    label: "WhatsApp",
    detail: CONTACT.whatsapp,
    badge: "Fastest",
    href: CONTACT.whatsappHref,
    external: true,
    icon: WhatsappIcon,
    iconClass: "bg-[#25d366] text-[#0b1215]",
  },
  { key: "phone", label: "Call us", detail: CONTACT.phone, href: CONTACT.phoneHref, icon: Phone, iconClass: "bg-primary/12 text-primary-ink" },
  { key: "email", label: "Email", detail: CONTACT.email, href: `mailto:${CONTACT.email}`, icon: Mail, iconClass: "bg-accent/20 text-accent-ink" },
];

const rowClass =
  "group flex items-center gap-3 rounded-card px-3 py-2.5 outline-none transition-colors hover:bg-foreground/[0.05] focus-visible:bg-foreground/[0.05] focus-visible:ring-2 focus-visible:ring-primary/50";

/**
 * Bottom-right contact button that opens WhatsApp / phone / email options. On a tour page below
 * `lg` it sits higher so it clears the mobile sticky booking bar.
 */
export function FloatingContact() {
  const id = useId();
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const { open, toggle, close, triggerRef, panelRef } = usePopover();
  const firstRef = useRef(null);
  // Tour Detail and checkout have a sticky price bar at the bottom below lg.
  const onTourPage = /^\/(tours|booking)\/[^/]+/.test(location.pathname);
  const online = open && isOfficeOpen();

  useEffect(() => {
    close();
  }, [location.pathname, close]);

  useEffect(() => {
    if (!open) return undefined;
    const frame = requestAnimationFrame(() => firstRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  return (
    <div className={cn("fixed right-4 z-30 flex flex-col items-end gap-3 sm:right-6", onTourPage ? "bottom-24 lg:bottom-6" : "bottom-4 sm:bottom-6")}>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            id={`${id}-panel`}
            role="dialog"
            aria-labelledby={`${id}-title`}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 8, transition: { duration: 0.15 } }}
            transition={{ duration: 0.28, ease: motionEase }}
            style={{ transformOrigin: "bottom right" }}
            className="w-[min(340px,calc(100vw-2rem))] overflow-hidden rounded-panel border border-border bg-surface text-foreground shadow-panel"
          >
            <div className="relative overflow-hidden bg-[#0b1215] px-5 pb-5 pt-5 text-white">
              <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,85,61,.55),transparent_60%)]" aria-hidden="true" />
              <div className="relative">
                <p id={`${id}-title`} className="font-display text-xl font-semibold tracking-[-0.02em]">
                  Suosdey! How can we help?
                </p>
                <p className="mt-1 text-sm text-white/75">Questions about a tour or your booking — ask a local.</p>
                <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
                  <span className={cn("size-2 rounded-full", online ? "bg-[#25d366] shadow-[0_0_0_3px_rgba(37,211,102,.25)]" : "bg-accent")} aria-hidden="true" />
                  {online ? "Online now · replies in minutes" : "Office closed · WhatsApp still answered"}
                </p>
              </div>
            </div>
            <ul className="p-2">
              {OPTIONS.map((option, index) => {
                const Icon = option.icon;
                return (
                  <li key={option.key}>
                    <a
                      ref={index === 0 ? firstRef : undefined}
                      href={option.href}
                      {...(option.external ? { target: "_blank", rel: "noreferrer" } : {})}
                      onClick={() => close()}
                      className={rowClass}
                    >
                      <span className={cn("grid size-10 shrink-0 place-items-center rounded-full", option.iconClass)}>
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2 text-sm font-semibold">
                          {option.label}
                          {option.badge && <span className="rounded-full bg-success/12 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-success-ink">{option.badge}</span>}
                        </span>
                        <span className="block truncate text-xs text-muted">{option.detail}</span>
                      </span>
                      <ChevronRight className="size-4 shrink-0 text-muted transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                      {option.external && <span className="sr-only">(opens WhatsApp)</span>}
                    </a>
                  </li>
                );
              })}
              <li className="mt-1 border-t border-border pt-1">
                <Link to="/faq" onClick={() => close()} className={cn(rowClass, "text-sm text-muted hover:text-foreground")}>
                  <HelpCircle className="ml-2.5 size-4" aria-hidden="true" />
                  <span className="flex-1">Quick answers in our FAQ</span>
                  <ChevronRight className="size-4" aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={open ? `${id}-panel` : undefined}
        aria-label={open ? "Close contact options" : "Contact TourTrip"}
        className="group relative grid size-14 place-items-center rounded-full bg-primary text-white shadow-[0_14px_34px_-10px_var(--primary)] outline-none transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95"
      >
        {!open && <span className="absolute inset-0 rounded-full bg-primary/50 motion-safe:animate-[ping_2.4s_cubic-bezier(0,0,0.2,1)_3]" aria-hidden="true" />}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "close" : "chat"}
            initial={reduceMotion ? false : { rotate: -90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={reduceMotion ? undefined : { rotate: 90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.2, ease: motionEase }}
            className="relative"
          >
            {open ? <X className="size-6" aria-hidden="true" /> : <MessageCircle className="size-6" aria-hidden="true" />}
          </motion.span>
        </AnimatePresence>
        <span className="pointer-events-none absolute right-[calc(100%+12px)] hidden whitespace-nowrap rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm font-semibold text-foreground opacity-0 shadow-soft transition-[opacity,transform] duration-300 group-hover:translate-x-0 group-hover:opacity-100 sm:block sm:translate-x-2" aria-hidden="true">
          {open ? "Close" : "Chat with a local"}
        </span>
      </button>
    </div>
  );
}
