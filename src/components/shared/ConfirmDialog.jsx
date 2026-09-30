import { useId, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, HelpCircle } from "lucide-react";
import { useEscapeLayer } from "../../hooks/useEscapeLayer";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { cn } from "../../lib/cn";
import { Button } from "../ui/Button";

function DialogPanel({ title, description, confirmLabel, cancelLabel, tone, loading, icon, onClose, onConfirm, confirmDisabled, children }) {
  const panelRef = useRef(null);
  const cancelRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();
  const reduceMotion = useReducedMotion();
  const Icon = icon ?? (tone === "danger" ? AlertTriangle : HelpCircle);

  // Cancel gets focus first so Enter never confirms a destructive action by accident.
  useFocusTrap(panelRef, true, { initialFocusRef: cancelRef });

  useEscapeLayer(true, () => {
    if (!loading) onClose();
  });

  return (
    <div className="fixed inset-0 z-[75] grid place-items-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.2 }}
        onClick={loading ? undefined : onClose}
        className="absolute inset-0 bg-background/60 backdrop-blur-sm"
        aria-hidden="true"
      />
      <motion.div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 6, transition: { duration: 0.14 } }}
        transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 32 }}
        className="relative w-full max-w-md rounded-panel border border-border bg-surface p-6 text-foreground shadow-panel"
      >
        <span
          className={cn(
            "mb-4 grid size-12 place-items-center rounded-2xl ring-8",
            tone === "danger" ? "bg-danger/12 text-danger-ink ring-danger/[0.06]" : "bg-primary/12 text-primary-ink ring-primary/[0.06]",
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <h2 id={titleId} className="font-display text-xl font-semibold tracking-[-0.02em]">
          {title}
        </h2>
        {description && (
          <p id={descriptionId} className="mt-2 text-sm leading-relaxed text-muted">
            {description}
          </p>
        )}
        {children && <div className="mt-4">{children}</div>}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            ref={cancelRef}
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="bg-transparent hover:border-foreground/20 hover:bg-foreground/[0.06]"
          >
            {cancelLabel}
          </Button>
          <Button variant={tone === "danger" ? "danger" : "primary"} onClick={onConfirm} loading={loading} disabled={confirmDisabled}>
            {confirmLabel}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Animated, focus-trapped confirmation. Focus returns to the opener when it closes.
 * `children` adds content such as a required reason field; `confirmDisabled` gates the action.
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "danger",
  loading = false,
  icon,
  confirmDisabled = false,
  children,
}) {
  return createPortal(
    <AnimatePresence>
      {open && (
        <DialogPanel
          key="confirm"
          title={title}
          description={description}
          confirmLabel={confirmLabel}
          cancelLabel={cancelLabel}
          tone={tone}
          loading={loading}
          icon={icon}
          onClose={onClose}
          onConfirm={onConfirm}
          confirmDisabled={confirmDisabled}
        >
          {children}
        </DialogPanel>
      )}
    </AnimatePresence>,
    document.body,
  );
}
