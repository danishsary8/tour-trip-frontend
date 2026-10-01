import { Link } from "react-router-dom";
import { CalendarDays, Clock3, CreditCard, Download, Eye, Info, Star, Users, XCircle } from "lucide-react";
import { StatusBadge } from "../../../../components/shared/StatusBadge";
import { Tooltip } from "../../../../components/ui/Tooltip";
import { Spinner } from "../../../../components/ui/Spinner";
import { cn } from "../../../../lib/cn";
import { formatUsd } from "../../../../lib/format";
import { formatTripDate, travellersLabel } from "../../booking";
import { eyebrow, smallDanger, smallOutline, smallPrimary } from "./styles";

const TOTAL_LABEL = { Paid: "Paid", Refunded: "Refunded", Unpaid: "Total due" };

/** The one-line status note under a booking (what the traveller should know or do next). */
export function BookingNotice({ booking, className }) {
  let text = null;
  if (booking.status === "Pending" && !booking.paymentMethod) text = "Payment method not chosen yet. Finish checkout to keep your seats.";
  else if (booking.status === "Pending" && booking.paymentMethod === "Bank Transfer") text = `Awaiting your bank transfer, reference ${booking.id}. We confirm as soon as it arrives.`;
  else if (booking.status === "Pending" && booking.paymentMethod === "Cash") text = "Reserved. Pay your guide in cash on the day; we'll confirm your seats shortly.";
  else if (booking.paymentStatus === "Refunded") text = `Refund of ${formatUsd(booking.amount)} on its way to your original payment method (5–7 business days).`;
  if (!text) return null;
  return (
    <p className={cn("flex items-start gap-2 text-xs leading-relaxed text-muted", className)}>
      <Info className="mt-px size-3.5 shrink-0 text-primary-ink" aria-hidden="true" />
      {text}
    </p>
  );
}

/** Review state chip for completed trips. */
export function ReviewChip({ review }) {
  if (!review) return null;
  const approved = review.status === "Approved";
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-accent/12 px-2.5 py-0.5 text-xs font-semibold text-accent-ink ring-1 ring-inset ring-accent/25">
      <Star className="size-3 fill-current" aria-hidden="true" />
      {approved ? "Review published" : review.status === "Hidden" ? "Review not published" : "Review awaiting approval"}
    </span>
  );
}

/** A booking in the My Bookings list: photo, trip facts, statuses and the actions allowed now. */
export function MyBookingCard({ booking, review, cancellation, downloading, onOpen, onInvoice, onCancel, onReview }) {
  const canReview = booking.status === "Completed" && !review;
  const choosingPayment = booking.status === "Pending" && booking.paymentStatus === "Unpaid" && !booking.paymentMethod;
  const cancelBlocked = !cancellation.allowed && cancellation.reason;

  return (
    <article className="overflow-hidden rounded-panel border border-border bg-surface shadow-soft transition-shadow duration-300 hover:shadow-panel">
      <div className="grid sm:grid-cols-[208px_minmax(0,1fr)]">
        <button type="button" onClick={onOpen} tabIndex={-1} aria-hidden="true" className="relative block h-40 overflow-hidden sm:h-full">
          <img src={booking.tourImage} alt="" loading="lazy" decoding="async" className="size-full object-cover transition-transform duration-500 hover:scale-105" />
        </button>
        <div className="flex min-w-0 flex-col gap-4 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
            <div className="min-w-0">
              <p className={eyebrow}>{booking.destination} · <span className="tabular-nums">{booking.id}</span></p>
              <h3 className="mt-1 font-display text-xl font-semibold leading-snug text-foreground">
                <button type="button" onClick={onOpen} className="rounded text-left outline-none transition-colors hover:text-primary-ink focus-visible:ring-2 focus-visible:ring-primary">
                  {booking.tourPackage}
                </button>
              </h3>
            </div>
            <p className="text-right">
              <span className="block text-xs text-muted">{TOTAL_LABEL[booking.paymentStatus]}</span>
              <span className="font-display text-2xl font-semibold tabular-nums text-foreground">{formatUsd(booking.amount)}</span>
            </p>
          </div>

          <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted">
            <li className="flex items-center gap-1.5"><CalendarDays className="size-4 text-primary-ink" aria-hidden="true" />{formatTripDate(booking.travelDate)}</li>
            <li className="flex items-center gap-1.5"><Clock3 className="size-4 text-primary-ink" aria-hidden="true" />{booking.departureTime}</li>
            <li className="flex items-center gap-1.5"><Users className="size-4 text-primary-ink" aria-hidden="true" />{travellersLabel(booking.adults, booking.children)}</li>
          </ul>

          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={booking.status} />
            <StatusBadge status={booking.paymentStatus} />
            <ReviewChip review={review} />
          </div>
          <BookingNotice booking={booking} />

          <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-border pt-4">
            {choosingPayment && (
              <Link to={`/booking/${booking.tourId}?booking=${booking.id}`} className={smallPrimary}>
                <CreditCard className="size-3.5" aria-hidden="true" /> Choose payment
              </Link>
            )}
            {canReview && (
              <button type="button" onClick={onReview} className={smallPrimary}>
                <Star className="size-3.5" aria-hidden="true" /> Write a review
              </button>
            )}
            <button type="button" onClick={onOpen} className={smallOutline}>
              <Eye className="size-3.5" aria-hidden="true" /> View details
            </button>
            <button type="button" onClick={onInvoice} disabled={downloading} className={smallOutline} aria-label={`Download invoice for ${booking.id}`}>
              {downloading ? <Spinner label="Preparing invoice" className="size-3.5" /> : <Download className="size-3.5" aria-hidden="true" />} Invoice
            </button>
            {cancellation.allowed && (
              <button type="button" onClick={onCancel} className={cn(smallDanger, "sm:ml-auto")}>
                <XCircle className="size-3.5" aria-hidden="true" /> Cancel booking
              </button>
            )}
            {cancelBlocked && (
              <Tooltip label={cancellation.short} side="bottom" className="sm:ml-auto">
                <button type="button" aria-disabled="true" aria-label={`Cancel booking unavailable. ${cancellation.reason}`} className={cn(smallDanger, "cursor-not-allowed opacity-50 hover:bg-transparent")}>
                  <XCircle className="size-3.5" aria-hidden="true" /> Cancel booking
                </button>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
