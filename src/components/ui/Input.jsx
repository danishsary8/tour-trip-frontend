import { forwardRef, useId } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { cn } from "../../lib/cn";

export const Input = forwardRef(function Input(
  { id: suppliedId, label, icon: Icon, error, className, inputClassName, ...props },
  ref,
) {
  const generatedId = useId();
  const id = suppliedId || generatedId;
  const errorId = `${id}-error`;

  return (
    <div className={cn("w-full", className)}>
      <div className="group relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-4 top-1/2 z-10 size-[18px] -translate-y-1/2 text-white/48 transition-colors duration-200 group-focus-within:text-accent" aria-hidden="true" />
        )}
        <input
          ref={ref}
          id={id}
          placeholder=" "
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "peer h-14 w-full rounded-control border border-white/12 bg-black/22 px-4 pb-2 pt-6 text-[15px] text-white shadow-inner outline-none transition-[border-color,background-color,box-shadow] duration-200 placeholder:text-transparent",
            Icon && "pl-12",
            "hover:border-white/20 hover:bg-black/27 focus:border-accent/65 focus:bg-black/30 focus:shadow-[0_0_0_4px_rgba(233,185,73,.12)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-danger/80 focus:border-danger focus:shadow-[0_0_0_4px_rgba(217,83,79,.13)]",
            inputClassName,
          )}
          {...props}
        />
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "pointer-events-none absolute top-2.5 z-10 origin-left text-[11px] font-medium uppercase tracking-[0.11em] text-white/52 transition-all duration-200",
              Icon ? "left-12" : "left-4",
              "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-[0.11em] peer-focus:text-accent",
              error && "text-danger peer-focus:text-danger",
            )}
          >
            {label}
          </label>
        )}
      </div>
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={errorId}
            role="alert"
            initial={{ opacity: 0, height: 0, y: -3 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -3 }}
            className="mt-1.5 flex items-center gap-1.5 text-xs text-[#ffaaa7]"
          >
            <AlertCircle className="size-3.5" aria-hidden="true" /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});
