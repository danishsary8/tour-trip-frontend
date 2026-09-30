import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, ChevronRight, LogOut, Menu, PanelLeftClose, PanelLeftOpen, Search, Settings, UserRound } from "lucide-react";
import { useAuth } from "../../features/auth/AuthContext";
import { useShellSummary } from "../../features/notifications/hooks";
import { usePopover } from "../../hooks/usePopover";
import { cn } from "../../lib/cn";
import { motionEase } from "../../lib/motion";
import { MenuItem, PopoverPanel } from "../ui/Popover";
import { ThemeToggle } from "../ui/ThemeToggle";
import { Tooltip } from "../ui/Tooltip";
import { findActiveNavItem, labelForSegment } from "./navigation";
import { NotificationsMenu } from "./NotificationsMenu";
import { useShell } from "./shellContext";
import { iconButtonClass, isMacPlatform } from "./shellUtils";

const ACTION_SEGMENTS = new Set(["create", "edit", "delete"]);

function segmentCrumbs(base, segments, skipLabel) {
  const crumbs = [];
  segments.forEach((segment, index) => {
    const previous = segments[index - 1];
    // `/edit/42` reads as "Edit", not "Edit / Details".
    if (previous && ACTION_SEGMENTS.has(previous) && /\d/.test(segment)) return;
    const label = labelForSegment(segment);
    if (label === skipLabel) return;
    crumbs.push({
      href: `${base}/${segments.slice(0, index + 1).join("/")}`,
      label,
      linkable: !ACTION_SEGMENTS.has(segment),
    });
  });
  return crumbs;
}

/** Crumbs follow the navigation structure, e.g. Admin / Masters / Tours / Create. */
function buildCrumbs(pathname) {
  const root = { key: "root", href: "/admin", label: "Admin", linkable: true };
  const active = findActiveNavItem(pathname);

  if (!active) {
    const segments = pathname.split("/").filter(Boolean).slice(1);
    return [root, ...segmentCrumbs("/admin", segments)];
  }

  const { item, group, matchedPath } = active;
  const crumbs = [root];
  if (group.crumb) crumbs.push({ href: `#${group.id}`, label: group.crumb, linkable: false });
  crumbs.push({ href: item.path, label: item.label, linkable: true });
  const rest = pathname.slice(matchedPath.length).split("/").filter(Boolean);
  return [...crumbs, ...segmentCrumbs(matchedPath, rest, item.label)];
}

function Breadcrumbs() {
  const { pathname } = useLocation();
  const reduceMotion = useReducedMotion();
  const crumbs = buildCrumbs(pathname);

  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex min-w-0 items-center gap-1 text-sm">
        <AnimatePresence initial={false} mode="popLayout">
          {crumbs.map((crumb, index) => {
            const last = index === crumbs.length - 1;
            return (
              <motion.li
                key={crumb.key ?? crumb.href}
                layout={reduceMotion ? false : "position"}
                initial={reduceMotion ? false : { opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 6, transition: { duration: 0.12 } }}
                transition={{ duration: 0.24, ease: motionEase, delay: reduceMotion ? 0 : index * 0.03 }}
                className={cn("min-w-0 items-center gap-1", last ? "flex" : "hidden sm:flex")}
              >
                {index > 0 && <ChevronRight className="hidden size-3.5 shrink-0 text-muted/60 sm:block" aria-hidden="true" />}
                {last ? (
                  <span aria-current="page" className="truncate font-display text-[15px] font-semibold text-foreground">
                    {crumb.label}
                  </span>
                ) : crumb.linkable ? (
                  <Link
                    to={crumb.href}
                    className="truncate rounded-md px-1 text-muted outline-none transition-colors duration-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/60"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="truncate px-1 text-muted">{crumb.label}</span>
                )}
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ol>
    </nav>
  );
}

function SearchTrigger() {
  const { setPaletteOpen } = useShell();
  const [isMac] = useState(isMacPlatform);

  return (
    <>
      <button
        type="button"
        onClick={() => setPaletteOpen(true)}
        aria-label="Search or jump to (Ctrl K)"
        aria-keyshortcuts={isMac ? "Meta+K" : "Control+K"}
        className="group hidden h-10 w-56 items-center gap-2.5 rounded-full border border-border bg-surface/60 pl-3.5 pr-1.5 text-sm text-muted outline-none transition-[border-color,background-color,box-shadow,color] duration-200 hover:border-foreground/20 hover:bg-surface hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/60 active:scale-[0.99] md:flex lg:w-72"
      >
        <Search className="size-4 shrink-0 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
        <span className="flex-1 truncate text-left">Search or jump to…</span>
        <kbd className="rounded-md border border-border bg-surface-2 px-1.5 py-0.5 font-sans text-[11px] font-medium text-muted">
          {isMac ? "⌘K" : "Ctrl K"}
        </kbd>
      </button>
      <button type="button" onClick={() => setPaletteOpen(true)} aria-label="Search or jump to" className={cn(iconButtonClass, "md:hidden")}>
        <Search className="size-[18px]" aria-hidden="true" />
      </button>
    </>
  );
}

function ProfileMenu() {
  const { open, toggle, close, triggerRef, panelRef } = usePopover();
  const { user, logout } = useAuth();
  const { data } = useShellSummary();
  const navigate = useNavigate();
  const name = data?.profile?.name ?? "Admin";
  const role = data?.profile?.role ?? "Administrator";
  const email = user?.email ?? data?.profile?.email;

  function go(path) {
    close();
    navigate(path);
  }

  function handleLogout() {
    close();
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="group flex items-center gap-2 rounded-full py-1 pl-1 pr-1 outline-none transition-colors duration-200 hover:bg-foreground/[0.06] focus-visible:ring-2 focus-visible:ring-primary/60 active:scale-[0.98] sm:pr-2.5"
      >
        <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-primary to-accent font-display text-sm font-semibold text-white ring-2 ring-background">
          {name.charAt(0)}
        </span>
        <span className="hidden text-left leading-tight xl:block">
          <span className="block text-sm font-medium text-foreground">{name}</span>
          <span className="block text-[11px] text-muted">{role}</span>
        </span>
        <ChevronDown
          className={cn("hidden size-4 text-muted transition-transform duration-200 sm:block", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      <PopoverPanel ref={panelRef} open={open} label="Account" className="w-64">
        <div className="mb-1 border-b border-border px-2.5 pb-2.5 pt-1.5" role="none">
          <p className="truncate text-sm font-semibold">{name}</p>
          <p className="truncate text-xs text-muted">{email}</p>
        </div>
        <MenuItem icon={UserRound} onClick={() => go("/admin/profile")}>
          Profile
        </MenuItem>
        <MenuItem icon={Settings} onClick={() => go("/admin/settings")}>
          Settings
        </MenuItem>
        <div className="my-1 h-px bg-border" role="separator" />
        <MenuItem icon={LogOut} tone="danger" onClick={handleLogout}>
          Log out
        </MenuItem>
      </PopoverPanel>
    </div>
  );
}

export function Topbar() {
  const { collapsed, toggleCollapsed, mobileOpen, setMobileOpen, isDesktop, scrollRef } = useShell();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return undefined;
    const onScroll = () => setScrolled(element.scrollTop > 4);
    onScroll();
    element.addEventListener("scroll", onScroll, { passive: true });
    return () => element.removeEventListener("scroll", onScroll);
  }, [scrollRef]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 bg-background/72 px-3 backdrop-blur-xl sm:gap-3 sm:px-6">
      <motion.span
        initial={false}
        animate={{ opacity: scrolled ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-border shadow-[0_8px_24px_-12px_rgba(0,0,0,.35)]"
        aria-hidden="true"
      />

      {isDesktop ? (
        <Tooltip label={collapsed ? "Expand sidebar" : "Collapse sidebar"} side="bottom" className="inline-flex">
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-pressed={collapsed}
            className={cn(iconButtonClass, "rounded-control")}
          >
            {collapsed ? <PanelLeftOpen className="size-[18px]" aria-hidden="true" /> : <PanelLeftClose className="size-[18px]" aria-hidden="true" />}
          </button>
        </Tooltip>
      ) : (
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
          aria-expanded={mobileOpen}
          className={cn(iconButtonClass, "rounded-control")}
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
      )}

      <span className="hidden h-5 w-px bg-border sm:block" aria-hidden="true" />
      <Breadcrumbs />

      <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-1.5">
        <SearchTrigger />
        <ThemeToggle className="text-muted hover:bg-foreground/[0.06] hover:text-foreground" />
        <NotificationsMenu />
        <ProfileMenu />
      </div>
    </header>
  );
}
