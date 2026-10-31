import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Compass, X } from "lucide-react";
import { useEscapeLayer } from "../../hooks/useEscapeLayer";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { motionEase } from "../../lib/motion";

/**
 * Reusable full-screen image lightbox modal.
 * Supports keyboard navigation (Escape, ArrowLeft, ArrowRight), mobile touch swiping,
 * animated slide transitions, index indicators, and photo details. Used by Gallery and Tour Detail;
 * items are `{ src, alt }` or richer gallery photos (title, caption, destination, category).
 */
export function Lightbox({
  open,
  onClose,
  items = [],
  index = 0,
  onIndexChange,
}) {
  const reduceMotion = useReducedMotion();
  const touchStartRef = useRef(null);
  const dialogRef = useRef(null);

  useEscapeLayer(open, onClose);
  useFocusTrap(dialogRef, open);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return undefined;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  const total = items.length;
  const currentItem = items[index] || null;

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    const nextIndex = (index - 1 + total) % total;
    onIndexChange?.(nextIndex);
  }, [index, total, onIndexChange]);

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    const nextIndex = (index + 1) % total;
    onIndexChange?.(nextIndex);
  }, [index, total, onIndexChange]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return undefined;

    function handleKeyDown(event) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handlePrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        handleNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, handlePrev, handleNext]);

  // Touch handlers for mobile swipe
  function handleTouchStart(e) {
    touchStartRef.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e) {
    if (touchStartRef.current === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStartRef.current - touchEnd;
    touchStartRef.current = null;

    if (Math.abs(diff) > 48) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  }

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && currentItem && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/92 backdrop-blur-xl text-white select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Bar */}
          <div className="relative z-10 flex w-full items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
            {/* Counter */}
            <span className="rounded-full bg-white/12 px-3.5 py-1 text-xs font-semibold tracking-wider text-white/90 backdrop-blur-md">
              {index + 1} / {total}
            </span>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close lightbox"
              className="grid size-11 place-items-center rounded-full bg-white/12 text-white outline-none transition-[background-color,transform] hover:bg-white/25 focus-visible:ring-2 focus-visible:ring-accent active:scale-95"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          {/* Main Visual Display Area */}
          <div className="relative flex flex-1 w-full items-center justify-center px-4 py-2 sm:px-16 overflow-hidden">
            {/* Prev Button */}
            {total > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous photo"
                className="absolute left-3 sm:left-6 z-20 grid size-12 place-items-center rounded-full bg-white/15 text-white shadow-lg backdrop-blur-md outline-none transition-[background-color,transform] hover:scale-105 hover:bg-white/30 focus-visible:ring-2 focus-visible:ring-accent active:scale-95"
              >
                <ChevronLeft className="size-6" aria-hidden="true" />
              </button>
            )}

            {/* Active Image */}
            <div
              className="relative max-h-[72vh] max-w-5xl overflow-hidden rounded-2xl shadow-2xl flex items-center justify-center cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentItem.id || currentItem.src || index}
                  src={typeof currentItem === "string" ? currentItem : currentItem.src}
                  alt={currentItem.alt || currentItem.title || "Tour photo"}
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3, ease: motionEase }}
                  className="max-h-[72vh] w-auto max-w-full object-contain rounded-2xl select-none"
                  draggable={false}
                />
              </AnimatePresence>
            </div>

            {/* Next Button */}
            {total > 1 && (
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next photo"
                className="absolute right-3 sm:right-6 z-20 grid size-12 place-items-center rounded-full bg-white/15 text-white shadow-lg backdrop-blur-md outline-none transition-[background-color,transform] hover:scale-105 hover:bg-white/30 focus-visible:ring-2 focus-visible:ring-accent active:scale-95"
              >
                <ChevronRight className="size-6" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Bottom Caption & Details Bar */}
          <div className="relative z-10 w-full max-w-4xl px-4 py-4 text-center sm:px-6 sm:py-6">
            <div className="rounded-2xl bg-white/10 px-5 py-3.5 backdrop-blur-md border border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-3 text-left">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {currentItem.destination && (
                      <span className="inline-block rounded-full bg-accent/90 px-2.5 py-0.5 text-[11px] font-bold text-black uppercase tracking-wider">
                        {currentItem.destination}
                      </span>
                    )}
                    {currentItem.category && (
                      <span className="hidden sm:inline-block rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-medium text-white/90">
                        {currentItem.category}
                      </span>
                    )}
                  </div>
                  {currentItem.title && (
                    <h3 className="mt-1 font-display text-lg font-semibold text-white tracking-tight truncate sm:text-xl">
                      {currentItem.title}
                    </h3>
                  )}
                  {currentItem.caption && (
                    <p className="mt-0.5 text-xs text-white/80 line-clamp-2 sm:text-sm">
                      {currentItem.caption}
                    </p>
                  )}
                </div>

                {currentItem.tourId && (
                  <Link
                    to={`/tours?destination=${currentItem.destinationId || ""}`}
                    onClick={onClose}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white shadow-md outline-none transition-[background-color,transform] hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-accent active:scale-95"
                  >
                    <Compass className="size-3.5" aria-hidden="true" />
                    <span>View Tours</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
