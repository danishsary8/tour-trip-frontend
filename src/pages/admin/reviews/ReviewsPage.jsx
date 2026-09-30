import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  MessageSquareCheck,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  X,
} from "lucide-react";
import { PageHeader } from "../../../components/shared/PageHeader";
import { Skeleton } from "../../../components/shared/Skeleton";
import { EmptyState } from "../../../components/shared/EmptyState";
import { ConfirmDialog } from "../../../components/shared/ConfirmDialog";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import {
  useReviews,
  useReviewStats,
  useReviewActions,
  useDeleteReview,
} from "../../../features/reviews/hooks";
import { ReviewStatsHeader } from "../../../features/reviews/components/ReviewStatsHeader";
import { ReviewCard } from "../../../features/reviews/components/ReviewCard";
import { stagger } from "../../../lib/motion";
import { cn } from "../../../lib/cn";

const TABS = [
  { id: "Pending", label: "Pending Moderation" },
  { id: "All", label: "All Reviews" },
  { id: "Approved", label: "Approved" },
  { id: "Hidden", label: "Hidden" },
];

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState("Pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [starFilter, setStarFilter] = useState("all");
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const {
    data: reviews = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useReviews(activeTab);

  const {
    data: stats,
    isLoading: isStatsLoading,
  } = useReviewStats();

  const { onApprove, onHide, isUpdating, updatingId } = useReviewActions();
  const deleteMutation = useDeleteReview();

  // Client-side filtering for search & star filter
  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      // Star filter
      if (starFilter !== "all" && review.rating !== Number(starFilter)) {
        return false;
      }
      // Search query
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        review.customerName.toLowerCase().includes(query) ||
        review.tourName.toLowerCase().includes(query) ||
        review.comment.toLowerCase().includes(query) ||
        review.id.toLowerCase().includes(query)
      );
    });
  }, [reviews, searchQuery, starFilter]);

  async function handleConfirmDelete() {
    if (!reviewToDelete) return;
    try {
      await deleteMutation.mutateAsync({ id: reviewToDelete.id });
      setReviewToDelete(null);
    } catch {
      // toast already handled by hook
    }
  }

  const tabCounts = {
    Pending: stats?.pendingCount,
    All: stats?.totalCount,
    Approved: stats?.approvedCount,
    Hidden: stats?.hiddenCount,
  };

  return (
    <div className="mx-auto min-w-0 max-w-[1600px] space-y-6 pb-12">
      <PageHeader
        eyebrow="Operations / Feedback Moderation"
        title="Reviews Management"
        description="Moderate customer ratings, approve authentic tour feedback, and maintain quality standards across Cambodia experiences."
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="border-border bg-surface text-foreground hover:bg-surface-2"
          >
            <RefreshCw className={cn("size-3.5 mr-1.5", isLoading && "animate-spin")} />
            Refresh
          </Button>
        }
      />

      {/* Stats and Distribution Chart Header */}
      <ReviewStatsHeader stats={stats} isLoading={isStatsLoading} />

      {/* Moderation Controls: Tabs, Search, and Rating Filter */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 sm:p-5 shadow-sm">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <nav className="flex flex-wrap gap-1.5 sm:gap-2" aria-label="Review status filters">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const count = tabCounts[tab.id];

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted hover:bg-surface-2 hover:text-foreground"
                  )}
                >
                  <span>{tab.label}</span>
                  {count !== undefined && (
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums",
                        isActive
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-surface-2 text-muted"
                      )}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Search and Star Filter Bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <Input
              type="text"
              placeholder="Search traveler, tour, or comment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-8 py-1.5 text-xs sm:text-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Filter className="size-3.5 text-muted shrink-0" />
            <span className="text-xs text-muted font-medium">Rating:</span>
            <div className="flex items-center gap-1">
              {[
                { label: "All", value: "all" },
                { label: "5★", value: "5" },
                { label: "4★", value: "4" },
                { label: "3★", value: "3" },
                { label: "2★", value: "2" },
                { label: "1★", value: "1" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStarFilter(opt.value)}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                    starFilter === opt.value
                      ? "bg-accent/15 text-accent-ink ring-1 ring-accent/30 font-semibold"
                      : "text-muted hover:bg-surface-2 hover:text-foreground"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Moderation Queue Content */}
      <div>
        {/* Loading Skeleton */}
        {isLoading && (
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-surface p-6 space-y-4"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-44" />
                  </div>
                </div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-16 w-full rounded-xl" />
                <div className="flex justify-end gap-2 pt-2">
                  <Skeleton className="h-8 w-20 rounded-lg" />
                  <Skeleton className="h-8 w-16 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && isError && (
          <EmptyState
            icon={AlertCircle}
            title="Failed to load reviews"
            description={error?.message || "An unexpected error occurred while fetching reviews."}
            action={
              <Button type="button" variant="primary" onClick={() => refetch()}>
                Retry
              </Button>
            }
          />
        )}

        {/* Empty State */}
        {!isLoading && !isError && filteredReviews.length === 0 && (
          <EmptyState
            icon={searchQuery || starFilter !== "all" ? Search : MessageSquareCheck}
            title={
              searchQuery || starFilter !== "all"
                ? "No matching reviews found"
                : activeTab === "Pending"
                ? "No pending reviews"
                : `No ${activeTab.toLowerCase()} reviews`
            }
            description={
              searchQuery || starFilter !== "all"
                ? "No reviews match your current search terms or star rating filter. Try clearing filters."
                : activeTab === "Pending"
                ? "All caught up! Every customer tour review has been moderated."
                : `There are currently no reviews with ${activeTab.toLowerCase()} status.`
            }
            action={
              searchQuery || starFilter !== "all" ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setStarFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              ) : activeTab !== "All" ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("All")}
                >
                  View All Reviews
                </Button>
              ) : null
            }
          />
        )}

        {/* Review Cards Grid with Staggered Framer Motion */}
        {!isLoading && !isError && filteredReviews.length > 0 && (
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid gap-4 sm:gap-6 md:grid-cols-2"
          >
            <AnimatePresence mode="popLayout">
              {filteredReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onApprove={onApprove}
                  onHide={onHide}
                  onDeleteRequest={(targetReview) => setReviewToDelete(targetReview)}
                  isUpdating={isUpdating}
                  updatingId={updatingId}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Permanent Deletion Confirmation Modal */}
      <ConfirmDialog
        open={Boolean(reviewToDelete)}
        onClose={() => setReviewToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Permanently delete review?"
        description={
          reviewToDelete
            ? `Are you sure you want to permanently delete the review by ${reviewToDelete.customerName} for "${reviewToDelete.tourName}"? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete Permanently"
        cancelLabel="Keep Review"
        tone="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
