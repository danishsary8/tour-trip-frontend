import { forwardRef, useId } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

export const Checkbox = forwardRef(function Checkbox(
  { id: suppliedId, label, className, checked, defaultChecked, onChange, ...props },
  ref,
) {
  const generatedId = useId();
  const id = suppliedId || generatedId;
  const isChecked = Boolean(checked ?? defaultChecked);

  return (
    <label htmlFor={id} className={cn("group inline-flex cursor-pointer items-center gap-2.5 text-sm text-white/72", className)}>
      <span className="relative grid size-[18px] place-items-center">
        <input ref={ref} id={id} type="checkbox" className="peer sr-only" checked={checked} defaultChecked={defaultChecked} onChange={onChange} {...props} />
        <span className="absolute inset-0 rounded-[5px] border border-white/24 bg-black/20 transition-all group-hover:border-accent/55 peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#152025] peer-disabled:opacity-50" />
        <motion.svg viewBox="0 0 14 14" className="relative size-3 text-white" aria-hidden="true">
          <motion.path d="M2.2 7.2 5.5 10.2 11.8 3.8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" initial={false} animate={{ pathLength: isChecked ? 1 : 0, opacity: isChecked ? 1 : 0 }} transition={{ duration: 0.2 }} />
        </motion.svg>
      </span>
      <span>{label}</span>
    </label>
  );
});
