import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useOutlet } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useThemeScope } from "../app/providers/ThemeProvider";
import { CommandPalette } from "../components/layout/CommandPalette";
import { RouteFallback, RouteProgress } from "../components/layout/RouteProgress";
import { MobileSidebar, Sidebar } from "../components/layout/Sidebar";
import { Topbar } from "../components/layout/Topbar";
import { ShellContext } from "../components/layout/shellContext";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { pageTransition } from "../lib/motion";

const COLLAPSED_KEY = "tourtrip.sidebar.collapsed";
const staticPage = { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1, transition: { duration: 0 } } };

// "G then <key>" jumps, GitHub-style.
const GO_TO = { d: "/admin", t: "/admin/masters", b: "/admin/bookings", c: "/admin/customers", r: "/admin/reviews", s: "/admin/settings" };

function isTypingTarget(target) {
  return target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
}

function useShellShortcuts(setPaletteOpen) {
  const navigate = useNavigate();

  useEffect(() => {
    let awaitingGoTo = 0;

    function onKeyDown(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
        return;
      }
      if (event.metaKey || event.ctrlKey || event.altKey || isTypingTarget(event.target)) return;
      if (document.querySelector('[aria-modal="true"]')) return;

      const key = event.key.toLowerCase();
      if (Date.now() - awaitingGoTo < 1000 && GO_TO[key]) {
        awaitingGoTo = 0;
        navigate(GO_TO[key]);
      } else {
        awaitingGoTo = key === "g" ? Date.now() : 0;
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [navigate, setPaletteOpen]);
}

function readCollapsed() {
  try {
    return localStorage.getItem(COLLAPSED_KEY) === "true";
  } catch {
    return false;
  }
}

/** Shared navigation shell for every /admin route. */
export function AdminLayout() {
  useThemeScope("admin");
  const scrollRef = useRef(null);
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { pathname } = useLocation();
  const outlet = useOutlet();
  const reduceMotion = useReducedMotion();

  useShellShortcuts(setPaletteOpen);

  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSED_KEY, String(collapsed));
    } catch {
      // Storage can be unavailable (private mode); the toggle still works for this session.
    }
  }, [collapsed]);

  const toggleCollapsed = useCallback(() => setCollapsed((current) => !current), []);

  const shell = useMemo(
    () => ({
      collapsed,
      toggleCollapsed,
      mobileOpen,
      setMobileOpen,
      paletteOpen,
      setPaletteOpen,
      setRouteLoading,
      isDesktop,
      scrollRef,
    }),
    [collapsed, toggleCollapsed, mobileOpen, paletteOpen, isDesktop],
  );

  return (
    <ShellContext.Provider value={shell}>
      <a
        href="#admin-main"
        className="fixed left-3 top-3 z-[100] -translate-y-16 rounded-control bg-primary px-4 py-2 text-sm font-semibold text-white shadow-glow transition-transform duration-200 focus-visible:translate-y-0"
      >
        Skip to content
      </a>
      <div className="flex h-dvh overflow-hidden bg-background text-foreground">
        {isDesktop ? <Sidebar /> : <MobileSidebar />}

        <div ref={scrollRef} className="relative min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
          <Topbar />
          <main id="admin-main" className="p-4 sm:p-6 xl:px-8">
            {/* `useOutlet` freezes the element per key, so the exiting page keeps its own content. */}
            <AnimatePresence mode="wait" initial={false} onExitComplete={() => scrollRef.current?.scrollTo({ top: 0 })}>
              <motion.div
                key={pathname}
                variants={reduceMotion ? staticPage : pageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ willChange: "opacity, transform" }}
                className="transform-gpu"
              >
                <Suspense fallback={<RouteFallback />}>{outlet}</Suspense>
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
      <CommandPalette />
      <RouteProgress active={routeLoading} />
    </ShellContext.Provider>
  );
}
