import { motion, useReducedMotion } from "framer-motion";
import { cn } from "../../../../lib/cn";

/**
 * The login button's success tick, scaled up for the confirmation page: a ring that springs in,
 * then a check that draws itself. `tone="pending"` uses gold for reserved-but-unpaid bookings.
 */
export function SuccessCheck({ tone = "success", className }) {
  const reduceMotion = useReducedMotion();
  const colors = tone === "pending" ? "bg-accent/15 text-accent-ink ring-accent/25" : "bg-success/12 text-success-ink ring-success/25";
  return (
    <motion.span
      className={cn("relative grid size-20 place-items-center rounded-full ring-8", colors, className)}
      initial={reduceMotion ? false : { scale: 0.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 20 }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="size-9">
        <motion.path
          d="M5 12.5 9.8 17 19 7.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduceMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
    </motion.span>
  );
}
