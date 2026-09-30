import { motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { fadeUp, stagger, useMotionPreset } from "../../lib/motion";

/**
 * Standard page heading: optional breadcrumb and eyebrow, display-font title,
 * description, and a right-aligned actions slot. Children enter in sequence.
 */
export function PageHeader({ eyebrow, title, description, breadcrumb, actions, className }) {
  const container = useMotionPreset(stagger);
  const item = useMotionPreset(fadeUp);

  return (
    <motion.header
      variants={container}
      initial="hidden"
      animate="visible"
      className={cn("mb-6 flex flex-col gap-4 sm:mb-8 md:flex-row md:items-end md:justify-between", className)}
    >
      <div className="min-w-0">
        {breadcrumb && (
          <motion.div variants={item} className="mb-2">
            {breadcrumb}
          </motion.div>
        )}
        {eyebrow && (
          <motion.p
            variants={item}
            className="mb-2.5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-ink"
          >
            <span className="h-px w-6 bg-accent/60" aria-hidden="true" />
            {eyebrow}
          </motion.p>
        )}
        <motion.h1
          variants={item}
          className="font-display text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-balance text-foreground sm:text-[34px]"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p variants={item} className="mt-2 max-w-2xl text-sm leading-relaxed text-pretty text-muted sm:text-[15px]">
            {description}
          </motion.p>
        )}
      </div>
      {actions && (
        <motion.div variants={item} className="flex shrink-0 flex-wrap items-center gap-2 md:justify-end">
          {actions}
        </motion.div>
      )}
    </motion.header>
  );
}
