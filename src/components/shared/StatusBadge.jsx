import { cn } from "../../lib/cn";

const TONES = {
  confirmed: { label: "Confirmed", badge: "bg-success/12 text-success-ink ring-success/25", dot: "bg-success" },
  pending: { label: "Pending", badge: "bg-accent/14 text-accent-ink ring-accent/30", dot: "bg-accent animate-pulse" },
  completed: { label: "Completed", badge: "bg-info/12 text-info-ink ring-info/25", dot: "bg-info" },
  cancelled: { label: "Cancelled", badge: "bg-danger/12 text-danger-ink ring-danger/25", dot: "bg-danger" },
  active: { label: "Active", badge: "bg-success/12 text-success-ink ring-success/25", dot: "bg-success" },
  approved: { label: "Approved", badge: "bg-success/12 text-success-ink ring-success/25", dot: "bg-success" },
  blocked: { label: "Blocked", badge: "bg-danger/12 text-danger-ink ring-danger/25", dot: "bg-danger" },
  hidden: { label: "Hidden", badge: "bg-foreground/[0.06] text-muted ring-border", dot: "bg-muted" },
  inactive: { label: "Inactive", badge: "bg-foreground/[0.06] text-muted ring-border", dot: "bg-muted" },
  // Payment statuses (domain rules: Unpaid, Paid, Refunded).
  paid: { label: "Paid", badge: "bg-success/12 text-success-ink ring-success/25", dot: "bg-success" },
  unpaid: { label: "Unpaid", badge: "bg-accent/14 text-accent-ink ring-accent/30", dot: "bg-accent" },
  refunded: { label: "Refunded", badge: "bg-info/12 text-info-ink ring-info/25", dot: "bg-info" },
};

/** Booking, payment or record status pill. Unknown statuses fall back to the neutral style. */
export function StatusBadge({ status, children, className }) {
  const key = String(status ?? "").toLowerCase();
  const tone = TONES[key] ?? TONES.inactive;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full py-0.5 pl-2 pr-2.5 text-xs font-semibold ring-1 ring-inset",
        tone.badge,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", tone.dot)} aria-hidden="true" />
      {children ?? TONES[key]?.label ?? status}
    </span>
  );
}
