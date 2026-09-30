import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";
import { cn } from "../../lib/cn";

const defaultFormat = (value) => Math.round(value).toLocaleString("en-US");

/**
 * Counts from its previous value to `value`. Frames write straight to the DOM,
 * so counting does not re-render React. Reduced motion shows the final value.
 */
export function AnimatedNumber({ value, format = defaultFormat, duration = 0.9, className }) {
  const ref = useRef(null);
  const current = useRef(0);
  const formatRef = useRef(format);
  const reduceMotion = useReducedMotion();
  // Rendered once; afterwards frames update the text node directly.
  const [initialText] = useState(() => format(0));

  useEffect(() => {
    formatRef.current = format;
  });

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (reduceMotion) {
      current.current = value;
      node.textContent = formatRef.current(value);
      return undefined;
    }
    const controls = animate(current.current, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        current.current = latest;
        node.textContent = formatRef.current(latest);
      },
    });
    return () => controls.stop();
  }, [value, duration, reduceMotion]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {initialText}
    </span>
  );
}
