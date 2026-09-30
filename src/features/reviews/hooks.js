import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getReviews,
  getReviewStats,
  updateReviewStatus,
  restoreReviewStatus,
  deleteReview,
} from "./api";

export const REVIEWS_KEY = ["reviews"];
export const REVIEW_STATS_KEY = ["review-stats"];
export const SHELL_KEY = ["shell-summary"];

export function useReviews(filter = "All") {
  return useQuery({
    queryKey: [...REVIEWS_KEY, filter],
    queryFn: () => getReviews(filter),
  });
}

export function useReviewStats() {
  return useQuery({
    queryKey: REVIEW_STATS_KEY,
    queryFn: getReviewStats,
  });
}

/** Optimistically update the sidebar reviews badge count in ["shell-summary"] cache */
function patchShellReviewsBadge(queryClient, pendingDelta) {
  if (pendingDelta === 0) return;
  queryClient.setQueryData(SHELL_KEY, (summary) => {
    if (!summary) return summary;
    const currentReviews = summary.badges?.reviews ?? 0;
    return {
      ...summary,
      badges: {
        ...summary.badges,
        reviews: Math.max(0, currentReviews + pendingDelta),
      },
    };
  });
}

function refreshReviewsAfterChange(queryClient) {
  queryClient.invalidateQueries({ queryKey: REVIEWS_KEY });
  queryClient.invalidateQueries({ queryKey: REVIEW_STATS_KEY });
  queryClient.invalidateQueries({ queryKey: SHELL_KEY });
  // Tour ratings in Reports read the same reviews.
  queryClient.invalidateQueries({ queryKey: ["reports"] });
}

export function useUpdateReviewStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateReviewStatus,
    onMutate: async ({ id, status }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: REVIEWS_KEY }),
        queryClient.cancelQueries({ queryKey: REVIEW_STATS_KEY }),
        queryClient.cancelQueries({ queryKey: SHELL_KEY }),
      ]);

      const previousReviews = queryClient.getQueriesData({ queryKey: REVIEWS_KEY });
      const previousStats = queryClient.getQueryData(REVIEW_STATS_KEY);
      const previousShell = queryClient.getQueryData(SHELL_KEY);

      // Find current review status across queries to determine delta
      let previousStatus = "Pending";
      for (const [, list] of previousReviews) {
        if (Array.isArray(list)) {
          const found = list.find((item) => item.id === id);
          if (found) {
            previousStatus = found.status;
            break;
          }
        }
      }

      const pendingDelta =
        previousStatus === "Pending" && status !== "Pending"
          ? -1
          : previousStatus !== "Pending" && status === "Pending"
          ? 1
          : 0;

      // Optimistically patch list queries
      queryClient.setQueriesData({ queryKey: REVIEWS_KEY }, (current) => {
        if (!Array.isArray(current)) return current;
        return current.map((item) => (item.id === id ? { ...item, status } : item));
      });

      // Optimistically patch sidebar badge
      patchShellReviewsBadge(queryClient, pendingDelta);

      return { previousReviews, previousStats, previousShell, previousStatus };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousReviews) {
        context.previousReviews.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousStats) {
        queryClient.setQueryData(REVIEW_STATS_KEY, context.previousStats);
      }
      if (context?.previousShell) {
        queryClient.setQueryData(SHELL_KEY, context.previousShell);
      }
    },
    onSettled: () => refreshReviewsAfterChange(queryClient),
  });
}

export function useRestoreReviewStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreReviewStatus,
    onMutate: async ({ id, previousStatus }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: REVIEWS_KEY }),
        queryClient.cancelQueries({ queryKey: SHELL_KEY }),
      ]);

      const previousReviews = queryClient.getQueriesData({ queryKey: REVIEWS_KEY });
      const previousShell = queryClient.getQueryData(SHELL_KEY);

      // If restored status is Pending, badge increments
      const pendingDelta = previousStatus === "Pending" ? 1 : -1;

      queryClient.setQueriesData({ queryKey: REVIEWS_KEY }, (current) => {
        if (!Array.isArray(current)) return current;
        return current.map((item) => (item.id === id ? { ...item, status: previousStatus } : item));
      });

      patchShellReviewsBadge(queryClient, pendingDelta);

      return { previousReviews, previousShell };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousReviews) {
        context.previousReviews.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousShell) {
        queryClient.setQueryData(SHELL_KEY, context.previousShell);
      }
    },
    onSettled: () => refreshReviewsAfterChange(queryClient),
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReview,
    onMutate: async ({ id }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: REVIEWS_KEY }),
        queryClient.cancelQueries({ queryKey: REVIEW_STATS_KEY }),
        queryClient.cancelQueries({ queryKey: SHELL_KEY }),
      ]);

      const previousReviews = queryClient.getQueriesData({ queryKey: REVIEWS_KEY });
      const previousShell = queryClient.getQueryData(SHELL_KEY);
      const previousStats = queryClient.getQueryData(REVIEW_STATS_KEY);

      // Check if deleted review was Pending
      let wasPending = false;
      for (const [, list] of previousReviews) {
        if (Array.isArray(list)) {
          const found = list.find((item) => item.id === id);
          if (found && found.status === "Pending") {
            wasPending = true;
            break;
          }
        }
      }

      if (wasPending) {
        patchShellReviewsBadge(queryClient, -1);
      }

      queryClient.setQueriesData({ queryKey: REVIEWS_KEY }, (current) => {
        if (!Array.isArray(current)) return current;
        return current.filter((item) => item.id !== id);
      });

      return { previousReviews, previousShell, previousStats };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousReviews) {
        context.previousReviews.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousShell) {
        queryClient.setQueryData(SHELL_KEY, context.previousShell);
      }
      if (context?.previousStats) {
        queryClient.setQueryData(REVIEW_STATS_KEY, context.previousStats);
      }
      toast.error("Failed to delete review");
    },
    onSuccess: () => {
      toast.success("Review deleted permanently");
    },
    onSettled: () => refreshReviewsAfterChange(queryClient),
  });
}

/**
 * Shared action handlers matching the booking confirm/reject pattern
 * with a 5-second Undo action toast.
 */
export function useReviewActions() {
  const updateStatus = useUpdateReviewStatus();
  const restoreStatus = useRestoreReviewStatus();

  async function onApprove(review) {
    const previousStatus = review.status;
    try {
      await updateStatus.mutateAsync({ id: review.id, status: "Approved" });
      toast.success(`Review by ${review.customerName} approved`, {
        description: `${review.tourName} · ${review.rating}★ rating`,
        duration: 5000,
        action: {
          label: "Undo",
          onClick: () =>
            restoreStatus.mutate(
              { id: review.id, previousStatus },
              {
                onSuccess: () => toast(`Review by ${review.customerName} is ${previousStatus.toLowerCase()} again`),
                onError: (error) => toast.error(error.message || "Undo failed"),
              },
            ),
        },
      });
    } catch (error) {
      toast.error(error.message || "Failed to approve review");
    }
  }

  async function onHide(review) {
    const previousStatus = review.status;
    try {
      await updateStatus.mutateAsync({ id: review.id, status: "Hidden" });
      toast.success(`Review by ${review.customerName} hidden`, {
        description: "Hidden from customer tour pages.",
        duration: 5000,
        action: {
          label: "Undo",
          onClick: () =>
            restoreStatus.mutate(
              { id: review.id, previousStatus },
              {
                onSuccess: () => toast(`Review by ${review.customerName} is ${previousStatus.toLowerCase()} again`),
                onError: (error) => toast.error(error.message || "Undo failed"),
              },
            ),
        },
      });
    } catch (error) {
      toast.error(error.message || "Failed to hide review");
    }
  }

  return {
    onApprove,
    onHide,
    isUpdating: updateStatus.isPending,
    updatingId: updateStatus.variables?.id,
  };
}
