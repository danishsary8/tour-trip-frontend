import { createContext, useContext, useLayoutEffect } from "react";

/**
 * Pages that open with a full-bleed photo (Home, Tour Detail) ask the site header to start
 * transparent over it. The flag is cleared when the page (or its hero state) unmounts.
 */
export const HeroHeaderContext = createContext(() => {});

export function useHeroHeader(active = true) {
  const setOverHero = useContext(HeroHeaderContext);
  useLayoutEffect(() => {
    if (!active) return undefined;
    setOverHero(true);
    return () => setOverHero(false);
  }, [active, setOverHero]);
}
