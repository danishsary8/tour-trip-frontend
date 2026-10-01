import { AlertCircle, ArrowLeft, CalendarDays, Clock3, Mail, MapPin, Pencil, Phone, ShieldCheck, UserRound, Users } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { formatTripDate, travellersLabel } from "../../booking";
import { CANCELLATION_WINDOW } from "../../content";
import { PriceLines } from "./PriceSummary";
import { eyebrow, outlinePill, quietButton } from "./styles";

function Card({ title, onEdit, editLabel, children }) {
  return (
    <section className="rounded-card border border-border bg-surface-2/35 p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {onEdit && (
          <button type="button" onClick={onEdit} className={quietButton} aria-label={editLabel}>
            <Pencil className="size-3.5" aria-hidden="true" /> Edit
          </button>
        )}
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

const Row = ({ icon: Icon, children }) => (
  <li className="flex min-w-0 items-start gap-2.5">
    <Icon className="mt-0.5 size-4 shrink-0 text-primary-ink" aria-hidden="true" />
    <span className="min-w-0 break-words">{children}</span>
  </li>
);

/**
 * Step 2: read-only recap with Edit shortcuts back to step 1 (the form keeps every value).
 * "Confirm booking" creates the real booking (Pending/Unpaid) in the shared store.
 */
export function ReviewStep({ tour, schedule, details, breakdown, onEdit, onConfirm, confirming, error }) {
  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-4 overflow-hidden rounded-card border border-border sm:flex-row">
        <img src={tour.image} alt="" width="220" height="165" decoding="async" className="aspect-[16/9] w-full object-cover sm:aspect-auto sm:w-52" />
        <div className="min-w-0 px-5 pb-5 sm:py-5 sm:pl-0">
          <p className={eyebrow}>{tour.category}</p>
          <h3 className="mt-1 font-display text-xl font-semibold tracking-[-0.01em] text-foreground">{tour.name}</h3>
          <ul className="mt-3 grid gap-2 text-sm text-muted sm:grid-cols-2">
            <Row icon={CalendarDays}>{formatTripDate(schedule.date)}</Row>
            <Row icon={Clock3}>Departs {schedule.time} · {tour.durationLabel}</Row>
            <Row icon={MapPin}>{tour.destination}</Row>
          </ul>
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        <Card title="Date & travellers" onEdit={onEdit} editLabel="Edit date and travellers">
          <ul className="space-y-2 text-sm text-muted">
            <Row icon={CalendarDays}>{formatTripDate(schedule.date)} at {schedule.time}</Row>
            <Row icon={Users}>{travellersLabel(details.adults, details.children)}</Row>
          </ul>
        </Card>
        <Card title="Lead traveller" onEdit={onEdit} editLabel="Edit contact details">
          <ul className="space-y-2 text-sm text-muted">
            <Row icon={UserRound}>{details.name}</Row>
            <Row icon={Mail}>{details.email}</Row>
            <Row icon={Phone}>{details.phone}</Row>
          </ul>
        </Card>
      </div>

      <Card title="Special requests" onEdit={onEdit} editLabel="Edit special requests">
        <p className="text-sm leading-relaxed text-muted">{details.specialRequests?.trim() || "None. You can still message us any time before the tour."}</p>
      </Card>

      <Card title="Price breakdown">
        <PriceLines breakdown={breakdown} />
        <p className="mt-3 text-xs text-muted">All prices in USD, taxes and guide included. You choose how to pay on the next step.</p>
      </Card>

      <p className="flex items-start gap-2 text-sm text-muted">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success-ink" aria-hidden="true" />
        Confirming reserves your seats. Free cancellation up to {CANCELLATION_WINDOW} before departure.
      </p>

      {error && (
        <p role="alert" className="flex items-start gap-2 rounded-card border border-danger/30 bg-danger/[0.07] p-4 text-sm text-danger-ink">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <button type="button" onClick={onEdit} className={outlinePill} disabled={confirming}>
          <ArrowLeft className="size-4" aria-hidden="true" /> Back to details
        </button>
        <Button size="lg" onClick={onConfirm} loading={confirming} className="rounded-full px-7 text-sm">
          Confirm booking
        </Button>
      </div>
    </div>
  );
}
