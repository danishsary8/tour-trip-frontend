import { Suspense, useEffect, useState } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useThemeScope } from "../../../app/providers/ThemeProvider";
import { pageTransition } from "../../../lib/motion";
import { FloatingContact } from "../components/FloatingContact";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { HeroHeaderContext } from "./heroHeader";

const staticPage = { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1, transition: { duration: 0 } } };

function PageFallback() {
  return <div className="min-h-[70vh]" aria-busy="true" />;
}

/** Scrolls to `#section` links after the page renders, or to the top on a new page. */
function useScrollRestoration(location, reduceMotion) {
  useEffect(() => {
    if (!location.hash) return undefined;
    let attempts = 0;
    let frame;
    const tryScroll = () => {
      const target = document.getElementById(location.hash.slice(1));
      if (target) target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      else if (attempts++ < 30) frame = requestAnimationFrame(tryScroll);
    };
    frame = requestAnimationFrame(tryScroll);
    return () => cancelAnimationFrame(frame);
  }, [location.hash, location.key, reduceMotion]);
}

/**
 * Public storefront shell: header, footer and page transitions. Light-first theme scope.
 * Separate from AdminLayout on purpose — the storefront is photo-led and spacious.
 */
export function StorefrontLayout() {
  useThemeScope("storefront");
  const location = useLocation();
  const outlet = useOutlet();
  const reduceMotion = useReducedMotion();
  const [pageHero, setPageHero] = useState(false);
  useScrollRestoration(location, reduceMotion);

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <a
        href="#storefront-main"
        className="fixed left-3 top-3 z-[100] -translate-y-20 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-glow transition-transform duration-200 focus-visible:translate-y-0"
      >
        Skip to content
      </a>
      <SiteHeader overHero={location.pathname === "/" || pageHero} />
      <main id="storefront-main" className="flex-1">
        {/* Keyed by path only, so filter changes on /tours (query string) don't replay the page transition. */}
        <AnimatePresence mode="wait" initial={false} onExitComplete={() => !location.hash && window.scrollTo(0, 0)}>
          <motion.div key={location.pathname} variants={reduceMotion ? staticPage : pageTransition} initial="initial" animate="animate" exit="exit">
            <HeroHeaderContext.Provider value={setPageHero}>
              <Suspense fallback={<PageFallback />}>{outlet}</Suspense>
            </HeroHeaderContext.Provider>
          </motion.div>
        </AnimatePresence>
      </main>
      <SiteFooter />
      <FloatingContact />
    </div>
  );
}
