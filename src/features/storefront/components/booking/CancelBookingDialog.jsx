import { useId } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Info, XCircle } from "lucide-react";
import { ConfirmDialog } from "../../../../components/shared/ConfirmDialog";
import { useCancelMyBooking } from "../../../bookings/hooks";
import { formatTripDate, refundMessage } from "../../booking";
import { CANCEL_REASONS, cancelBookingSchema } from "../../schema";
import { Field, SelectInput, TextArea } from "../FormField";

/**
 * Cancel a Pending or Confirmed booking with a reason. Paid bookings are refunded (the dialog
 * says how much and where); unpaid ones are simply cancelled. Mount with `key={booking.id}`.
 */
export function CancelBookingDialog({ booking, email, open, onClose }) {
  const id = useId();
  const cancel = useCancelMyBooking();
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(cancelBookingSchema),
    defaultValues: { reason: "", details: "" },
  });
  const reason = useWatch({ control, name: "reason" });
  const paid = booking?.paymentStatus === "Paid";

  const submit = handleSubmit(async (values) => {
    const note = values.details ? `${values.reason}: ${values.details}` : values.reason;
    try {
      const { refunded } = await cancel.mutateAsync({ id: booking.id, email, reason: note });
      toast.success(`Booking ${booking.id} cancelled`, {
        description: refunded ? refundMessage(booking) : "Nothing was charged, so there's nothing to refund.",
        duration: 7000,
      });
      onClose();
    } catch (error) {
      toast.error("We couldn't cancel this booking", { description: error.message });
    }
  });

  if (!booking) return null;

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={submit}
      loading={cancel.isPending}
      icon={XCircle}
      title={`Cancel booking ${booking.id}?`}
      description={`${booking.tourPackage} on ${formatTripDate(booking.travelDate)}. This can't be undone, but you're welcome to book again.`}
      confirmLabel="Cancel booking"
      cancelLabel="Keep booking"
    >
      <div className="space-y-4">
        <Field id={`${id}-reason`} label="Reason" error={errors.reason?.message}>
          <SelectInput id={`${id}-reason`} error={errors.reason?.message} {...register("reason")}>
            <option value="" disabled>Choose a reason</option>
            {CANCEL_REASONS.map((item) => <option key={item}>{item}</option>)}
          </SelectInput>
        </Field>
        <Field id={`${id}-details`} label="Anything else?" optional={reason !== "Other"} error={errors.details?.message}>
          <TextArea id={`${id}-details`} rows={3} maxLength={300} error={errors.details?.message} placeholder={reason === "Other" ? "Tell us what happened" : "Optional note for our team"} {...register("details")} />
        </Field>
        <p className={`flex items-start gap-2 rounded-card p-3 text-sm ${paid ? "bg-info/[0.08] text-info-ink" : "bg-surface-2 text-muted"}`}>
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {paid ? refundMessage(booking) : "Nothing has been charged for this booking, so there's no refund to process."}
        </p>
      </div>
    </ConfirmDialog>
  );
}
