import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "../../../components/shared/Skeleton";
import { StatusBadge } from "../../../components/shared/StatusBadge";
import { cn } from "../../../lib/cn";
import { formatShortDate, formatUsd } from "../../../lib/format";
import { useBookingDecision, useRecentBookings, useRestoreBooking } from "../../bookings/hooks";
import { useWidgetStatus } from "../widgetState";
import { WidgetCard, WidgetEmpty } from "./WidgetCard";

function TableSkeleton() {
  return (
    <div className="space-y-3" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((key) => (
        <div key={key} className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-full" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      ))}
    </div>
  );
}

const actionClass =
  "inline-flex h-8 min-w-8 items-center justify-center gap-1 rounded-full px-2 text-xs font-semibold outline-none transition-[background-color,color,transform,opacity] duration-200 focus-visible:ring-2 active:scale-95 disabled:pointer-events-none disabled:opacity-40";

function DecisionButtons({ booking, onDecide, busy }) {
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
        <span className="max-2xl:sr-only">Confirm</span>
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
        <span className="max-2xl:sr-only">Reject</span>
      </button>
    </div>
  );
}

/** Latest bookings. Pending rows can be confirmed or rejected inline, with a 5 second Undo. */
export function RecentBookings({ className }) {
  const query = useRecentBookings();
  const status = useWidgetStatus(query, (data) => data.length === 0);
  const decide = useBookingDecision();
  const restore = useRestoreBooking();
  const reduceMotion = useReducedMotion();

  async function onDecide(booking, decision) {
    try {
      const result = await decide.mutateAsync({ id: booking.id, decision });
      const confirmed = decision === "confirm";
      toast.success(confirmed ? `Booking ${booking.id} confirmed` : `Booking ${booking.id} rejected`, {
        description: confirmed ? `${booking.customerName} · ${booking.tourPackage}` : "Cancelled with reason “Rejected by admin”.",
        duration: 5000,
        action: {
          label: "Undo",
          onClick: () =>
            restore.mutate(
              { id: booking.id, snapshot: result.snapshot, eventId: result.eventId },
              { onSuccess: () => toast(`Booking ${booking.id} is pending again`) },
            ),
        },
      });
    } catch (error) {
      toast.error(error.message || "The booking could not be updated");
    }
  }

  return (
    <WidgetCard
      id="recent-bookings"
      eyebrow="Manage bookings"
      title="Recent bookings"
      description="Confirm or reject new requests without leaving the dashboard"
      action="View all"
      to="/admin/bookings"
      status={status}
      onRetry={() => query.refetch()}
      skeleton={<TableSkeleton />}
      empty={<WidgetEmpty title="No bookings yet" description="New requests will show up here first." />}
      className={className}
    >
      <div className="@container -mx-5 overflow-x-auto sm:-mx-6">
        <table className="w-full min-w-[460px] text-left text-sm">
          <caption className="sr-only">Six most recent bookings</caption>
          <thead className="text-[11px] uppercase tracking-[0.12em] text-muted">
            <tr className="border-y border-border bg-surface-2/50">
              <th scope="col" className="px-5 py-2.5 font-semibold sm:px-6">
                Customer
              </th>
              <th scope="col" className="px-3 py-2.5 font-semibold">
                Tour
              </th>
              <th scope="col" className="px-3 py-2.5 text-right font-semibold @max-[44rem]:hidden">
                Amount
              </th>
              <th scope="col" className="px-3 py-2.5 font-semibold">
                Status
              </th>
              <th scope="col" className="py-2.5 pl-2 pr-5 text-right font-semibold sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(query.data ?? []).map((booking, index) => {
              const pending = booking.status === "Pending";
              const busy = decide.isPending && decide.variables?.id === booking.id;
              return (
                <motion.tr
                  key={booking.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: reduceMotion ? 0 : 0.05 * index, ease: [0.22, 1, 0.36, 1] }}
                  className="group transition-colors duration-200 hover:bg-foreground/[0.03]"
                >
                  <td className="px-5 py-3 sm:px-6">
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br @max-[36rem]:hidden from-primary/20 to-accent/20 text-[11px] font-bold text-primary-ink ring-1 ring-inset ring-primary/20">
                        {booking.initials}
                      </span>
                      <span className="min-w-0">
                        <span className="block max-w-[150px] truncate font-medium text-foreground">{booking.customerName}</span>
                        <span className="block text-xs tabular-nums text-muted">{booking.id}</span>
                      </span>
                    </div>
                  </td>
                  <td className="max-w-[190px] px-3 py-3">
                    <span className="block truncate text-foreground" title={booking.tourPackage}>
                      {booking.tourPackage}
                    </span>
                    <span className="block truncate text-xs text-muted">
                      {formatShortDate(booking.travelDate)} · {booking.guests} pax
                      <span className="font-semibold tabular-nums text-foreground @min-[44rem]:hidden"> · {formatUsd(booking.amount)}</span>
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-right font-semibold tabular-nums text-foreground @max-[44rem]:hidden">
                    {formatUsd(booking.amount)}
                  </td>
                  <td className="px-3 py-3">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={booking.status}
                        initial={reduceMotion ? false : { opacity: 0, scale: 0.8, y: 4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: -4 }}
                        transition={{ type: "spring", stiffness: 420, damping: 28 }}
                        className="inline-block"
                      >
                        <StatusBadge status={booking.status} />
                      </motion.span>
                    </AnimatePresence>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-2 pr-5 sm:pr-6">
                    {pending ? (
                      <DecisionButtons booking={booking} onDecide={onDecide} busy={busy} />
                    ) : (
                      <span className="block text-right text-xs text-muted">{booking.paymentStatus}</span>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </WidgetCard>
  );
}
