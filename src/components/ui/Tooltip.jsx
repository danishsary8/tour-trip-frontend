import { useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Hover/focus label rendered in a portal so it is never clipped by scroll
 * containers. The label slides out from the side of its anchor.
 */
export function Tooltip({ label, side = "right", disabled = false, children, className }) {
  const anchorRef = useRef(null);
  const [position, setPosition] = useState(null);
  const reduceMotion = useReducedMotion();
  const id = useId();

  function show() {
    if (disabled || !anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    setPosition(
      side === "bottom"
        ? { top: rect.bottom + 8, left: rect.left + rect.width / 2 }
        : { top: rect.top + rect.height / 2, left: rect.right + 12 },
    );
  }

  const hide = () => setPosition(null);
  const offset = reduceMotion ? {} : side === "bottom" ? { y: -4 } : { x: -6 };

  return (
    <span
      ref={anchorRef}
      className={className ?? "block"}
      onPointerEnter={show}
      onPointerLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {createPortal(
        <AnimatePresence>
          {position && !disabled && (
            <motion.span
              id={id}
              role="tooltip"
              initial={{ opacity: 0, ...offset }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, ...offset, transition: { duration: 0.1 } }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              style={{ top: position.top, left: position.left }}
              className="pointer-events-none fixed z-[80]"
            >
              <span
                className={
                  side === "bottom"
                    ? "block -translate-x-1/2 whitespace-nowrap rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-foreground shadow-soft"
                    : "block -translate-y-1/2 whitespace-nowrap rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-foreground shadow-soft"
                }
              >
                {label}
              </span>
            </motion.span>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </span>
  );
}
