import { cva } from "class-variance-authority";
import { cn } from "../../lib/cn";

const badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold", {
  variants: {
    variant: {
      primary: "border-primary/25 bg-primary/12 text-[#ef927e]",
      accent: "border-accent/25 bg-accent/12 text-accent",
      success: "border-success/25 bg-success/12 text-[#77c9bf]",
      muted: "border-border bg-white/5 text-muted",
    },
  },
  defaultVariants: { variant: "muted" },
});

export function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
