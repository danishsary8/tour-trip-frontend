import { useEffect } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Keeps Tab focus inside `containerRef` while `active`, focuses `initialFocusRef`
 * (or the first focusable element) on open, and restores focus to whatever was
 * focused before once it closes.
 */
export function useFocusTrap(containerRef, active, { initialFocusRef } = {}) {
  useEffect(() => {
    if (!active) return undefined;

    const previouslyFocused = document.activeElement;
    const frame = requestAnimationFrame(() => {
      const container = containerRef.current;
      if (!container) return;
      const target = initialFocusRef?.current ?? container.querySelector(FOCUSABLE) ?? container;
      target.focus({ preventScroll: true });
    });

    function onKeyDown(event) {
      if (event.key !== "Tab" || !containerRef.current) return;
      const focusable = [...containerRef.current.querySelectorAll(FOCUSABLE)].filter(
        (element) => element.offsetParent !== null || element === document.activeElement,
      );
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      if (previouslyFocused instanceof HTMLElement && previouslyFocused.isConnected) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [active, containerRef, initialFocusRef]);
}
