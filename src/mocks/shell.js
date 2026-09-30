/** Mock fixtures for the admin shell (sidebar, topbar, notifications). */

const minutesAgo = (minutes) => new Date(Date.now() - minutes * 60_000).toISOString();

export const MOCK_ADMIN_PROFILE = {
  name: "Admin",
  role: "Super Administrator",
  email: "admin@tourtrip.com",
};

/** `type` drives the icon and accent colour in the notifications menu. */
export const MOCK_NOTIFICATIONS = [
  {
    id: "ntf-1",
    type: "booking",
    title: "New booking received",
    body: "Sophea Chan booked Angkor Sunrise Explorer for 4 guests.",
    createdAt: minutesAgo(4),
    read: false,
  },
  {
    id: "ntf-2",
    type: "payment",
    title: "Payment received",
    body: "$1,280.00 settled for booking TT-20931.",
    createdAt: minutesAgo(38),
    read: false,
  },
  {
    id: "ntf-3",
    type: "review",
    title: "New review awaiting moderation",
    body: "5★ on Mekong Sunset Cruise: “An unforgettable evening on the river.”",
    createdAt: minutesAgo(125),
    read: false,
  },
  {
    id: "ntf-4",
    type: "capacity",
    title: "Tour is fully booked",
    body: "Koh Rong Island Escape on 14 Oct has reached 20/20 seats.",
    createdAt: minutesAgo(60 * 6),
    read: true,
  },
  {
    id: "ntf-5",
    type: "cancellation",
    title: "Booking cancelled",
    body: "Daniel Lee cancelled Kampot Pepper Trail (TT-20874).",
    createdAt: minutesAgo(60 * 26),
    read: true,
  },
];
