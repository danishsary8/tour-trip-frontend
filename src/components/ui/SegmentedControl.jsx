import { useId, useRef } from "react";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { cn } from "../../lib/cn";

const pillSpring = { type: "spring", stiffness: 480, damping: 36, mass: 0.7 };

/**
 * Single-choice toggle with a pill that slides to the selected option.
 * Behaves as a radio group: arrow keys move and select, only the checked option is tabbable.
 *
 * @param {{ options: Array<string | { value: string, label: string }>, value: string, onChange: (value: string) => void, label: string, size?: "sm" | "md", className?: string }} props
 */
export function SegmentedControl({ options, value, onChange, label, size = "md", className }) {
  const id = useId();
  const reduceMotion = useReducedMotion();
  const refs = useRef([]);
  const items = options.map((option) => (typeof option === "string" ? { value: option, label: option } : option));
  const selectedIndex = Math.max(0, items.findIndex((item) => item.value === value));

  function onKeyDown(event) {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    const jump = { Home: 0, End: items.length - 1 }[event.key];
    if (step === undefined && jump === undefined) return;
    event.preventDefault();
    const next = jump ?? (selectedIndex + step + items.length) % items.length;
    onChange(items[next].value);
    refs.current[next]?.focus();
  }

  return (
    <LayoutGroup id={id}>
      <div
        role="radiogroup"
        aria-label={label}
        onKeyDown={onKeyDown}
        className={cn("relative inline-flex items-center gap-0.5 rounded-full border border-border bg-surface-2/70 p-1", className)}
      >
        {items.map((item, index) => {
          const selected = index === selectedIndex;
          return (
            <button
              key={item.value}
              ref={(element) => {
                refs.current[index] = element;
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(item.value)}
              className={cn(
                "relative rounded-full font-semibold tabular-nums outline-none transition-[color,transform] duration-200",
                "focus-visible:ring-2 focus-visible:ring-primary/60 active:scale-95 disabled:pointer-events-none disabled:opacity-50",
                size === "sm" ? "h-7 px-3 text-xs" : "h-8 px-3.5 text-[13px]",
                selected ? "text-foreground" : "text-muted hover:text-foreground",
              )}
            >
              {selected && (
                <motion.span
                  layoutId="segment-pill"
                  transition={reduceMotion ? { duration: 0 } : pillSpring}
                  className="absolute inset-0 rounded-full bg-surface shadow-[0_1px_2px_rgba(0,0,0,.12),0_6px_16px_-8px_var(--primary)] ring-1 ring-border"
                  aria-hidden="true"
                />
              )}
              <span className="relative">{item.label}</span>
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
