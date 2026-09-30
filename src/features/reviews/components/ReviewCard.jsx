import { motion } from "framer-motion";
import { Star, MapPin, Check, EyeOff, Trash2, Clock } from "lucide-react";
import { StatusBadge } from "../../../components/shared/StatusBadge";
import { Button } from "../../../components/ui/Button";
import { formatDate, formatRelativeTime } from "../../../lib/format";
import { cn } from "../../../lib/cn";

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((index) => (
        <Star
          key={index}
          className={cn(
            "size-4",
            index <= rating ? "fill-accent text-accent" : "fill-transparent text-border"
          )}
        />
      ))}
      <span className="ml-1 text-xs font-semibold tabular-nums text-foreground">
        {rating}.0
      </span>
    </div>
  );
}

export function ReviewCard({
  review,
  onApprove,
  onHide,
  onDeleteRequest,
  isUpdating,
  updatingId,
}) {
  const isThisReviewUpdating = isUpdating && updatingId === review.id;
  const isPending = review.status === "Pending";
  const isApproved = review.status === "Approved";
  const isHidden = review.status === "Hidden";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.18 } }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-sm transition-all duration-200",
        "hover:border-border-strong hover:shadow-card",
        isPending && "ring-1 ring-accent/20 bg-surface/95"
      )}
    >
      <div>
        {/* Top bar: Reviewer, Tour, StatusBadge */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3 min-w-0">
            {/* Avatar circle with initials */}
            <div
              className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/12 font-display text-sm font-bold text-primary-ink ring-1 ring-primary/20"
              aria-hidden="true"
            >
              {review.initials || review.customerName.slice(0, 2).toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="truncate font-display text-base font-semibold text-foreground">
                {review.customerName}
              </h4>
              <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-muted">
                <span className="inline-flex items-center gap-1 font-medium text-primary-ink">
                  <MapPin className="size-3.5 shrink-0" />
                  <span className="truncate max-w-[200px] sm:max-w-[280px]">{review.tourName}</span>
                </span>
                <span className="text-border" aria-hidden="true">•</span>
                <span
                  className="inline-flex items-center gap-1 tabular-nums text-muted"
                  title={formatDate(review.dateKey)}
                >
                  <Clock className="size-3 shrink-0" />
                  {formatRelativeTime(review.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start shrink-0">
            <StatusBadge status={review.status} />
          </div>
        </div>

        {/* Rating Stars */}
        <div className="mt-3.5 flex items-center gap-2">
          <StarRating rating={review.rating} />
        </div>

        {/* Comment Text */}
        <div className="mt-3 rounded-xl border border-border/60 bg-surface-2/40 p-3.5 sm:p-4 text-sm leading-relaxed text-foreground/90">
          <p className="whitespace-pre-line text-pretty">
            "{review.comment}"
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
        <span className="text-xs text-muted tabular-nums">
          Ref: <code className="font-mono text-[11px] text-foreground/70">{review.id}</code>
        </span>

        <div className="flex items-center gap-2">
          {/* Quick Approve button */}
          {(isPending || isHidden) && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isThisReviewUpdating}
              loading={isThisReviewUpdating}
              onClick={() => onApprove(review)}
              className="border-success/30 bg-success/10 text-success-ink hover:bg-success/20 hover:border-success/40"
              title="Approve review and publish on tour page"
            >
              <Check className="size-3.5 mr-1" />
              Approve
            </Button>
          )}

          {/* Quick Hide button */}
          {(isPending || isApproved) && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isThisReviewUpdating}
              loading={isThisReviewUpdating}
              onClick={() => onHide(review)}
              className="border-border hover:bg-surface-2 text-muted hover:text-foreground"
              title="Hide review from customer view"
            >
              <EyeOff className="size-3.5 mr-1" />
              Hide
            </Button>
          )}

          {/* Permanent Delete button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isThisReviewUpdating}
            onClick={() => onDeleteRequest(review)}
            className="text-danger-ink hover:bg-danger/10 hover:text-danger focus-visible:ring-danger/40"
            title="Permanently delete review"
          >
            <Trash2 className="size-3.5" />
            <span className="sr-only sm:not-sr-only sm:ml-1">Delete</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
