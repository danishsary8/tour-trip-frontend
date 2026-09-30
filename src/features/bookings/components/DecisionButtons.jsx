import { Check, X } from "lucide-react";
import { cn } from "../../../lib/cn";

const actionClass =
  "inline-flex h-8 min-w-8 items-center justify-center gap-1 rounded-full px-2 text-xs font-semibold outline-none transition-[background-color,color,transform,opacity] duration-200 focus-visible:ring-2 active:scale-95 disabled:pointer-events-none disabled:opacity-40";

export function DecisionButtons({ booking, onDecide, busy, showLabels = false }) {
  return (
    <div className="flex justify-end gap-1.5">
      <button
        type="button"
        onClick={() => onDecide(booking, "confirm")}
        disabled={busy}
        aria-label={`Confirm booking ${booking.id} for ${booking.customerName}`}
        title="Confirm booking"
        className={cn(actionClass, "bg-success/12 text-success-ink hover:bg-success/20 focus-visible:ring-success/60")}
      >
        <Check className="size-3.5" aria-hidden="true" />
        <span className={showLabels ? "max-2xl:sr-only" : "sr-only"}>Confirm</span>
      </button>
      <button
        type="button"
        onClick={() => onDecide(booking, "reject")}
        disabled={busy}
        aria-label={`Reject booking ${booking.id} for ${booking.customerName}`}
        title="Reject booking"
        className={cn(actionClass, "text-danger-ink hover:bg-danger/12 focus-visible:ring-danger/60")}
      >
        <X className="size-3.5" aria-hidden="true" />
        <span className={showLabels ? "max-2xl:sr-only" : "sr-only"}>Reject</span>
      </button>
    </div>
  );
}
