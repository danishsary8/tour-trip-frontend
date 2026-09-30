import {
  LayoutDashboard,
  LayoutGrid,
  CalendarCheck,
  BarChart3,
  Star,
  Settings,
  LogOut,
  CalendarDays,
  Users
} from "lucide-react";

/**
 * @typedef {Object} NavLinkItem
 * @property {string} label - Visible text
 * @property {string} path  - Route path used for navigation + active matching
 * @property {import("lucide-react").LucideIcon} icon
 */

/** @type {NavLinkItem[]} */
export const sidebarLinks = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  {
    label: "Manage Masters",
    path: "/admin/masters",
    icon: LayoutGrid,
  },
  {
    label: "Manage Bookings",
    path: "/admin/bookings",
    icon: CalendarCheck,
  },
  { label: "Manage Categories", path: "/admin/categories", icon: LayoutGrid },
  { label: "Tour Schedules", path: "/admin/tour-schedules", icon: CalendarDays },
  // { label: "Manage Masters", path: "/admin/masters", icon: LayoutGrid },
  // { label: "Manage Bookings", path: "/admin/manageBooking", icon: CalendarCheck },
  // { label :"Manage Categories",path: "/admin/categories",icon: LayoutGrid,},
  { label: "Manage Customers", path: "/admin/customers", icon: Users },
  { label: "Reports", path: "/admin/reports", icon: BarChart3 },
  { label: "Reviews", path: "/admin/reviews", icon: Star },
];

/** @type {NavLinkItem[]} */
export const sidebarFooterLinks = [
  { label: "System Settings", path: "/admin/stepPersonal", icon: Settings },
  { label: "Logout", path: "/logout", icon: LogOut },
];
