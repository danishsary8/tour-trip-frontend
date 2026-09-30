import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Ban, BadgeCheck, CalendarDays, Check, CircleCheckBig, Clock, CreditCard, Mail, MapPin, MessageSquareText, Phone, RotateCcw, UserRound, X,
} from "lucide-react";
import { ConfirmDialog } from "../../../components/shared/ConfirmDialog";
import { Drawer } from "../../../components/shared/Drawer";
import { Skeleton } from "../../../components/shared/Skeleton";
import { StatusBadge } from "../../../components/shared/StatusBadge";
import { Button } from "../../../components/ui/Button";
import { PAYMENT_METHODS } from "../../../mocks/dashboard";
import { cn } from "../../../lib/cn";
import { formatDate, formatUsd } from "../../../lib/format";
import { useBooking, useBookingActions, useBookingPayment } from "../hooks";

const dateTime = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });

const HISTORY_TONE = {
  Pending: "bg-accent",
  Confirmed: "bg-success",
  Completed: "bg-info",
  Cancelled: "bg-danger",
  Paid: "bg-success",
  Refunded: "bg-info",
  "Method changed": "bg-muted",
};

function Section({ title, icon: Icon, children, className }) {
  return (
    <section className={cn("rounded-card border border-border bg-surface-2/35 p-4", className)}>
      <h3 className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
        {Icon && <Icon className="size-3.5" aria-hidden="true" />}
        {title}
      </h3>
      {children}
    </section>
  );
}

function PriceRow({ label, detail, value, strong = false, tone }) {
  return (
    <div className={cn("flex items-baseline justify-between gap-3 text-sm", strong && "border-t border-border pt-2.5")}>
      <span className={strong ? "font-semibold text-foreground" : "text-muted"}>
        {label}
        {detail && <span className="ml-1.5 text-xs text-muted">{detail}</span>}
      </span>
      <span className={cn("tabular-nums", strong ? "font-display text-lg font-semibold text-foreground" : "font-medium text-foreground", tone)}>{value}</span>
    </div>
  );
}

/** Reason field shown inside the reject / cancel confirmation. */
function ReasonField({ value, onChange, label }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-foreground">
        {label} <span className="text-danger-ink">*</span>
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        maxLength={240}
        required
        placeholder="e.g. Tour date is fully booked"
        className="w-full resize-none rounded-control border border-border bg-surface-2/40 px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
      <p className="mt-1 text-xs text-muted">Shown in the booking history. The guest is notified once email is connected.</p>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-4" aria-label="Loading booking" role="status">
      <Skeleton className="h-24 w-full rounded-card" />
      <Skeleton className="h-32 w-full rounded-card" />
      <Skeleton className="h-40 w-full rounded-card" />
    </div>
  );
}

/**
 * Booking detail, status actions and payment controls. It reads the booking from the shared
 * bookings cache, so changes made here or on the dashboard appear in both places at once.
 */
export function BookingDrawer({ bookingId, open, onClose }) {
  const { data: booking, isLoading } = useBooking(bookingId);
  const actions = useBookingActions();
  const payment = useBookingPayment();
  const [reasonAction, setReasonAction] = useState(null);
  const [reason, setReason] = useState("");
  const [paymentAction, setPaymentAction] = useState(null);

  async function runStatus(action, note) {
    const done = await actions.run(booking, action, note);
    if (done) {
      setReasonAction(null);
      setReason("");
    }
  }

  async function changePayment(change, successMessage) {
    try {
      const result = await payment.mutateAsync({ id: booking.id, ...change });
      toast.success(successMessage, {
        duration: 5000,
        action: { label: "Undo", onClick: () => actions.offerUndo(booking, result) },
      });
    } catch (error) {
      toast.error(error.message || "Payment could not be updated");
    } finally {
      setPaymentAction(null);
    }
  }

  const busy = actions.deciding || payment.isPending;
  const pending = booking?.status === "Pending";
  const confirmed = booking?.status === "Confirmed";
  const finished = booking && !pending && !confirmed;

  const footer = booking && !finished && (
    <>
      {pending && (
        <>
          <Button variant="outline" onClick={() => setReasonAction("reject")} disabled={busy} className="bg-transparent text-danger-ink hover:border-danger/30 hover:bg-danger/10">
            <X className="size-4" aria-hidden="true" /> Reject
          </Button>
          <Button onClick={() => runStatus("confirm")} loading={busy && actions.decidingId === booking.id} disabled={busy}>
            <Check className="size-4" aria-hidden="true" /> Confirm booking
          </Button>
        </>
      )}
      {confirmed && (
        <>
          <Button variant="outline" onClick={() => setReasonAction("cancel")} disabled={busy} className="bg-transparent text-danger-ink hover:border-danger/30 hover:bg-danger/10">
            <Ban className="size-4" aria-hidden="true" /> Cancel booking
          </Button>
          <Button onClick={() => runStatus("complete")} loading={busy && actions.decidingId === booking.id} disabled={busy}>
            <CircleCheckBig className="size-4" aria-hidden="true" /> Mark completed
          </Button>
        </>
      )}
    </>
  );

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        wide
        title={booking ? `Booking ${booking.id}` : "Booking"}
        description={booking ? `Requested ${dateTime.format(new Date(booking.createdAt))}` : undefined}
        footer={footer}
      >
        {isLoading || !booking ? (
          isLoading ? <DetailSkeleton /> : <p className="text-sm text-muted">This booking could not be found.</p>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={booking.status} />
              <StatusBadge status={booking.paymentStatus} />
              {booking.cancelReason && <span className="text-xs text-muted">Reason: {booking.cancelReason}</span>}
            </div>

            <div className="flex gap-4 rounded-card border border-border bg-surface-2/35 p-3">
              {booking.tourImage && (
                <img src={booking.tourImage} alt="" width="112" height="84" className="h-21 w-28 shrink-0 rounded-xl object-cover ring-1 ring-border" />
              )}
              <div className="min-w-0 py-0.5">
                <p className="font-display text-lg font-semibold leading-tight text-foreground">{booking.tourPackage}</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                  <MapPin className="size-3.5" aria-hidden="true" /> {booking.destination}
                </p>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="size-3.5" aria-hidden="true" /> {formatDate(booking.travelDate)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-3.5" aria-hidden="true" /> {booking.departureTime}
                  </span>
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Section title="Customer" icon={UserRound}>
                <p className="font-semibold text-foreground">{booking.customerName}</p>
                <a href={`mailto:${booking.contactEmail}`} className="mt-1.5 flex items-center gap-2 break-all text-sm text-muted outline-none transition-colors hover:text-foreground focus-visible:text-primary-ink">
                  <Mail className="size-3.5 shrink-0" aria-hidden="true" /> {booking.contactEmail}
                </a>
                <a href={`tel:${booking.contactPhone.replace(/\s/g, "")}`} className="mt-1 flex items-center gap-2 text-sm text-muted outline-none transition-colors hover:text-foreground focus-visible:text-primary-ink">
                  <Phone className="size-3.5 shrink-0" aria-hidden="true" /> {booking.contactPhone}
                </a>
                <Link
                  to={`/admin/customers?customer=${booking.customerId}`}
                  onClick={onClose}
                  className="mt-3 inline-flex rounded-md text-xs font-semibold text-primary-ink outline-none hover:underline focus-visible:ring-2 focus-visible:ring-primary/60"
                >
                  View customer profile
                </Link>
              </Section>

              <Section title="Travellers" icon={UserRound}>
                <dl className="grid grid-cols-3 gap-2 text-center">
                  {[
                    ["Adults", booking.adults, "12+"],
                    ["Children", booking.children, "5–11"],
                    ["Infants", booking.infants, "0–4"],
                  ].map(([label, count, ages]) => (
                    <div key={label} className="flex flex-col-reverse rounded-control bg-surface px-2 py-2.5">
                      <dt className="text-[11px] text-muted">
                        {label} <span className="block">{ages}</span>
                      </dt>
                      <dd className="font-display text-xl font-semibold tabular-nums text-foreground">{count}</dd>
                    </div>
                  ))}
                </dl>
              </Section>
            </div>

            {booking.specialRequests && (
              <Section title="Special requests" icon={MessageSquareText} className="border-accent/25 bg-accent/[0.06]">
                <p className="text-sm leading-relaxed text-foreground">{booking.specialRequests}</p>
              </Section>
            )}

            <Section title="Price summary" icon={BadgeCheck}>
              <div className="space-y-2">
                <PriceRow label="Adults" detail={`${booking.adults} × ${formatUsd(booking.unitPrice)}`} value={formatUsd(booking.adults * booking.unitPrice)} />
                {booking.children > 0 && (
                  <PriceRow label="Children" detail={`${booking.children} × ${formatUsd(booking.childPrice)}`} value={formatUsd(booking.children * booking.childPrice)} />
                )}
                {booking.infants > 0 && <PriceRow label="Infants" detail={`${booking.infants} × $0`} value="$0" />}
                {booking.discount > 0 && <PriceRow label="Discount" detail={booking.discountLabel} value={`−${formatUsd(booking.discount)}`} tone="text-success-ink" />}
                <PriceRow label="Total amount" value={formatUsd(booking.amount)} strong />
                <PriceRow
                  label={booking.paymentStatus === "Paid" ? "Paid" : booking.paymentStatus === "Refunded" ? "Refunded" : "Balance due"}
                  value={formatUsd(booking.amount)}
                  tone={booking.paymentStatus === "Paid" ? "text-success-ink" : booking.paymentStatus === "Refunded" ? "text-info-ink" : "text-accent-ink"}
                />
              </div>
            </Section>

            <Section title="Payment" icon={CreditCard}>
              <div className="flex flex-wrap items-end gap-3">
                <label className="min-w-0 flex-1">
                  <span className="mb-1.5 block text-xs font-medium text-muted">Payment method</span>
                  <select
                    value={booking.paymentMethod ?? ""}
                    disabled={busy || booking.paymentStatus === "Refunded"}
                    onChange={(event) => changePayment({ paymentMethod: event.target.value }, `Payment method set to ${event.target.value}`)}
                    className="h-10 w-full rounded-control border border-border bg-surface px-3 text-sm text-foreground outline-none transition-colors hover:border-primary/35 focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-50"
                  >
                    {/* Storefront bookings have no method until the guest reaches the payment step. */}
                    {!booking.paymentMethod && (
                      <option value="" disabled>
                        Not chosen yet
                      </option>
                    )}
                    {PAYMENT_METHODS.map((method) => (
                      <option key={method}>{method}</option>
                    ))}
                  </select>
                </label>
                {booking.paymentStatus === "Unpaid" && booking.status !== "Cancelled" && (
                  <Button variant="secondary" size="sm" className="h-10" onClick={() => setPaymentAction("Paid")} disabled={busy}>
                    <CreditCard className="size-4" aria-hidden="true" /> Mark as paid
                  </Button>
                )}
                {booking.paymentStatus === "Paid" && (
                  <Button variant="outline" size="sm" className="h-10 bg-transparent hover:bg-foreground/[0.06]" onClick={() => setPaymentAction("Refunded")} disabled={busy}>
                    <RotateCcw className="size-4" aria-hidden="true" /> Mark as refunded
                  </Button>
                )}
              </div>
              {booking.status === "Cancelled" && booking.paymentStatus === "Paid" && (
                <p className="mt-3 text-xs text-accent-ink">This booking is cancelled but still marked paid. Refund the guest, then mark it as refunded.</p>
              )}
            </Section>

            <Section title={finished ? "Status history" : "History"} icon={Clock}>
              {finished && <p className="mb-3 text-xs text-muted">This booking is {booking.status.toLowerCase()}; its status can no longer change.</p>}
              <ol className="relative space-y-3 before:absolute before:bottom-2 before:left-[5px] before:top-2 before:w-px before:bg-border">
                {[...booking.statusHistory].reverse().map((entry) => (
                  <li key={entry.id} className="relative flex gap-3 pl-0">
                    <span className={cn("relative mt-1.5 size-[11px] shrink-0 rounded-full ring-4 ring-surface", HISTORY_TONE[entry.status] ?? "bg-muted")} aria-hidden="true" />
                    <div className="min-w-0 text-sm">
                      <p className="text-foreground">
                        <span className="font-semibold">{entry.kind === "payment" ? `Payment ${entry.status.toLowerCase()}` : entry.status}</span>
                        <span className="text-muted"> · {entry.by}</span>
                      </p>
                      {entry.note && <p className="text-xs text-muted">{entry.note}</p>}
                      <time dateTime={entry.at} className="text-[11px] text-muted">
                        {dateTime.format(new Date(entry.at))}
                      </time>
                    </div>
                  </li>
                ))}
              </ol>
            </Section>
          </div>
        )}
      </Drawer>

      <ConfirmDialog
        open={Boolean(reasonAction)}
        onClose={() => {
          setReasonAction(null);
          setReason("");
        }}
        onConfirm={() => runStatus(reasonAction, reason)}
        loading={actions.deciding}
        confirmDisabled={reason.trim().length < 3}
        title={reasonAction === "reject" ? `Reject booking ${booking?.id}?` : `Cancel booking ${booking?.id}?`}
        description={
          reasonAction === "reject"
            ? "The booking becomes Cancelled with reason “Rejected by admin”. Add a short note for the guest."
            : "The booking becomes Cancelled. If the guest already paid, remember to mark the payment as refunded."
        }
        confirmLabel={reasonAction === "reject" ? "Reject booking" : "Cancel booking"}
        cancelLabel="Keep booking"
      >
        <ReasonField value={reason} onChange={setReason} label={reasonAction === "reject" ? "Reason for rejecting" : "Reason for cancelling"} />
      </ConfirmDialog>

      <ConfirmDialog
        open={Boolean(paymentAction)}
        onClose={() => setPaymentAction(null)}
        onConfirm={() => changePayment({ paymentStatus: paymentAction }, paymentAction === "Paid" ? `Booking ${booking?.id} marked as paid` : `Booking ${booking?.id} marked as refunded`)}
        loading={payment.isPending}
        tone={paymentAction === "Paid" ? "primary" : "danger"}
        icon={paymentAction === "Paid" ? CreditCard : RotateCcw}
        title={paymentAction === "Paid" ? `Mark ${booking ? formatUsd(booking.amount) : ""} as paid?` : `Refund ${booking ? formatUsd(booking.amount) : ""}?`}
        description={
          paymentAction === "Paid"
            ? `Records payment by ${booking?.paymentMethod ?? "the guest's method"} today. It counts toward today's income on the dashboard.`
            : "Marks the payment as refunded and removes it from income. Make sure the money was actually returned."
        }
        confirmLabel={paymentAction === "Paid" ? "Mark as paid" : "Mark as refunded"}
      />
    </>
  );
}
