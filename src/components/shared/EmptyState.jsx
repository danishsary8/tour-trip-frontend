import { motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { scaleIn, useMotionPreset } from "../../lib/motion";
import { AngkorLines } from "../effects/AngkorLines";

/** Temple silhouette rising over Mekong ripples with a low gold sun behind it. */
function Illustration({ icon: Icon, compact }) {
  return (
    <div className={cn("relative mx-auto", compact ? "h-24 w-44" : "h-36 w-64")} aria-hidden="true">
      <span className="absolute left-1/2 top-[18%] size-16 -translate-x-1/2 rounded-full bg-gradient-to-b from-accent/35 to-primary/10 blur-[2px]" />
      <span className="absolute left-1/2 top-[18%] size-16 -translate-x-1/2 rounded-full ring-1 ring-accent/30" />
      <AngkorLines className="absolute inset-x-0 bottom-0 h-full w-full text-foreground/25" />
      {Icon && (
        <span
          className={cn(
            "absolute bottom-1 right-5 grid place-items-center rounded-2xl border border-border bg-surface text-primary-ink shadow-soft",
            compact ? "size-9" : "size-12",
          )}
        >
          <Icon className={compact ? "size-4" : "size-5"} />
        </span>
      )}
    </div>
  );
}

export function EmptyState({ icon, title, description, action, compact = false, className }) {
  const variants = useMotionPreset(scaleIn);

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      className={cn(
        "relative flex flex-col items-center overflow-hidden rounded-panel border border-dashed border-border bg-surface/50 text-center",
        compact ? "px-6 py-8" : "px-6 py-14 sm:py-16",
        className,
      )}
    >
      <Illustration icon={icon} compact={compact} />
      <h2 className={cn("mt-6 font-display font-semibold tracking-[-0.02em] text-foreground", compact ? "text-lg" : "text-2xl")}>{title}</h2>
      {description && <p className="mt-2 max-w-md text-sm leading-relaxed text-pretty text-muted">{description}</p>}
      {action && <div className="mt-6 flex flex-wrap items-center justify-center gap-2">{action}</div>}
    </motion.div>
  );
}
