import { useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import { Compass, LockKeyhole, RefreshCw, Ticket } from "lucide-react";
import { EmptyState } from "../../../components/shared/EmptyState";
import { Skeleton } from "../../../components/shared/Skeleton";
import { motionEase } from "../../../lib/motion";
import { useCreateBooking, useMyBookings } from "../../bookings/hooks";
import { useSettings } from "../../settings/hooks";
import { useCustomerAuth } from "../auth/CustomerAuthContext";
import { BOOKING_STEPS, awaitsPaymentChoice, priceBreakdown, seatsLeft, unitPriceOf, upcomingSchedules } from "../booking";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { BookingStepper } from "../components/booking/BookingStepper";
import { ConfirmationStep } from "../components/booking/ConfirmationStep";
import { DetailsStep } from "../components/booking/DetailsStep";
import { PaymentStep } from "../components/booking/PaymentStep";
import { MobileTotalBar, TripSummary } from "../components/booking/PriceSummary";
import { ReviewStep } from "../components/booking/ReviewStep";
import { outlinePill, primaryPill } from "../components/booking/styles";
import { useTourDetail } from "../hooks";
import { bookingDetailsSchema } from "../schema";

const STEP_COPY = [
  { title: "Your details", description: "Pick your departure, who's coming and how we can reach you." },
  { title: "Review & confirm", description: "Check everything before we reserve your seats." },
  { title: "Payment", description: "Choose how you'd like to pay." },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function Shell({ tour, children }) {
  return (
    <div className="mx-auto max-w-[1320px] px-5 pb-32 pt-28 sm:pt-32 lg:px-8 lg:pb-24">
      <Breadcrumbs className="mb-7" items={[{ label: "Tours", to: "/tours" }, ...(tour ? [{ label: tour.name, to: `/tours/${tour.id}` }] : []), { label: "Booking" }]} />
      {children}
    </div>
  );
}

function LoadingState() {
  return (
    <Shell>
      <div role="status" aria-label="Loading your booking" className="space-y-8">
        <div className="space-y-3"><Skeleton className="h-4 w-36" /><Skeleton className="h-11 w-2/3 max-w-lg" /></div>
        <div className="grid grid-cols-4 gap-3">{BOOKING_STEPS.map((step) => <Skeleton key={step.key} className="h-1.5 w-full" />)}</div>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-5 rounded-panel border border-border bg-surface p-6 sm:p-8">
            <Skeleton className="h-7 w-48" />
            <div className="grid gap-2 sm:grid-cols-2">{[0, 1, 2, 3].map((item) => <Skeleton key={item} className="h-20 w-full rounded-control" />)}</div>
            <Skeleton className="h-28 w-full max-w-sm rounded-card" />
            <div className="grid gap-4 sm:grid-cols-2"><Skeleton className="h-12 w-full sm:col-span-2" /><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div>
          </div>
          <div className="hidden space-y-4 rounded-panel border border-border bg-surface p-6 lg:block">
            <Skeleton className="aspect-[16/9] w-full rounded-card" /><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </Shell>
  );
}

/**
 * /booking/:tourId — the checkout wizard: 1 Your details → 2 Review & confirm (creates the
 * booking) → 3 Payment → 4 Confirmation. Date and travellers arrive from Tour Detail as query
 * params. After step 2 the URL carries `?booking=<id>`, so a refresh resumes at payment or
 * confirmation instead of booking twice.
 */
export default function BookingPage() {
  const { tourId } = useParams();
  const [params, setParams] = useSearchParams();
  const { user } = useCustomerAuth();
  const detail = useTourDetail(tourId);
  const settings = useSettings();
  const mine = useMyBookings(user?.email);

  if (detail.isLoading || settings.isLoading || mine.isLoading) return <LoadingState />;

  if (detail.isError || settings.isError || mine.isError) {
    return (
      <Shell>
        <EmptyState
          title="We couldn't load checkout"
          description="Something went wrong on our side. Your card has not been charged."
          action={<button type="button" onClick={() => { detail.refetch(); settings.refetch(); mine.refetch(); }} className={primaryPill}><RefreshCw className="size-4" aria-hidden="true" /> Try again</button>}
        />
      </Shell>
    );
  }

  if (!detail.data) {
    return (
      <Shell>
        <EmptyState
          icon={Compass}
          title="We couldn't find that tour"
          description={`There's no bookable tour at “${tourId}”. It may have been renamed or retired.`}
          action={<Link to="/tours" className={primaryPill}>Browse all tours</Link>}
        />
      </Shell>
    );
  }

  return (
    <Wizard
      key={detail.data.tour.id}
      tour={detail.data.tour}
      schedules={detail.data.schedules}
      settings={settings.data}
      user={user}
      myBookings={mine.data ?? []}
      params={params}
      setParams={setParams}
    />
  );
}

function Wizard({ tour, schedules, settings, user, myBookings, params, setParams }) {
  const reduceMotion = useReducedMotion();
  const headingRef = useRef(null);
  const create = useCreateBooking();
  const [createError, setCreateError] = useState(null);

  // Resume a booking created earlier in this checkout (refresh, or "Choose payment" in My Bookings).
  const bookingParam = params.get("booking");
  const [booking, setBooking] = useState(() => myBookings.find((item) => item.id === bookingParam && item.tourId === tour.id) ?? null);
  const [step, setStep] = useState(() => (booking ? (awaitsPaymentChoice(booking) ? 2 : 3) : 0));

  const upcoming = upcomingSchedules(schedules);
  const form = useForm({
    resolver: zodResolver(bookingDetailsSchema),
    mode: "onTouched",
    defaultValues: (() => {
      const schedule = upcoming.find((item) => item.date === params.get("date") && seatsLeft(item) > 0);
      const room = Math.min(tour.groupSize, schedule ? seatsLeft(schedule) : tour.groupSize);
      const adults = clamp(Number(params.get("adults")) || 1, 1, room);
      const children = clamp(Number(params.get("children")) || 0, 0, room - adults);
      return {
        scheduleId: schedule?.id ?? "",
        adults,
        children,
        name: user.name,
        email: user.email,
        // Pre-fill the phone from the traveller's most recent booking, else the one given at sign-up.
        phone: myBookings.find((item) => item.contactPhone)?.contactPhone ?? user.phone ?? "",
        specialRequests: "",
      };
    })(),
  });
  const [scheduleId, adults, children] = useWatch({ control: form.control, name: ["scheduleId", "adults", "children"] });
  const selected = upcoming.find((item) => item.id === scheduleId);

  if (bookingParam && !booking) {
    return (
      <Shell tour={tour}>
        <EmptyState
          icon={Ticket}
          title="We couldn't find that booking"
          description={`Booking ${bookingParam} isn't linked to your account for this tour. Your trips are all in My Bookings.`}
          action={<><Link to="/my-bookings" className={primaryPill}>Go to My Bookings</Link><button type="button" onClick={() => setParams({}, { replace: true })} className={outlinePill}>Start a new booking</button></>}
        />
      </Shell>
    );
  }

  function goTo(next) {
    setStep(next);
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    // Move focus to the new step's heading so screen readers announce it.
    requestAnimationFrame(() => headingRef.current?.focus({ preventScroll: true }));
  }

  async function confirmBooking() {
    const values = form.getValues();
    setCreateError(null);
    try {
      const created = await create.mutateAsync({
        account: user,
        tourId: tour.id,
        scheduleId: values.scheduleId,
        adults: values.adults,
        children: values.children,
        contact: { name: values.name.trim(), email: values.email.trim(), phone: values.phone.trim() },
        specialRequests: values.specialRequests.trim(),
      });
      setBooking(created);
      setParams({ booking: created.id }, { replace: true });
      toast.success(`Booking ${created.id} reserved`, { description: "Your seats are held. One last step: payment." });
      goTo(2);
    } catch (error) {
      setCreateError(error.message || "We couldn't reserve your seats. Please try again.");
    }
  }

  const summarySchedule = booking ? { date: booking.travelDate, time: booking.departureTime } : selected;
  const breakdown = booking ? priceBreakdown(booking) : priceBreakdown({ unitPrice: unitPriceOf(tour, selected), adults, children });
  const party = booking ? { adults: booking.adults, children: booking.children } : { adults, children };
  const slide = reduceMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0 } }
    : { initial: { opacity: 0, x: 18 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -12 }, transition: { duration: 0.28, ease: motionEase } };

  return (
    <Shell tour={tour}>
      <header className="mb-8 flex flex-col gap-2">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary-ink">
          <LockKeyhole className="size-3.5" aria-hidden="true" /> Secure checkout
        </p>
        <h1 className="font-display text-[clamp(2rem,4.4vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-balance text-foreground">
          {step === 3 ? "Booking complete" : `Book ${tour.name}`}
        </h1>
      </header>

      <div className="mb-8 sm:mb-10"><BookingStepper step={step} /></div>

      {step === 3 ? (
        <div ref={headingRef} tabIndex={-1} className="outline-none" aria-label="Booking confirmation">
          <ConfirmationStep booking={booking} settings={settings} />
        </div>
      ) : (
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px] xl:gap-12">
          <section className="min-w-0 rounded-panel border border-border bg-surface p-5 sm:p-8" aria-labelledby="booking-step-title">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-ink">{String(step + 1).padStart(2, "0")} / {String(BOOKING_STEPS.length).padStart(2, "0")}</p>
            <h2 id="booking-step-title" ref={headingRef} tabIndex={-1} className="mt-1 font-display text-2xl font-semibold tracking-[-0.02em] text-foreground outline-none">
              {STEP_COPY[step].title}
            </h2>
            <p className="mt-1 text-sm text-muted">{STEP_COPY[step].description}</p>
            <div className="mt-7">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={step} {...slide}>
                  {step === 0 && <DetailsStep form={form} tour={tour} schedules={upcoming} onContinue={() => goTo(1)} />}
                  {step === 1 && selected && (
                    <ReviewStep
                      tour={tour}
                      schedule={selected}
                      details={form.getValues()}
                      breakdown={breakdown}
                      onEdit={() => goTo(0)}
                      onConfirm={confirmBooking}
                      confirming={create.isPending}
                      error={createError}
                    />
                  )}
                  {step === 2 && booking && (
                    <PaymentStep booking={booking} settings={settings} email={user.email} onPaid={(paid) => { setBooking(paid); goTo(3); }} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </section>
          <TripSummary tour={tour} schedule={summarySchedule} adults={party.adults} childCount={party.children} breakdown={breakdown} />
        </div>
      )}

      {step < 2 && <MobileTotalBar adults={party.adults} childCount={party.children} total={breakdown.total} />}
    </Shell>
  );
}
