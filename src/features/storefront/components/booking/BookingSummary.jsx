import { CalendarCheck, CalendarDays, Clock3, CreditCard, Mail, MessageSquareText, Phone, UserRound, Users } from "lucide-react";
import { StatusBadge } from "../../../../components/shared/StatusBadge";
import { cn } from "../../../../lib/cn";
import { formatDate } from "../../../../lib/format";
import { customerMethodName, formatTripDate, priceBreakdown, travellersLabel } from "../../booking";
import { PriceLines } from "./PriceSummary";
import { eyebrow } from "./styles";

const Item = ({ icon: Icon, label, children }) => (
  <div className="flex min-w-0 items-start gap-3">
    <Icon className="mt-0.5 size-4 shrink-0 text-primary-ink" aria-hidden="true" />
    <div className="min-w-0">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-0.5 break-words text-sm font-medium text-foreground">{children}</dd>
    </div>
  </div>
);

const TOTAL_LABEL = { Paid: "Total paid", Refunded: "Total (refunded)", Unpaid: "Total due" };

/** One booking as the traveller sees it: on the confirmation step and in My Bookings. */
export function BookingSummary({ booking, className }) {
  const breakdown = priceBreakdown(booking);
  return (
    <article className={cn("overflow-hidden rounded-panel border border-border bg-surface", className)} aria-label={`Booking ${booking.id}`}>
      <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center">
        {booking.tourImage && (
          <img src={booking.tourImage} alt="" width="120" height="90" loading="lazy" decoding="async" className="aspect-[4/3] w-full shrink-0 rounded-card object-cover sm:w-28" />
        )}
        <div className="min-w-0 flex-1">
          <p className={eyebrow}>{booking.destination}</p>
          <h3 className="mt-1 font-display text-lg font-semibold leading-snug text-foreground">{booking.tourPackage}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            <StatusBadge status={booking.status} />
            <StatusBadge status={booking.paymentStatus} />
          </div>
        </div>
      </div>
      <dl className="grid gap-4 p-5 sm:grid-cols-2">
        <Item icon={CalendarDays} label="Travel date">{formatTripDate(booking.travelDate)}</Item>
        <Item icon={Clock3} label="Departure time">{booking.departureTime}</Item>
        <Item icon={Users} label="Travellers">{travellersLabel(booking.adults, booking.children)}</Item>
        <Item icon={CreditCard} label="Payment method">{customerMethodName(booking.paymentMethod)}</Item>
        <Item icon={UserRound} label="Lead traveller">{booking.contactName ?? booking.customerName}</Item>
        <Item icon={CalendarCheck} label="Booked on">{formatDate(booking.bookingDate)}</Item>
        <Item icon={Mail} label="Email">{booking.contactEmail}</Item>
        {booking.contactPhone && <Item icon={Phone} label="Phone">{booking.contactPhone}</Item>}
        {booking.specialRequests && (
          <div className="sm:col-span-2">
            <Item icon={MessageSquareText} label="Special requests">{booking.specialRequests}</Item>
          </div>
        )}
      </dl>
      {booking.status === "Cancelled" && booking.cancelReason && (
        <p className="mx-5 rounded-card bg-danger/[0.07] px-4 py-3 text-sm text-danger-ink">Cancelled: {booking.cancelReason}</p>
      )}
      <div className="p-5">
        <PriceLines breakdown={breakdown} totalLabel={TOTAL_LABEL[booking.paymentStatus]} className="rounded-card bg-surface-2/50 p-4" />
      </div>
    </article>
  );
}
