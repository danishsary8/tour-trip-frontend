import { useEffect, useId, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, LogOut, X } from "lucide-react";
import { cn } from "../../lib/cn";
import { motionEase } from "../../lib/motion";
import { useAuth } from "../../features/auth/AuthContext";
import { useShellSummary } from "../../features/notifications/hooks";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { AngkorLines } from "../effects/AngkorLines";
import { BrandMark } from "../ui/BrandMark";
import { Tooltip } from "../ui/Tooltip";
import { NAV_GROUPS, findActiveNavPath } from "./navigation";
import { useShell } from "./shellContext";
import { SidebarItem } from "./SidebarItem";

const SIDEBAR_WIDTH = { full: 260, rail: 76 };
const railSpring = { type: "spring", stiffness: 320, damping: 34, mass: 0.9 };

function GroupLabel({ children, rail }) {
  if (rail) return <span className="mx-auto my-3 block h-px w-6 bg-border" aria-hidden="true" />;
  return (
    <p className="px-3.5 pb-2 pt-5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted">{children}</p>
  );
}

function NavGroup({ group, rail, activePath, badges, onNavigate }) {
  const reduceMotion = useReducedMotion();
  const listId = useId();
  const containsActive = group.items.some((item) => item.path === activePath);
  const [open, setOpen] = useState(true);
  const [prevContainsActive, setPrevContainsActive] = useState(containsActive);
  // Re-open when navigating into this group so the active page is never hidden.
  if (containsActive !== prevContainsActive) {
    setPrevContainsActive(containsActive);
    if (containsActive) setOpen(true);
  }
  // Rail mode has no room for a header, so its icons always show.
  const expanded = rail || open;

  const list = (
    <ul className="flex flex-col gap-0.5">
      {group.items.map((item) => (
        <li key={item.id}>
          <SidebarItem
            item={item}
            rail={rail}
            active={item.path === activePath}
            badgeCount={item.badge ? badges?.[item.badge] : 0}
            onNavigate={onNavigate}
          />
        </li>
      ))}
    </ul>
  );

  if (!group.collapsible) {
    return (
      <div role="group" aria-label={group.label}>
        <GroupLabel rail={rail}>{group.label}</GroupLabel>
        {list}
      </div>
    );
  }

  return (
    <div role="group" aria-label={group.label}>
      {rail ? (
        <GroupLabel rail />
      ) : (
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={expanded}
          aria-controls={listId}
          className="group mt-5 mb-1 flex w-full items-center justify-between rounded-lg px-3.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted outline-none transition-colors duration-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/60"
        >
          {group.label}
          <motion.span animate={{ rotate: expanded ? 0 : -90 }} transition={{ duration: reduceMotion ? 0 : 0.22, ease: motionEase }}>
            <ChevronDown className="size-3.5" aria-hidden="true" />
          </motion.span>
        </button>
      )}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id={listId}
            key="list"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.26, ease: motionEase }}
            className="overflow-hidden"
          >
            {list}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProfileCard({ rail, profile }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const name = profile?.name ?? "Admin";
  const role = profile?.role ?? "Administrator";
  const email = user?.email ?? profile?.email;

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const avatar = (
    <span className="relative grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-accent font-display text-sm font-semibold text-white shadow-[0_6px_18px_-8px_var(--primary)] ring-2 ring-surface">
      {name.charAt(0)}
      <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-success ring-2 ring-surface" aria-hidden="true" />
    </span>
  );

  const logoutButton = (
    <button
      type="button"
      onClick={handleLogout}
      aria-label="Log out"
      className="grid size-9 shrink-0 place-items-center rounded-lg text-muted outline-none transition-[color,background-color,transform] duration-200 hover:bg-danger/12 hover:text-danger-ink focus-visible:ring-2 focus-visible:ring-danger/60 active:scale-95"
    >
      <LogOut className="size-4" aria-hidden="true" />
    </button>
  );

  if (rail) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Tooltip label={`${name} · ${role}`}>
          <span tabIndex={0} className="block rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
            {avatar}
          </span>
        </Tooltip>
        <Tooltip label="Log out">{logoutButton}</Tooltip>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-card border border-border bg-surface-2/60 p-2.5">
      {avatar}
      <div className="min-w-0 flex-1 leading-tight">
        <p className="truncate text-sm font-semibold text-foreground">{name}</p>
        <p className="truncate text-xs text-muted" title={email}>
          {role}
        </p>
      </div>
      {logoutButton}
    </div>
  );
}

/** Brand, grouped navigation and profile. Shared by the desktop sidebar and the mobile drawer. */
export function SidebarContent({ rail = false, headerAction, onNavigate }) {
  const { pathname } = useLocation();
  const { data } = useShellSummary();
  const activePath = findActiveNavPath(pathname);

  return (
    <div className="relative flex h-full flex-col">
      {/* golden-hour wash */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-primary/10 via-accent/[0.03] to-transparent"
        aria-hidden="true"
      />

      <div className={cn("relative flex h-16 shrink-0 items-center", rail ? "justify-center px-2" : "justify-between px-5")}>
        <BrandMark compact={rail} showText={!rail} className="text-foreground" />
        {headerAction}
      </div>

      <LayoutGroup id="sidebar-nav">
        <nav
          aria-label="Admin"
          className="relative flex-1 overflow-y-auto overflow-x-hidden px-3 pb-4 [scrollbar-width:thin]"
        >
          {NAV_GROUPS.map((group) => (
            <NavGroup
              key={group.id}
              group={group}
              rail={rail}
              activePath={activePath}
              badges={data?.badges}
              onNavigate={onNavigate}
            />
          ))}
          {!rail && <AngkorLines className="mx-auto mt-8 h-12 w-[85%] text-accent/20" />}
        </nav>
      </LayoutGroup>

      <div className="relative shrink-0 border-t border-border p-3">
        <ProfileCard rail={rail} profile={data?.profile} />
      </div>
    </div>
  );
}

/** Desktop sidebar: springs between the full column and the icon rail. */
export function Sidebar() {
  const { collapsed } = useShell();
  const reduceMotion = useReducedMotion();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? SIDEBAR_WIDTH.rail : SIDEBAR_WIDTH.full }}
      transition={reduceMotion ? { duration: 0 } : railSpring}
      className="relative z-40 h-dvh shrink-0 overflow-hidden border-r border-border bg-surface/80 backdrop-blur-xl"
    >
      <SidebarContent rail={collapsed} />
    </motion.aside>
  );
}

/** Below 1024px the sidebar becomes a slide-in drawer opened from the topbar. */
export function MobileSidebar() {
  const { mobileOpen, setMobileOpen } = useShell();
  const { pathname } = useLocation();
  const reduceMotion = useReducedMotion();
  const panelRef = useRef(null);
  const close = () => setMobileOpen(false);

  useFocusTrap(panelRef, mobileOpen);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const onKeyDown = (event) => event.key === "Escape" && setMobileOpen(false);
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen, setMobileOpen]);

  return (
    <AnimatePresence>
      {mobileOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.24 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-background/55 backdrop-blur-md"
            aria-hidden="true"
          />
          <motion.aside
            key="drawer"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%", transition: { duration: reduceMotion ? 0 : 0.2, ease: motionEase } }}
            transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 38 }}
            className="fixed inset-y-0 left-0 z-50 w-[min(300px,86vw)] border-r border-border bg-surface shadow-panel"
          >
            <SidebarContent
              onNavigate={close}
              headerAction={
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close navigation"
                  className="grid size-10 place-items-center rounded-lg text-muted outline-none transition-[color,background-color,transform] duration-200 hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/60 active:scale-95"
                >
                  <X className="size-5" aria-hidden="true" />
                </button>
              }
            />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
