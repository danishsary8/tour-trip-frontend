import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useEscapeLayer } from "../../hooks/useEscapeLayer";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { Button } from "../ui/Button";

function DrawerPanel({ title, description, children, footer, onClose, wide, full }) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();
  const reduceMotion = useReducedMotion();
  useFocusTrap(panelRef, true, { initialFocusRef: closeRef });

  useEscapeLayer(true, onClose);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[70]">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.2 }}
        className="absolute inset-0 bg-background/65 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <motion.aside ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined}
        initial={reduceMotion ? { opacity: 0 } : { x: "100%" }} animate={{ x: 0, opacity: 1 }} exit={reduceMotion ? { opacity: 0 } : { x: "100%" }}
        transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={`absolute inset-y-0 right-0 flex w-full flex-col border-l border-border bg-surface text-foreground shadow-panel ${full ? "max-w-5xl" : wide ? "max-w-2xl" : "max-w-lg"}`}>
        <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-5 sm:px-7">
          <div><h2 id={titleId} className="font-display text-xl font-semibold tracking-tight">{title}</h2>{description && <p id={descriptionId} className="mt-1 text-sm text-muted">{description}</p>}</div>
          <Button ref={closeRef} variant="ghost" size="icon" aria-label="Close drawer" onClick={onClose} className="shrink-0"><X className="size-5" /></Button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-7">{children}</div>
        {footer && <footer className="flex flex-wrap justify-end gap-2 border-t border-border bg-surface px-5 py-4 sm:px-7">{footer}</footer>}
      </motion.aside>
    </div>
  );
}

/** Right-side form drawer, trapped and dismissible with Escape or its backdrop. */
export function Drawer({ open, onClose, ...props }) {
  return createPortal(<AnimatePresence>{open && <DrawerPanel key="drawer" onClose={onClose} {...props} />}</AnimatePresence>, document.body);
}
