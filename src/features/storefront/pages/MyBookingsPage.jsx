import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import { CalendarClock, CheckCircle2, Compass, Plane, RefreshCw, Ticket } from "lucide-react";
import { EmptyState } from "../../../components/shared/EmptyState";
import { Skeleton } from "../../../components/shared/Skeleton";
import { Tabs, tabId, tabPanelId } from "../../../components/shared/Tabs";
import { motionEase } from "../../../lib/motion";
import { useMyBookings } from "../../bookings/hooks";
import { downloadInvoice } from "../../bookings/invoice";
import { useReviewsForBookings } from "../../reviews/hooks";
import { useSettings } from "../../settings/hooks";
import { useCustomerAuth } from "../auth/CustomerAuthContext";
import { cancellationOf, formatTripDate, isUpcoming } from "../booking";
import { PageIntro } from "../components/PageIntro";
import { BookingDetailDrawer } from "../components/booking/BookingDetailDrawer";
import { CancelBookingDialog } from "../components/booking/CancelBookingDialog";
import { MyBookingCard } from "../components/booking/MyBookingCard";
import { ReviewDialog } from "../components/booking/ReviewDialog";
import { outlinePill, primaryPill } from "../components/booking/styles";

const FILTERS = {
  all: { label: "All", empty: "No bookings yet" },
  upcoming: { label: "Upcoming", match: isUpcoming, empty: "No upcoming trips" },
  completed: { label: "Completed", match: (booking) => booking.status === "Completed", empty: "No completed trips yet" },
  cancelled: { label: "Cancelled", match: (booking) => booking.status === "Cancelled", empty: "No cancelled bookings" },
};

/** Upcoming trips soonest first, then everything else most recent first. */
function sortBookings(list) {
  return [...list].sort((a, b) => {
    const upcomingA = isUpcoming(a);
    const upcomingB = isUpcoming(b);
    if (upcomingA !== upcomingB) return upcomingA ? -1 : 1;
    return upcomingA ? a.travelDate.localeCompare(b.travelDate) : b.travelDate.localeCompare(a.travelDate);
  });
}

function Stat({ icon: Icon, label, value, detail }) {
  return (
    <div className="flex min-w-0 items-center gap-4 rounded-card border border-border bg-surface p-5 shadow-soft">
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary-ink"><Icon className="size-5" aria-hidden="true" /></span>
      <div className="min-w-0">
        <p className="text-xs text-muted">{label}</p>
        <p className="truncate font-display text-lg font-semibold text-foreground">{value}</p>
        {detail && <p className="truncate text-xs text-muted">{detail}</p>}
      </div>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-5" role="status" aria-label="Loading your bookings">
      {[0, 1, 2].map((item) => (
        <div key={item} className="grid overflow-hidden rounded-panel border border-border bg-surface sm:grid-cols-[208px_1fr]">
          <Skeleton className="h-40 rounded-none sm:h-full" />
          <div className="space-y-3 p-6"><Skeleton className="h-3 w-32" /><Skeleton className="h-6 w-2/3" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-5 w-40" /><Skeleton className="h-9 w-full" /></div>
        </div>
      ))}
    </div>
  );
}

/**
 * /my-bookings — the signed-in traveller's bookings, read from the same bookings store the
 * admin manages: filters, detail drawer (`?booking=`), invoice, cancel with refund, and reviews
 * for completed trips.
 */
export default function MyBookingsPage() {
  const { user } = useCustomerAuth();
  const reduceMotion = useReducedMotion();
  const [params, setParams] = useSearchParams();
  const mine = useMyBookings(user.email);
  const settings = useSettings();
  const bookings = sortBookings(mine.data ?? []);
  const completedIds = bookings.filter((booking) => booking.status === "Completed").map((booking) => booking.id);
  const reviews = useReviewsForBookings(completedIds);
  const reviewFor = (id) => reviews.data?.find((review) => review.bookingId === id) ?? null;
  const [dialog, setDialog] = useState({ type: null, id: null, open: false });
  const [downloadingId, setDownloadingId] = useState(null);

  const filter = FILTERS[params.get("tab")] ? params.get("tab") : "all";
  const visible = FILTERS[filter].match ? bookings.filter(FILTERS[filter].match) : bookings;
  const selectedId = params.get("booking");
  const selected = bookings.find((booking) => booking.id === selectedId) ?? null;
  const dialogBooking = bookings.find((booking) => booking.id === dialog.id) ?? null;
  const upcoming = bookings.filter(isUpcoming);
  const next = [...upcoming].sort((a, b) => a.travelDate.localeCompare(b.travelDate))[0];

  const updateParams = (changes) =>
    setParams((current) => {
      const nextParams = new URLSearchParams(current);
      Object.entries(changes).forEach(([key, value]) => (value ? nextParams.set(key, value) : nextParams.delete(key)));
      return nextParams;
    });
  const cancellation = (booking) => (booking ? cancellationOf(booking, settings.data) : { allowed: false });
  const openDialog = (type, booking) => setDialog({ type, id: booking.id, open: true });
  const closeDialog = () => setDialog((current) => ({ ...current, open: false }));

  async function invoice(booking) {
    setDownloadingId(booking.id);
    try {
      await downloadInvoice(booking, settings.data);
      toast.success("Invoice downloaded", { description: `tourtrip-invoice-${booking.id}.pdf` });
    } catch {
      toast.error("The invoice could not be created. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  }

  const firstName = user.name.split(" ")[0];
  const tabs = Object.entries(FILTERS).map(([value, { label, match }]) => ({ value, label: mine.data ? `${label} (${match ? bookings.filter(match).length : bookings.length})` : label }));
  const loading = mine.isLoading || settings.isLoading;

  return (
    <>
      <PageIntro
        breadcrumbs={[{ label: "My bookings" }]}
        eyebrow="Your trips"
        title="My bookings"
        actions={<Link to="/tours" className={primaryPill}><Compass className="size-4" aria-hidden="true" /> Browse tours</Link>}
      >
        Hi {firstName}. Every trip you&apos;ve booked with TourTrip, with invoices, cancellations and reviews in one place.
      </PageIntro>

      <div className="mx-auto max-w-[1320px] space-y-8 px-5 pb-24 lg:px-8">
        {mine.isError || settings.isError ? (
          <EmptyState
            title="We couldn't load your bookings"
            description="Please check your connection and try again."
            action={<button type="button" onClick={() => { mine.refetch(); settings.refetch(); }} className={primaryPill}><RefreshCw className="size-4" aria-hidden="true" /> Try again</button>}
          />
        ) : loading ? (
          <>
            <div className="grid gap-4 sm:grid-cols-3">{[0, 1, 2].map((item) => <Skeleton key={item} className="h-[88px] w-full rounded-card" />)}</div>
            <ListSkeleton />
          </>
        ) : bookings.length === 0 ? (
          <EmptyState
            icon={Ticket}
            title="No trips booked yet"
            description="When you book a tour it appears here, with your invoice and everything you need for the day."
            action={<Link to="/tours" className={primaryPill}><Compass className="size-4" aria-hidden="true" /> Browse tours</Link>}
          />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <Stat icon={Plane} label="Upcoming trips" value={upcoming.length} detail={upcoming.length ? "Pending or confirmed" : "Time to plan the next one"} />
              <Stat icon={CalendarClock} label="Next departure" value={next ? formatTripDate(next.travelDate) : "Nothing booked"} detail={next?.tourPackage ?? "Browse tours to plan a trip"} />
              <Stat icon={CheckCircle2} label="Trips completed" value={completedIds.length} detail={completedIds.length ? "Share a review for each one" : "Your adventures start soon"} />
            </div>

            <div>
              <Tabs tabs={tabs} value={filter} onChange={(value) => updateParams({ tab: value === "all" ? null : value })} label="Filter bookings" idPrefix="my-bookings" />
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={filter}
                  role="tabpanel"
                  id={tabPanelId("my-bookings", filter)}
                  aria-labelledby={tabId("my-bookings", filter)}
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                  transition={{ duration: reduceMotion ? 0 : 0.25, ease: motionEase }}
                  className="pt-6"
                >
                  {visible.length ? (
                    <ul className="space-y-5">
                      {visible.map((booking) => (
                        <li key={booking.id}>
                          <MyBookingCard
                            booking={booking}
                            review={reviewFor(booking.id)}
                            cancellation={cancellation(booking)}
                            downloading={downloadingId === booking.id}
                            onOpen={() => updateParams({ booking: booking.id })}
                            onInvoice={() => invoice(booking)}
                            onCancel={() => openDialog("cancel", booking)}
                            onReview={() => openDialog("review", booking)}
                          />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <EmptyState
                      compact
                      icon={Ticket}
                      title={FILTERS[filter].empty}
                      description="Nothing here right now."
                      action={<button type="button" onClick={() => updateParams({ tab: null })} className={outlinePill}>Show all bookings</button>}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </>
        )}
      </div>

      <BookingDetailDrawer
        open={Boolean(selected)}
        booking={selected}
        review={selected ? reviewFor(selected.id) : null}
        cancellation={cancellation(selected)}
        downloading={downloadingId === selected?.id}
        onClose={() => updateParams({ booking: null })}
        onInvoice={() => invoice(selected)}
        onCancel={() => openDialog("cancel", selected)}
        onReview={() => openDialog("review", selected)}
      />
      {dialog.type === "cancel" && <CancelBookingDialog key={dialog.id} booking={dialogBooking} email={user.email} open={dialog.open} onClose={closeDialog} />}
      {dialog.type === "review" && <ReviewDialog key={dialog.id} booking={dialogBooking} open={dialog.open} onClose={closeDialog} />}
    </>
  );
}
