import { forwardRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/cn";
import { Spinner } from "./Spinner";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-control font-semibold transition-[color,background-color,border-color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white shadow-[0_10px_24px_rgba(200,85,61,.24)] hover:bg-[#d2634a] hover:shadow-glow",
        secondary: "bg-accent text-[#211a0b] hover:bg-[#f2c85e] hover:shadow-[0_10px_26px_rgba(233,185,73,.22)]",
        ghost: "bg-transparent text-foreground hover:bg-white/8",
        outline: "border border-border bg-white/4 text-foreground hover:border-white/20 hover:bg-white/8",
        danger: "bg-danger text-white hover:bg-[#e1635f] hover:shadow-[0_10px_26px_rgba(217,83,79,.22)]",
      },
      size: {
        sm: "h-9 px-3.5 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-13 px-6 text-base",
        icon: "size-11 p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export const Button = forwardRef(function Button(
  { className, variant, size, loading = false, success = false, children, disabled, type = "button", ...props },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      type={type}
      whileHover={disabled || loading ? undefined : { y: -2 }}
      whileTap={disabled || loading ? undefined : { scale: 0.97, y: 0 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      <AnimatePresence mode="wait" initial={false}>
        {success ? (
          <motion.span
            key="success"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="inline-flex items-center gap-2"
          >
            <Check className="size-4" aria-hidden="true" /> Success
          </motion.span>
        ) : loading ? (
          <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-2">
            <Spinner /> Please wait
          </motion.span>
        ) : (
          <motion.span key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-2">
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
});

export { buttonVariants };
