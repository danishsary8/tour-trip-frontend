import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "../../lib/cn";
import { Tooltip } from "../ui/Tooltip";

const pillSpring = { type: "spring", stiffness: 420, damping: 34, mass: 0.8 };

function PulseDot({ className }) {
  return (
    <span className={cn("relative flex size-2", className)} aria-hidden="true">
      <span className="absolute inline-flex size-2 animate-ping rounded-full bg-accent opacity-60 [animation-duration:2.4s]" />
      <span className="relative inline-flex size-2 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]" />
    </span>
  );
}

/**
 * One sidebar row. The active pill is shared through `layoutId`, so it glides
 * between rows instead of jumping.
 */
export function SidebarItem({ item, active, rail, badgeCount = 0, onNavigate }) {
  const { label, path, icon: Icon } = item;
  const reduceMotion = useReducedMotion();
  const hasBadge = badgeCount > 0;
  const accessibleLabel = hasBadge ? `${label}, ${badgeCount} pending` : label;

  return (
    <Tooltip label={hasBadge ? `${label} · ${badgeCount}` : label} disabled={!rail}>
      <Link
        to={path}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        aria-label={rail || hasBadge ? accessibleLabel : undefined}
        className={cn(
          "group relative flex h-10 items-center gap-3 rounded-control text-sm font-medium outline-none",
          "transition-[color,transform] duration-200 active:scale-[0.98]",
          "focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
          rail ? "justify-center px-0" : "px-3.5",
          active ? "text-foreground" : "text-muted hover:text-foreground",
        )}
      >
        {/* hover wash */}
        <span
          className="absolute inset-0 rounded-control bg-foreground/[0.05] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          aria-hidden="true"
        />

        {active && (
          <motion.span
            layoutId="sidebar-active-pill"
            transition={reduceMotion ? { duration: 0 } : pillSpring}
            className="absolute inset-0 rounded-control bg-primary/14 shadow-[0_10px_28px_-14px_var(--primary)] ring-1 ring-inset ring-primary/25"
            aria-hidden="true"
          >
            <span className="absolute left-1.5 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_10px_var(--accent)]" />
          </motion.span>
        )}

        <span className="relative">
          <Icon
            className={cn(
              "size-[18px] shrink-0 transition-transform duration-200 ease-out group-hover:-rotate-6 group-hover:scale-110",
              active && "text-primary-ink",
            )}
            aria-hidden="true"
          />
          {rail && hasBadge && <PulseDot className="absolute -right-1 -top-1" />}
        </span>

        {!rail && (
          <motion.span
            initial={reduceMotion ? false : { opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: 0.06 }}
            className="relative truncate whitespace-nowrap transition-transform duration-200 group-hover:translate-x-0.5"
          >
            {label}
          </motion.span>
        )}

        {!rail && hasBadge && (
          <span className="relative ml-auto inline-flex items-center gap-1.5 rounded-full bg-accent/14 py-0.5 pl-1.5 pr-2 text-[11px] font-semibold tabular-nums text-accent-ink ring-1 ring-inset ring-accent/25">
            <PulseDot />
            {badgeCount}
          </span>
        )}
      </Link>
    </Tooltip>
  );
}
