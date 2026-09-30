import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "../../../../lib/cn";
import { motionEase } from "../../../../lib/motion";
import { BOOKING_STEPS } from "../../booking";

/**
 * Checkout progress, in the same visual language as the admin Tour wizard: one bar per step
 * that fills as you move forward, with numbered labels that turn into checks.
 */
export function BookingStepper({ step }) {
  const reduceMotion = useReducedMotion();
  return (
    <nav aria-label="Booking progress">
      <ol className="grid grid-cols-4 gap-2 sm:gap-3">
        {BOOKING_STEPS.map((entry, index) => {
          const done = index < step;
          const current = index === step;
          return (
            <li key={entry.key} aria-current={current ? "step" : undefined} className="min-w-0">
              <span className="relative block h-1.5 overflow-hidden rounded-full bg-border" aria-hidden="true">
                <motion.span
                  className="absolute inset-0 origin-left rounded-full bg-primary"
                  initial={false}
                  animate={{ scaleX: index <= step ? 1 : 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.45, ease: motionEase, delay: reduceMotion ? 0 : 0.05 }}
                />
              </span>
              <span className={cn("mt-2.5 flex items-center gap-1.5 text-xs font-semibold", current ? "text-foreground" : done ? "text-primary-ink" : "text-muted")}>
                <span
                  className={cn(
                    "grid size-5 shrink-0 place-items-center rounded-full text-[10px] tabular-nums transition-colors duration-300",
                    done ? "bg-primary text-white" : current ? "bg-foreground text-background" : "border border-border",
                  )}
                  aria-hidden="true"
                >
                  {done ? <Check className="size-3" strokeWidth={3} /> : index + 1}
                </span>
                <span className={cn("truncate", !current && "hidden sm:inline")}>{entry.label}</span>
                <span className="sr-only">{done ? " (completed)" : current ? " (current step)" : ""}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
