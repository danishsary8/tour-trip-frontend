import apiClient from "../../lib/axios";
import { dashboardDb } from "../../mocks/dashboard";
import { MOCK_ADMIN_PROFILE, MOCK_NOTIFICATIONS } from "../../mocks/shell";
import { getPendingReviewsCount } from "../reviews/api";

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const useMock = import.meta.env.VITE_USE_MOCK !== "false";

// In-memory copy so mock mutations survive refetches within a session.
let notifications = MOCK_NOTIFICATIONS.map((item) => ({ ...item }));

export async function getNotifications() {
  if (!useMock) return apiClient.get("/admin/notifications").then(({ data }) => data);

  await wait(350);
  return notifications.map((item) => ({ ...item }));
}

export async function markAllNotificationsRead() {
  if (!useMock) return apiClient.post("/admin/notifications/read-all").then(({ data }) => data);

  await wait(250);
  notifications = notifications.map((item) => ({ ...item, read: true }));
  return notifications.map((item) => ({ ...item }));
}

export async function clearNotifications() {
  if (!useMock) return apiClient.delete("/admin/notifications").then(({ data }) => data);

  await wait(250);
  notifications = [];
  return [];
}


/** Sidebar badge counts (derived from shared mock stores) and the signed-in admin's profile. */
export async function getShellSummary() {
  if (!useMock) return apiClient.get("/admin/shell").then(({ data }) => data);

  await wait(300);
  const pendingBookings = dashboardDb.bookings.filter((booking) => booking.status === "Pending").length;
  return { badges: { bookings: pendingBookings, reviews: getPendingReviewsCount() }, profile: { ...MOCK_ADMIN_PROFILE } };
}
