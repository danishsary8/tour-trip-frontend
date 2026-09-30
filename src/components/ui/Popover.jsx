import { forwardRef, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "../../lib/cn";

const ITEM_SELECTOR = '[role="menuitem"]:not([disabled]), [data-popover-item]:not([disabled])';

function moveFocus(container, direction) {
  const items = [...container.querySelectorAll(ITEM_SELECTOR)];
  if (items.length === 0) return;
  const index = items.indexOf(document.activeElement);
  const next =
    direction === "first"
      ? 0
      : direction === "last"
        ? items.length - 1
        : (index + direction + items.length) % items.length;
  items[next].focus();
}

/**
 * Glass panel that scales and fades in from its anchor corner.
 * Arrow keys, Home and End move focus between items; the first item is focused on open.
 */
export const PopoverPanel = forwardRef(function PopoverPanel(
  { open, align = "right", className, children, label, role = "menu", autoFocus = "first", ...props },
  ref,
) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open || !ref?.current) return undefined;
    const frame = requestAnimationFrame(() => {
      if (!ref.current) return;
      if (autoFocus === "first") moveFocus(ref.current, "first");
      else ref.current.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [open, ref, autoFocus]);

  function onKeyDown(event) {
    const keys = { ArrowDown: 1, ArrowUp: -1, Home: "first", End: "last" };
    if (!(event.key in keys)) return;
    event.preventDefault();
    moveFocus(event.currentTarget, keys[event.key]);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          role={role}
          aria-label={label}
          tabIndex={-1}
          onKeyDown={onKeyDown}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: -6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: -4, transition: { duration: 0.12 } }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: align === "right" ? "top right" : "top left" }}
          className={cn(
            "absolute top-[calc(100%+10px)] z-40 rounded-card border border-border bg-surface/92 p-1.5 text-foreground shadow-panel outline-none backdrop-blur-xl",
            align === "right" ? "right-0" : "left-0",
            className,
          )}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
});

/** Row inside a `PopoverPanel` menu. */
export const MenuItem = forwardRef(function MenuItem({ icon: Icon, tone = "default", className, children, ...props }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      role="menuitem"
      className={cn(
        "flex w-full items-center gap-2.5 rounded-control px-2.5 py-2 text-left text-sm outline-none",
        "transition-[color,background-color,transform] duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45",
        tone === "danger"
          ? "text-danger-ink hover:bg-danger/12 focus-visible:bg-danger/12"
          : "text-foreground hover:bg-foreground/[0.06] focus-visible:bg-foreground/[0.06]",
        className,
      )}
      {...props}
    >
      {Icon && <Icon className="size-4 shrink-0 opacity-80" aria-hidden="true" />}
      {children}
    </button>
  );
});
