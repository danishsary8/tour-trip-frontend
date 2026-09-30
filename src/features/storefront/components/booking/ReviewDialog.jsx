import { useId, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AlertCircle, Star } from "lucide-react";
import { ConfirmDialog } from "../../../../components/shared/ConfirmDialog";
import { cn } from "../../../../lib/cn";
import { useSubmitReview } from "../../../reviews/hooks";
import { formatTripDate } from "../../booking";
import { reviewSchema } from "../../schema";
import { Field, TextArea } from "../FormField";

const RATING_WORDS = ["", "Poor", "Fair", "Good", "Very good", "Unforgettable"];
const COMMENT_MAX = 1000;

/** Five native radios drawn as stars: arrow keys change the rating, hover previews it. */
function StarRating({ id, value, onChange, error }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <fieldset aria-describedby={error ? `${id}-error` : undefined}>
      <legend className="text-xs font-semibold uppercase tracking-wider text-muted">Your rating</legend>
      <div className="mt-2 flex items-center gap-3">
        <div className="flex" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((star) => (
            <label key={star} className="cursor-pointer rounded-md p-1 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary" onMouseEnter={() => setHover(star)}>
              <input type="radio" name={`${id}-rating`} value={star} checked={value === star} onChange={() => onChange(star)} className="sr-only" aria-label={`${star} star${star === 1 ? "" : "s"}: ${RATING_WORDS[star]}`} />
              <Star className={cn("size-8 transition-[color,transform] duration-150 hover:scale-110", star <= shown ? "fill-accent text-accent" : "text-muted/40")} aria-hidden="true" />
            </label>
          ))}
        </div>
        <span className="text-sm font-semibold text-foreground" aria-live="polite">{RATING_WORDS[shown]}</span>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 flex items-center gap-1 text-xs text-danger-ink">
          <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </fieldset>
  );
}

/**
 * Review for a Completed booking (My Bookings and Tour Detail). It goes into the shared reviews
 * store as Pending and appears on the site once an admin approves it. Mount with `key={booking.id}`.
 */
export function ReviewDialog({ booking, open, onClose }) {
  const id = useId();
  const submitReview = useSubmitReview();
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, comment: "" },
  });
  const comment = useWatch({ control, name: "comment" });

  const submit = handleSubmit(async (values) => {
    try {
      await submitReview.mutateAsync({
        bookingId: booking.id,
        customerName: booking.contactName ?? booking.customerName,
        tourName: booking.tourPackage,
        rating: values.rating,
        comment: values.comment,
      });
      toast.success("Thanks! Your review is awaiting approval.", { description: "We'll publish it on the tour page once our team has checked it." });
      onClose();
    } catch (error) {
      toast.error("Your review wasn't sent", { description: error.message });
    }
  });

  if (!booking) return null;

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={submit}
      loading={submitReview.isPending}
      tone="primary"
      icon={Star}
      title={`Review ${booking.tourPackage}`}
      description={`Your trip on ${formatTripDate(booking.travelDate)}. Reviews appear on the site after a quick check by our team.`}
      confirmLabel="Submit review"
      cancelLabel="Not now"
    >
      <div className="space-y-4">
        <Controller control={control} name="rating" render={({ field }) => <StarRating id={`${id}-stars`} value={field.value} onChange={field.onChange} error={errors.rating?.message} />} />
        <Field
          id={`${id}-comment`}
          label="Your story"
          error={errors.comment?.message}
          hint={<span className="text-xs tabular-nums text-muted">{comment?.length ?? 0}/{COMMENT_MAX}</span>}
        >
          <TextArea id={`${id}-comment`} rows={5} maxLength={COMMENT_MAX} error={errors.comment?.message} placeholder="What did you love? What should the next traveller know?" {...register("comment")} />
        </Field>
      </div>
    </ConfirmDialog>
  );
}
