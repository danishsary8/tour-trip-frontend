import { motion } from "framer-motion";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/cn";

const cardVariants = cva("rounded-card border", {
  variants: {
    variant: {
      default: "border-border bg-surface text-foreground shadow-soft",
      glass: "border-white/14 bg-[#11191d]/72 text-white shadow-panel backdrop-blur-2xl",
      elevated: "border-border bg-surface text-foreground shadow-panel",
    },
  },
  defaultVariants: { variant: "default" },
});

export function Card({ className, variant, interactive = false, children, ...props }) {
  return (
    <motion.div
      whileHover={interactive ? { y: -3 } : undefined}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className={cn(cardVariants({ variant }), className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
