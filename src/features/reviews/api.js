import apiClient from "../../lib/axios";
import {
  getReviewsDb,
  updateReviewStatusInDb,
  deleteReviewFromDb,
  restoreReviewInDb,
  getPendingReviewsCount,
} from "../../mocks/reviews";

const useMock = import.meta.env.VITE_USE_MOCK !== "false";
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export { getPendingReviewsCount };

export async function getReviews(filter = "All") {
  if (!useMock) {
    const params = filter && filter !== "All" ? { status: filter } : {};
    return apiClient.get("/admin/reviews", { params }).then(({ data }) => data);
  }

  await wait(500);
  const allReviews = getReviewsDb();
  if (!filter || filter === "All") {
    return allReviews;
  }
  return allReviews.filter((review) => review.status.toLowerCase() === filter.toLowerCase());
}

export async function getReviewStats() {
  if (!useMock) {
    return apiClient.get("/admin/reviews/stats").then(({ data }) => data);
  }

  await wait(300);
  const reviews = getReviewsDb();
  const total = reviews.length;
  const pending = reviews.filter((r) => r.status === "Pending").length;
  const approved = reviews.filter((r) => r.status === "Approved").length;
  const hidden = reviews.filter((r) => r.status === "Hidden").length;

  const sumRatings = reviews.reduce((sum, r) => sum + r.rating, 0);
  const average = total > 0 ? (sumRatings / total).toFixed(1) : "0.0";

  // Distribution for ratings 5 down to 1
  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    return { stars, count, percentage };
  });

  return {
    totalCount: total,
    pendingCount: pending,
    approvedCount: approved,
    hiddenCount: hidden,
    averageRating: parseFloat(average),
    distribution,
  };
}

export async function updateReviewStatus({ id, status }) {
  if (!useMock) {
    return apiClient.patch(`/admin/reviews/${id}/status`, { status }).then(({ data }) => data);
  }

  await wait(450);
  const result = updateReviewStatusInDb(id, status);
  return result;
}

export async function restoreReviewStatus({ id, previousStatus }) {
  if (!useMock) {
    return apiClient.patch(`/admin/reviews/${id}/status`, { status: previousStatus }).then(({ data }) => data);
  }

  await wait(300);
  return restoreReviewInDb(id, previousStatus);
}

export async function deleteReview({ id }) {
  if (!useMock) {
    return apiClient.delete(`/admin/reviews/${id}`).then(({ data }) => data);
  }

  await wait(450);
  return deleteReviewFromDb(id);
}
