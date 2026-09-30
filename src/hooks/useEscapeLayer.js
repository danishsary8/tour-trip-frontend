import { useEffect, useRef } from "react";

// Open overlays in the order they appeared; only the last one reacts to Escape.
const stack = [];

/**
 * Calls `onEscape` when Escape is pressed and this overlay is the top-most one, so a
 * dialog over a drawer (or a drawer over a drawer) closes one layer at a time.
 */
export function useEscapeLayer(active, onEscape) {
  const handler = useRef(onEscape);

  useEffect(() => {
    handler.current = onEscape;
  });

  useEffect(() => {
    if (!active) return undefined;
    const token = {};
    stack.push(token);

    function onKeyDown(event) {
      if (event.key !== "Escape" || stack[stack.length - 1] !== token) return;
      event.preventDefault();
      handler.current?.();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      stack.splice(stack.indexOf(token), 1);
    };
  }, [active]);
}
