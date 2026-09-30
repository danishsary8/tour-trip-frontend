import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { toast } from "sonner";
import { BrandMark } from "../../../components/ui/BrandMark";
import { ThemeToggle } from "../../../components/ui/ThemeToggle";
import { useEscapeLayer } from "../../../hooks/useEscapeLayer";
import { useFocusTrap } from "../../../hooks/useFocusTrap";
import { motionEase } from "../../../lib/motion";
import { ACCOUNT_LINKS, STOREFRONT_MORE_NAV, STOREFRONT_NAV } from "../navigation";
import { useCustomerAuth } from "../auth/CustomerAuthContext";

function MenuPanel({ onClose }) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const firstPath = useRef(`${location.pathname}${location.hash}`);
  const reduceMotion = useReducedMotion();
  const { isAuthenticated, user, logout } = useCustomerAuth();

  function handleSignOut() {
    logout();
    onClose();
    toast.info("You have signed out of your account.");
    navigate("/", { replace: true });
  }

  useFocusTrap(panelRef, true, { initialFocusRef: closeRef });
  useEscapeLayer(true, onClose);

  // Close after navigating (including hash links to Home sections).
  useEffect(() => {
    if (`${location.pathname}${location.hash}` !== firstPath.current) onClose();
  }, [location, onClose]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const item = (index) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0, transition: { duration: 0.45, delay: 0.12 + index * 0.06, ease: motionEase } },
          exit: { opacity: 0, transition: { duration: 0.15 } },
        };

  return (
    <motion.div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      initial={reduceMotion ? { opacity: 0 } : { clipPath: "circle(0% at calc(100% - 40px) 36px)" }}
      animate={reduceMotion ? { opacity: 1 } : { clipPath: "circle(150% at calc(100% - 40px) 36px)" }}
      exit={reduceMotion ? { opacity: 0 } : { clipPath: "circle(0% at calc(100% - 40px) 36px)", transition: { duration: 0.35, ease: motionEase } }}
      transition={{ duration: 0.5, ease: motionEase }}
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-background text-foreground lg:hidden"
    >
      <div className="flex h-18 items-center justify-between px-5">
        <BrandMark className="text-foreground" />
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="grid size-10 place-items-center rounded-full outline-none transition-colors hover:bg-foreground/[0.06] focus-visible:ring-2 focus-visible:ring-accent/70 active:scale-95"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>

      <nav aria-label="Main" className="flex flex-1 flex-col justify-center gap-8 px-6 py-6">
        <ul className="space-y-1">
          {STOREFRONT_NAV.map((link, index) => (
            <motion.li key={link.label} {...item(index)}>
              <Link
                to={link.to}
                onClick={onClose}
                aria-current={link.match(location) ? "page" : undefined}
                className="group flex items-center justify-between rounded-card px-2 py-2 font-display text-3xl font-semibold tracking-[-0.03em] outline-none transition-colors hover:text-primary-ink focus-visible:ring-2 focus-visible:ring-accent/70 aria-[current=page]:text-primary-ink"
              >
                {link.label}
                <ArrowUpRight className="size-6 opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-1 group-hover:opacity-100" aria-hidden="true" />
              </Link>
            </motion.li>
          ))}
        </ul>
        <motion.div {...item(STOREFRONT_NAV.length)} className="grid grid-cols-2 gap-x-4 gap-y-6 border-t border-border pt-6">
          {STOREFRONT_MORE_NAV.map((group) => (
            <div key={group.title}>
              <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{group.title}</p>
              <ul className="space-y-0.5">
                {group.items.map(({ label, to, icon: Icon, match }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      onClick={onClose}
                      aria-current={match(location) ? "page" : undefined}
                      className="flex items-center gap-2.5 rounded-control px-2 py-2 text-base font-semibold outline-none transition-colors hover:text-primary-ink focus-visible:ring-2 focus-visible:ring-accent/70 aria-[current=page]:text-primary-ink"
                    >
                      <Icon className="size-4 text-primary-ink" aria-hidden="true" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>
      </nav>

      <motion.div {...item(STOREFRONT_NAV.length + 1)} className="space-y-4 border-t border-border px-6 py-6">
        {isAuthenticated ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3.5">
              <span className="grid size-10 place-items-center rounded-xl bg-primary text-sm font-bold text-white shadow-xs">
                {user?.initials || "CU"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground truncate text-sm">{user?.name || "Traveller"}</p>
                <p className="text-xs text-muted truncate">{user?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <Link
                to={ACCOUNT_LINKS.bookings}
                onClick={onClose}
                className="flex items-center justify-center rounded-full bg-primary px-4 py-3 text-center text-sm font-semibold text-white outline-none transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-accent/70"
              >
                My bookings
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center justify-center rounded-full border border-danger/30 bg-danger/10 px-4 py-3 text-center text-sm font-semibold text-danger-ink focus-visible:ring-2 focus-visible:ring-accent/70 outline-none transition-colors hover:bg-danger/20 active:scale-95"
              >
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Link
              to={ACCOUNT_LINKS.signIn}
              onClick={onClose}
              className="rounded-full border border-border px-5 py-3 text-center text-sm font-semibold outline-none transition-colors hover:bg-foreground/[0.06] focus-visible:ring-2 focus-visible:ring-accent/70"
            >
              Sign in
            </Link>
            <Link
              to={ACCOUNT_LINKS.register}
              onClick={onClose}
              className="rounded-full bg-primary px-5 py-3 text-center text-sm font-semibold text-white outline-none transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-accent/70"
            >
              Register
            </Link>
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-muted pt-1">
          <span>Appearance</span>
          <ThemeToggle tooltip={false} className="hover:bg-foreground/[0.06]" />
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Full-screen mobile menu that expands from the menu button. */
export function MobileMenu({ open, onClose }) {
  return createPortal(<AnimatePresence>{open && <MenuPanel key="menu" onClose={onClose} />}</AnimatePresence>, document.body);
}
