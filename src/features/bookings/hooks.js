import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { REJECT_REASON } from "../../mocks/dashboard";
import {
  STATUS_ACTIONS,
  bulkConfirmBookings,
  cancelMyBooking,
  createBooking,
  decideBooking,
  getBookings,
  getMyBookings,
  payBooking,
  restoreBooking,
  updateBookingPayment,
  updateBookingStatus,
} from "./api";

export const BOOKINGS_KEY = ["bookings"];
const SHELL_KEY = ["shell-summary"];

export function useBookings() {
  return useQuery({ queryKey: BOOKINGS_KEY, queryFn: getBookings });
}

/** The dashboard and list observe one query cache and one mutable mock store. */
export function useRecentBookings() {
  return useQuery({ queryKey: BOOKINGS_KEY, queryFn: getBookings, select: (bookings) => bookings.slice(0, 6) });
}

export function useBooking(id) {
  return useQuery({
    queryKey: BOOKINGS_KEY,
    queryFn: getBookings,
    enabled: Boolean(id),
    select: (bookings) => bookings.find((booking) => booking.id === id) ?? null,
  });
}

/**
 * Applies `patch` to the cached bookings and re-derives the sidebar's pending badge from
 * the patched list, so every screen reacts before the mock request resolves.
 */
function patchCaches(queryClient, patches) {
  queryClient.setQueryData(BOOKINGS_KEY, (list) =>
    list?.map((booking) => (patches[booking.id] ? { ...booking, ...patches[booking.id] } : booking)),
  );
  const list = queryClient.getQueryData(BOOKINGS_KEY);
  if (!list) return;
  const pending = list.filter((booking) => booking.status === "Pending").length;
  queryClient.setQueryData(SHELL_KEY, (summary) => (summary ? { ...summary, badges: { ...summary.badges, bookings: pending } } : summary));
}

function refreshAfterChange(queryClient) {
  queryClient.invalidateQueries({ queryKey: BOOKINGS_KEY });
  queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  queryClient.invalidateQueries({ queryKey: ["customers"] });
  queryClient.invalidateQueries({ queryKey: ["reports"] });
  queryClient.invalidateQueries({ queryKey: SHELL_KEY });
}

/** Optimistic mutation wrapper: `toPatches(variables)` returns `{ [bookingId]: fields }`. */
function useOptimisticBookingMutation(mutationFn, toPatches) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onMutate: async (variables) => {
      await Promise.all([queryClient.cancelQueries({ queryKey: BOOKINGS_KEY }), queryClient.cancelQueries({ queryKey: SHELL_KEY })]);
      const previous = { bookings: queryClient.getQueryData(BOOKINGS_KEY), shell: queryClient.getQueryData(SHELL_KEY) };
      patchCaches(queryClient, toPatches(variables));
      return previous;
    },
    onError: (_error, _variables, previous) => {
      queryClient.setQueryData(BOOKINGS_KEY, previous?.bookings);
      queryClient.setQueryData(SHELL_KEY, previous?.shell);
    },
    onSettled: () => refreshAfterChange(queryClient),
  });
}

const statusPatch = (action) => {
  const rule = STATUS_ACTIONS[action];
  return { status: rule.to, cancelReason: rule.to === "Cancelled" ? (action === "reject" ? REJECT_REASON : "Cancelled by admin") : null };
};

export const useBookingStatus = () =>
  useOptimisticBookingMutation(updateBookingStatus, ({ id, action }) => ({ [id]: statusPatch(action) }));

/** Dashboard quick actions: `{ id, decision: "confirm" | "reject" }`. */
export const useBookingDecision = () =>
  useOptimisticBookingMutation(decideBooking, ({ id, decision }) => ({ [id]: statusPatch(decision) }));

export const useBookingPayment = () =>
  useOptimisticBookingMutation(updateBookingPayment, ({ id, paymentStatus, paymentMethod }) => ({
    [id]: { ...(paymentStatus && { paymentStatus }), ...(paymentMethod && { paymentMethod }) },
  }));

export const useBulkConfirm = () =>
  useOptimisticBookingMutation(bulkConfirmBookings, (ids) => Object.fromEntries(ids.map((id) => [id, statusPatch("confirm")])));

export const useRestoreBooking = () =>
  useOptimisticBookingMutation(restoreBooking, ({ id, snapshot }) => ({ [id]: snapshot }));

const TOAST_COPY = {
  confirm: (booking) => [`Booking ${booking.id} confirmed`, `${booking.customerName} · ${booking.tourPackage}`],
  reject: (booking) => [`Booking ${booking.id} rejected`, "Cancelled with reason “Rejected by admin”."],
  complete: (booking) => [`Booking ${booking.id} completed`, `${booking.customerName} finished ${booking.tourPackage}.`],
  cancel: (booking) => [`Booking ${booking.id} cancelled`, `${booking.customerName} · ${booking.tourPackage}`],
};

/**
 * Status actions with the shared five-second Undo toast, used by the dashboard widget,
 * the Bookings table and the booking drawer so the pattern is identical everywhere.
 */
export function useBookingActions() {
  const status = useBookingStatus();
  const restore = useRestoreBooking();

  function offerUndo(booking, result) {
    restore.mutate(
      { id: booking.id, snapshot: result.snapshot, eventId: result.eventId },
      {
        onSuccess: () => toast(`Booking ${booking.id} restored`),
        onError: (error) => toast.error(error.message || "Undo failed"),
      },
    );
  }

  async function run(booking, action, reason) {
    try {
      const result = await status.mutateAsync({ id: booking.id, action, reason });
      const [title, description] = TOAST_COPY[action](booking);
      toast.success(title, { description, duration: 5000, action: { label: "Undo", onClick: () => offerUndo(booking, result) } });
      return true;
    } catch (error) {
      toast.error(error.message || "The booking could not be updated");
      return false;
    }
  }

  return {
    run,
    onDecide: (booking, decision) => run(booking, decision),
    offerUndo,
    deciding: status.isPending,
    decidingId: status.variables?.id,
  };
}

/* ----------------------------------------------------------- customer side */

/** The signed-in customer's bookings. Lives under ["bookings"], so admin changes refresh it too. */
export function useMyBookings(email) {
  return useQuery({ queryKey: [...BOOKINGS_KEY, "mine", email], queryFn: () => getMyBookings(email), enabled: Boolean(email) });
}

/** Checkout and My Bookings writes; each refreshes the admin views that read the same store. */
function useCustomerBookingMutation(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSettled: () => {
      refreshAfterChange(queryClient);
      // Departure seat counts on Tour Detail change with bookings.
      queryClient.invalidateQueries({ queryKey: ["storefront"] });
    },
  });
}

export const useCreateBooking = () => useCustomerBookingMutation(createBooking);
export const usePayBooking = () => useCustomerBookingMutation(payBooking);
export const useCancelMyBooking = () => useCustomerBookingMutation(cancelMyBooking);
