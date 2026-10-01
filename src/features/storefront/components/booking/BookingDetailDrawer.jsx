import { Link } from "react-router-dom";
import { CreditCard, Download, Info, Star, XCircle } from "lucide-react";
import { Drawer } from "../../../../components/shared/Drawer";
import { Spinner } from "../../../../components/ui/Spinner";
import { awaitsPaymentChoice } from "../../booking";
import { BookingSummary } from "./BookingSummary";
import { BookingNotice, ReviewChip } from "./MyBookingCard";
import { smallDanger, smallOutline, smallPrimary } from "./styles";

const when = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
const EVENT_LABEL = { Pending: "Booking received", Paid: "Payment received", Refunded: "Refund issued", "Method chosen": "Payment method chosen", "Method changed": "Payment method changed" };
const WHO = { Customer: "You", Admin: "TourTrip team", Guide: "Your guide", System: "Automatic" };

/** Status and payment events, oldest first, worded for the traveller. */
function Timeline({ history }) {
  return (
    <ol className="relative space-y-4 border-l border-border pl-5">
      {history.map((entry) => (
        <li key={entry.id} className="relative">
          <span className={`absolute -left-[26px] top-1 size-2.5 rounded-full ring-4 ring-surface ${entry.kind === "payment" ? "bg-accent" : "bg-primary"}`} aria-hidden="true" />
          <p className="text-sm font-semibold text-foreground">{EVENT_LABEL[entry.status] ?? entry.status}</p>
          <p className="text-xs text-muted">
            <time dateTime={entry.at}>{when.format(new Date(entry.at))}</time> · {WHO[entry.by] ?? entry.by}
          </p>
          {entry.note && <p className="mt-1 text-xs leading-relaxed text-muted">{entry.note}</p>}
        </li>
      ))}
    </ol>
  );
}

/** Full booking detail for My Bookings (`?booking=<id>`): the confirmation summary plus history. */
export function BookingDetailDrawer({ open, booking, review, cancellation, downloading, onClose, onInvoice, onCancel, onReview }) {
  return (
    <Drawer
      open={open && Boolean(booking)}
      onClose={onClose}
      wide
      title={booking ? `Booking ${booking.id}` : ""}
      description={booking?.tourPackage}
      footer={
        booking && (
          <>
            {cancellation.allowed && (
              <button type="button" onClick={onCancel} className={`${smallDanger} mr-auto`}>
                <XCircle className="size-3.5" aria-hidden="true" /> Cancel booking
              </button>
            )}
            <button type="button" onClick={onInvoice} disabled={downloading} className={smallOutline}>
              {downloading ? <Spinner label="Preparing invoice" className="size-3.5" /> : <Download className="size-3.5" aria-hidden="true" />} Download invoice
            </button>
            {awaitsPaymentChoice(booking) && (
              <Link to={`/booking/${booking.tourId}?booking=${booking.id}`} className={smallPrimary}>
                <CreditCard className="size-3.5" aria-hidden="true" /> Choose payment
              </Link>
            )}
            {booking.status === "Completed" && !review && (
              <button type="button" onClick={onReview} className={smallPrimary}>
                <Star className="size-3.5" aria-hidden="true" /> Write a review
              </button>
            )}
          </>
        )
      }
    >
      {booking && (
        <div className="space-y-6">
          <BookingNotice booking={booking} className="rounded-card bg-surface-2/70 p-3 text-sm" />
          {!cancellation.allowed && cancellation.reason && ["Pending", "Confirmed"].includes(booking.status) && (
            <p className="flex items-start gap-2 rounded-card bg-accent/[0.1] p-3 text-sm text-accent-ink">
              <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>
                {cancellation.reason} <Link to="/contact" className="font-semibold underline underline-offset-2 hover:no-underline">Contact us</Link>
              </span>
            </p>
          )}
          {review && <ReviewChip review={review} />}
          <BookingSummary booking={booking} />
          <section aria-labelledby="booking-history-title">
            <h3 id="booking-history-title" className="mb-4 font-display text-lg font-semibold text-foreground">History</h3>
            <Timeline history={booking.statusHistory} />
          </section>
        </div>
      )}
    </Drawer>
  );
}
