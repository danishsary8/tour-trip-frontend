import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { Calendar, ChevronDown, Compass, Heart, LogOut, Menu } from "lucide-react";
import { toast } from "sonner";
import { PopoverPanel } from "../../../components/ui/Popover";
import { usePopover } from "../../../hooks/usePopover";
import { BrandMark } from "../../../components/ui/BrandMark";
import { ThemeToggle } from "../../../components/ui/ThemeToggle";
import { cn } from "../../../lib/cn";
import { ACCOUNT_LINKS, STOREFRONT_MORE_NAV, STOREFRONT_NAV, STOREFRONT_SECONDARY_NAV } from "../navigation";
import { useCustomerAuth } from "../auth/CustomerAuthContext";
import { useWishlist } from "../wishlist";
import { MobileMenu } from "./MobileMenu";

const navLinkClass = (transparent, active) =>
  cn(
    "relative rounded-full px-4 py-2 text-[15px] font-medium outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-accent/70 active:scale-[0.98]",
    transparent ? "text-white/85 hover:text-white" : "text-muted hover:text-foreground",
    active && (transparent ? "text-white" : "text-foreground"),
  );

function Underline({ reduceMotion }) {
  return (
    <motion.span
      layoutId="storefront-nav-underline"
      transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
      className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-accent"
      aria-hidden="true"
    />
  );
}

/** "More" dropdown: Gallery and Reviews under Explore; About, Contact and FAQ under Company. */
function MoreMenu({ transparent, reduceMotion }) {
  const location = useLocation();
  const { open, toggle, close, triggerRef, panelRef } = usePopover();
  const active = STOREFRONT_SECONDARY_NAV.some((item) => item.match(location));

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(navLinkClass(transparent, active), "inline-flex items-center gap-1 pr-3")}
      >
        More
        <ChevronDown className={cn("size-4 transition-transform duration-300", open && "rotate-180")} aria-hidden="true" />
        {active && <Underline reduceMotion={reduceMotion} />}
      </button>
      <PopoverPanel ref={panelRef} open={open} align="left" label="More pages" className="grid w-[480px] grid-cols-2 gap-1 p-2">
        {STOREFRONT_MORE_NAV.map((group) => (
          <div key={group.title} role="group" aria-label={group.title}>
            <p className="px-3 pb-1.5 pt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{group.title}</p>
            {group.items.map(({ label, to, description, icon: Icon, match }) => {
              const current = match(location);
              return (
                <Link
                  key={to}
                  to={to}
                  role="menuitem"
                  aria-current={current ? "page" : undefined}
                  onClick={() => close()}
                  className="group flex items-start gap-3 rounded-control p-3 outline-none transition-colors hover:bg-foreground/[0.05] focus-visible:bg-foreground/[0.05] focus-visible:ring-2 focus-visible:ring-primary/50 aria-[current=page]:bg-primary/[0.07]"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary-ink transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                    <Icon className="size-[18px]" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-foreground">{label}</span>
                    <span className="mt-0.5 block text-xs leading-snug text-muted">{description}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        ))}
      </PopoverPanel>
    </div>
  );
}

/** Heart link to /wishlist with a live count badge that pops when it changes. */
function WishlistLink({ transparent }) {
  const { count } = useWishlist();
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const active = location.pathname === ACCOUNT_LINKS.wishlist;

  return (
    <Link
      to={ACCOUNT_LINKS.wishlist}
      aria-label={count ? `Wishlist, ${count} saved ${count === 1 ? "tour" : "tours"}` : "Wishlist"}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative grid size-10 place-items-center rounded-full outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-accent/70 active:scale-95",
        transparent ? "text-white hover:bg-white/15" : "text-foreground hover:bg-foreground/[0.06]",
        active && !transparent && "bg-primary/10 text-primary-ink",
      )}
    >
      <Heart className={cn("size-5", count > 0 && (transparent ? "fill-white/90" : "fill-primary text-primary"))} aria-hidden="true" />
      {count > 0 && (
        <motion.span
          key={count}
          initial={reduceMotion ? false : { scale: 0.4 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 520, damping: 16 }}
          className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-accent px-1 text-[10px] font-bold tabular-nums text-[#241a06] ring-2 ring-background"
          aria-hidden="true"
        >
          {count > 99 ? "99+" : count}
        </motion.span>
      )}
    </Link>
  );
}

/** Signed-in traveller menu: same popover pattern as More (arrow keys, Esc, outside click). */
function ProfileMenu({ user, transparent, onSignOut }) {
  const { open, toggle, close, triggerRef, panelRef } = usePopover();
  const firstName = user?.name ? user.name.split(" ")[0] : "Account";
  const itemClass =
    "flex w-full items-center gap-2.5 rounded-control px-3 py-2 text-left text-sm font-medium outline-none transition-colors hover:bg-foreground/[0.05] focus-visible:bg-foreground/[0.05] focus-visible:ring-2 focus-visible:ring-primary/50";

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account menu for ${user?.name ?? "traveller"}`}
        className={cn(
          "flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 text-sm font-semibold outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-accent/70 active:scale-[0.98]",
          transparent ? "border border-white/25 bg-white/10 text-white hover:bg-white/20" : "border border-border bg-surface text-foreground hover:border-primary/40",
        )}
      >
        <span className="grid size-7 place-items-center rounded-full bg-primary text-xs font-bold text-white">{user?.initials || "TT"}</span>
        <span className="hidden max-w-[100px] truncate sm:inline">{firstName}</span>
        <ChevronDown className={cn("size-3.5 transition-transform duration-300", open && "rotate-180", transparent ? "text-white/80" : "text-muted")} aria-hidden="true" />
      </button>
      <PopoverPanel ref={panelRef} open={open} label="Account" className="w-64 p-2">
        <div className="border-b border-border px-3 pb-3 pt-2">
          <p className="text-xs text-muted">Signed in as</p>
          <p className="mt-0.5 truncate font-semibold text-foreground">{user?.name || "Traveller"}</p>
          <p className="truncate text-xs text-muted">{user?.email}</p>
        </div>
        <div className="space-y-0.5 py-1.5">
          <Link to={ACCOUNT_LINKS.bookings} role="menuitem" onClick={() => close()} className={itemClass}>
            <Calendar className="size-4 text-primary-ink" aria-hidden="true" /> My bookings
          </Link>
          <Link to={ACCOUNT_LINKS.wishlist} role="menuitem" onClick={() => close()} className={itemClass}>
            <Heart className="size-4 text-primary-ink" aria-hidden="true" /> Saved tours
          </Link>
          <Link to="/tours" role="menuitem" onClick={() => close()} className={itemClass}>
            <Compass className="size-4 text-muted" aria-hidden="true" /> Explore tours
          </Link>
        </div>
        <div className="border-t border-border pt-1.5">
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              close();
              onSignOut();
            }}
            className={cn(itemClass, "text-danger-ink hover:bg-danger/10 focus-visible:bg-danger/10")}
          >
            <LogOut className="size-4" aria-hidden="true" /> Sign out
          </button>
        </div>
      </PopoverPanel>
    </div>
  );
}

/**
 * Sticky site header. Over the Home hero it starts transparent with light text, then turns
 * into a blurred solid bar once the page scrolls past the top of the hero.
 */
export function SiteHeader({ overHero = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const { isAuthenticated, user, logout } = useCustomerAuth();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = overHero && !scrolled;

  function handleSignOut() {
    // Leave the page first, so a signed-in-only page (My bookings) doesn't bounce to sign-in.
    navigate("/", { replace: true });
    window.setTimeout(logout, 0);
    toast.info("You have signed out of your account.");
  }

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,box-shadow,color] duration-500",
          transparent
            ? "border-b border-transparent bg-gradient-to-b from-black/45 to-transparent text-white"
            : "border-b border-border bg-background/82 text-foreground shadow-[0_10px_30px_-24px_rgba(0,0,0,.45)] backdrop-blur-xl",
        )}
      >
        <div className="mx-auto flex h-18 max-w-[1320px] items-center gap-4 px-5 lg:px-8">
          <Link to="/" aria-label="TourTrip home" className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-accent/70">
            <BrandMark className={transparent ? "text-white" : "text-foreground"} />
          </Link>

          <LayoutGroup id="storefront-nav">
            <nav aria-label="Main" className="ml-8 hidden items-center gap-1 lg:flex">
              {STOREFRONT_NAV.map((item) => {
                const active = item.match(location);
                return (
                  <Link key={item.label} to={item.to} aria-current={active ? "page" : undefined} className={navLinkClass(transparent, active)}>
                    {item.label}
                    {active && <Underline reduceMotion={reduceMotion} />}
                  </Link>
                );
              })}
              <MoreMenu transparent={transparent} reduceMotion={reduceMotion} />
            </nav>
          </LayoutGroup>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle
              tooltip={false}
              className={transparent ? "text-white hover:bg-white/15" : "hover:bg-foreground/[0.06]"}
              iconClassName={transparent ? "text-white fill-transparent" : undefined}
            />
            <WishlistLink transparent={transparent} />

            {isAuthenticated ? (
              <ProfileMenu user={user} transparent={transparent} onSignOut={handleSignOut} />
            ) : (
              /* Guest Navigation */
              <>
                <Link
                  to={ACCOUNT_LINKS.signIn}
                  className={cn(
                    "hidden rounded-full px-4 py-2 text-sm font-semibold outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-accent/70 active:scale-[0.98] sm:inline-flex",
                    transparent ? "text-white hover:bg-white/15" : "text-foreground hover:bg-foreground/[0.06]",
                  )}
                >
                  Sign in
                </Link>
                <Link
                  to={ACCOUNT_LINKS.register}
                  className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_-10px_var(--primary)] outline-none transition-[background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-0 sm:inline-flex"
                >
                  Register
                </Link>
              </>
            )}

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className={cn(
                "grid size-10 place-items-center rounded-full outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent/70 active:scale-95 lg:hidden",
                transparent ? "text-white hover:bg-white/15" : "text-foreground hover:bg-foreground/[0.06]",
              )}
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
