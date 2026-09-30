import { motion, useReducedMotion } from "framer-motion";
import { Plane } from "lucide-react";
import { cn } from "../../lib/cn";

/**
 * TourTrip logo: a dashed flight path drawn toward a gold plane.
 * Colour follows `currentColor`, so callers set it with a text class.
 */
export function BrandMark({ className, showText = true, compact = false }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={cn("flex items-center gap-3", className)} aria-label="TourTrip">
      <div className={cn("relative shrink-0", compact ? "h-8 w-10" : "h-9 w-20")} aria-hidden="true">
        <svg viewBox={compact ? "0 0 42 36" : "0 0 82 36"} className="absolute inset-0 h-full w-full overflow-visible">
          <motion.path
            d={compact ? "M2 30 C12 8, 22 30, 34 10" : "M2 28 C20 4, 45 32, 72 9"}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.68"
            strokeWidth="1.3"
            strokeDasharray="3 4"
            initial={reduceMotion ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: reduceMotion ? 0 : 1.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <motion.span
          className="absolute right-0 top-0 text-accent"
          initial={reduceMotion ? false : { x: compact ? -14 : -26, y: 17, opacity: 0, rotate: -20 }}
          animate={{ x: 0, y: 0, opacity: 1, rotate: 5 }}
          transition={{ duration: reduceMotion ? 0 : 1.1, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <Plane className={cn("fill-current", compact ? "size-4" : "size-[18px]")} />
        </motion.span>
      </div>
      {showText && <span className="font-display text-xl font-semibold tracking-[-0.03em]">TourTrip</span>}
    </div>
  );
}
