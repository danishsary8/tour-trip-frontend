import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../app/providers/ThemeProvider";
import { cn } from "../../lib/cn";
import { motionEase } from "../../lib/motion";
import { Tooltip } from "./Tooltip";

const baseClass =
  "relative grid size-10 shrink-0 place-items-center rounded-full outline-none transition-[color,background-color,transform] duration-200 focus-visible:ring-2 focus-visible:ring-primary/60 active:scale-95";

/**
 * Sun/moon button that switches light and dark for the current area (admin or storefront).
 * `className` styles the button; `iconClassName` lets it sit on dark imagery.
 */
export function ThemeToggle({ className, iconClassName, tooltip = true }) {
  const { theme, toggleTheme } = useTheme();
  const reduceMotion = useReducedMotion();
  const next = theme === "dark" ? "light" : "dark";

  const button = (
    <button type="button" onClick={toggleTheme} aria-label={`Switch to ${next} mode`} className={cn(baseClass, className)}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, rotate: -90, scale: 0.4 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, rotate: 90, scale: 0.4 }}
          transition={{ duration: 0.2, ease: motionEase }}
          className="grid place-items-center"
        >
          {theme === "dark" ? (
            <Moon className={cn("size-[18px] fill-accent/20 text-accent-ink", iconClassName)} aria-hidden="true" />
          ) : (
            <Sun className={cn("size-[18px] text-primary-ink", iconClassName)} aria-hidden="true" />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );

  return tooltip ? (
    <Tooltip label={`Switch to ${next} mode`} side="bottom" className="inline-flex">
      {button}
    </Tooltip>
  ) : (
    button
  );
}
