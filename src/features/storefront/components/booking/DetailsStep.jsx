import { useId } from "react";
import { Link } from "react-router-dom";
import { useWatch } from "react-hook-form";
import { AlertCircle, ArrowLeft, ArrowRight, CalendarDays, Check, MessageSquareText, UserRound, Users } from "lucide-react";
import { cn } from "../../../../lib/cn";
import { formatUsd } from "../../../../lib/format";
import { formatTripDate, seatTone, seatsLeft } from "../../booking";
import { Counter } from "../BookingCard";
import { Field, TextArea, TextInput } from "../FormField";
import { outlinePill, primaryPill } from "./styles";

const REQUESTS_MAX = 500;

function Section({ icon: Icon, title, description, children }) {
  return (
    <section className="border-t border-border pt-7 first:border-t-0 first:pt-0">
      <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
        <Icon className="size-5 text-primary-ink" aria-hidden="true" />
        {title}
      </h3>
      {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

/**
 * Step 1: departure, travellers (pre-filled from Tour Detail, editable here), lead traveller
 * contact (pre-filled from the account) and optional special requests.
 */
export function DetailsStep({ form, tour, schedules, onContinue }) {
  const id = useId();
  const { register, setValue, control, handleSubmit, formState: { errors } } = form;
  const [scheduleId, adults, children, requests] = useWatch({ control, name: ["scheduleId", "adults", "children", "specialRequests"] });
  const selected = schedules.find((schedule) => schedule.id === scheduleId);
  const capacity = Math.min(tour.groupSize, selected ? seatsLeft(selected) : tour.groupSize);
  const describe = (name) => ({ id: `${id}-${name}`, error: errors[name]?.message });

  function choose(schedule) {
    setValue("scheduleId", schedule.id, { shouldValidate: true, shouldDirty: true });
    // Keep the party inside the seats left on the new date: trim children first, then adults.
    const left = Math.min(tour.groupSize, seatsLeft(schedule));
    const nextChildren = Math.max(0, Math.min(children, left - 1));
    setValue("children", nextChildren, { shouldDirty: true });
    setValue("adults", Math.max(1, Math.min(adults, left - nextChildren)), { shouldDirty: true });
  }

  function submit(values) {
    if (!selected || values.adults + values.children > seatsLeft(selected)) {
      form.setError("scheduleId", { message: "Not enough seats left on this date. Choose another departure or fewer travellers." });
      return;
    }
    onContinue(values);
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-7">
      <Section icon={CalendarDays} title="Departure" description="Seat counts are live. Change the date here if your plans have moved.">
        {schedules.length ? (
          <div role="group" aria-label="Departure dates" aria-describedby={errors.scheduleId ? `${id}-scheduleId-error` : undefined} className="grid max-h-72 gap-2 overflow-y-auto p-0.5 sm:grid-cols-2">
            {schedules.map((schedule) => {
              const left = seatsLeft(schedule);
              const active = schedule.id === scheduleId;
              return (
                <button
                  key={schedule.id}
                  type="button"
                  aria-pressed={active}
                  disabled={left === 0}
                  onClick={() => choose(schedule)}
                  className={cn(
                    "rounded-control border p-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-55",
                    active ? "border-primary bg-primary/[0.08]" : "border-border hover:border-primary/50 hover:bg-surface-2",
                  )}
                >
                  <span className="flex items-center justify-between gap-2 text-sm font-semibold text-foreground">
                    <span>{formatTripDate(schedule.date)} · {schedule.time}</span>
                    {active && <Check className="size-4 shrink-0 text-primary-ink" aria-hidden="true" />}
                  </span>
                  <span className="mt-1.5 flex items-center justify-between text-xs text-muted">
                    <span>{left ? `${left} seat${left === 1 ? "" : "s"} left` : "Sold out"}</span>
                    {schedule.priceOverride && <span className="font-semibold text-primary-ink">{formatUsd(schedule.priceOverride)} / person</span>}
                  </span>
                  <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-border" aria-hidden="true">
                    <span className={`block h-full rounded-full ${seatTone(schedule)}`} style={{ width: `${(schedule.seatsBooked / schedule.capacity) * 100}%` }} />
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="rounded-control border border-dashed border-border p-4 text-sm text-muted">
            No departures are open for this tour right now.{" "}
            <Link to="/contact" className="font-semibold text-primary-ink underline-offset-2 hover:underline">Ask us about private dates</Link>.
          </p>
        )}
        {errors.scheduleId && (
          <p id={`${id}-scheduleId-error`} role="alert" className="mt-2 flex items-center gap-1 text-xs text-danger-ink">
            <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
            {errors.scheduleId.message}
          </p>
        )}
      </Section>

      <Section icon={Users} title="Travellers" description={`Up to ${capacity} on ${selected ? "this departure" : "this tour"}. Children pay the per-person price.`}>
        <div className="max-w-sm divide-y divide-border rounded-card border border-border px-4">
          <Counter label="Adults" value={adults} min={1} max={Math.max(1, capacity - children)} onChange={(value) => setValue("adults", value, { shouldDirty: true })} />
          <Counter label="Children" value={children} min={0} max={Math.max(0, capacity - adults)} onChange={(value) => setValue("children", value, { shouldDirty: true })} />
        </div>
      </Section>

      <Section icon={UserRound} title="Lead traveller" description="We'll send the confirmation and pickup details here.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field {...describe("name")} label="Full name" className="sm:col-span-2">
            <TextInput {...describe("name")} autoComplete="name" {...register("name")} />
          </Field>
          <Field {...describe("email")} label="Email">
            <TextInput {...describe("email")} type="email" autoComplete="email" inputMode="email" {...register("email")} />
          </Field>
          <Field {...describe("phone")} label="Phone (with country code)">
            <TextInput {...describe("phone")} type="tel" autoComplete="tel" inputMode="tel" placeholder="+855 12 345 678" {...register("phone")} />
          </Field>
        </div>
      </Section>

      <Section icon={MessageSquareText} title="Special requests" description="Dietary needs, hotel pickup, accessibility: anything that helps your guide.">
        <Field
          {...describe("specialRequests")}
          label="Requests"
          optional
          hint={<span className="text-xs tabular-nums text-muted" aria-live="polite">{requests?.length ?? 0}/{REQUESTS_MAX}</span>}
        >
          <TextArea {...describe("specialRequests")} maxLength={REQUESTS_MAX} placeholder="e.g. Vegetarian lunch for one, pickup from our hotel near the Old Market" {...register("specialRequests")} />
        </Field>
      </Section>

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Link to={`/tours/${tour.id}`} className={outlinePill}>
          <ArrowLeft className="size-4" aria-hidden="true" /> Back to tour
        </Link>
        <button type="submit" className={primaryPill} disabled={!schedules.length}>
          Continue to review <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
