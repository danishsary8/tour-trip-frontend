import {
  BarChart3,
  CalendarCheck,
  CalendarClock,
  Flag,
  LayoutDashboard,
  Map,
  MapPin,
  Settings,
  Star,
  Tags,
  Users,
} from "lucide-react";

/**
 * Admin navigation. `badge` keys map to counts from `useShellSummary()`;
 * `end` limits active matching to the exact path.
 */
export const NAV_GROUPS = [
  {
    id: "overview",
    label: "Overview",
    items: [{ id: "dashboard", label: "Dashboard", path: "/admin", icon: LayoutDashboard, end: true }],
  },
  {
    id: "masters",
    label: "Manage Masters",
    crumb: "Masters",
    collapsible: true,
    items: [
      { id: "categories", label: "Categories", path: "/admin/masters/categories", icon: Tags, aliases: ["/admin/categories"] },
      {
        id: "destinations",
        label: "Destinations",
        path: "/admin/masters/destinations",
        icon: MapPin,
        aliases: ["/admin/destinations"],
      },
      { id: "guides", label: "Guides", path: "/admin/masters/guides", icon: Flag, aliases: ["/admin/guides"] },
      { id: "tours", label: "Tours", path: "/admin/masters/tours", icon: Map, aliases: ["/admin/masters"] },
      {
        id: "schedules",
        label: "Tour Schedules",
        path: "/admin/masters/schedules",
        icon: CalendarClock,
        aliases: ["/admin/tour-schedules"],
      },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    items: [
      { id: "bookings", label: "Bookings", path: "/admin/bookings", icon: CalendarCheck, badge: "bookings" },
      { id: "customers", label: "Customers", path: "/admin/customers", icon: Users },
    ],
  },
  {
    id: "insights",
    label: "Insights",
    items: [
      { id: "reports", label: "Reports", path: "/admin/reports", icon: BarChart3 },
      { id: "reviews", label: "Reviews", path: "/admin/reviews", icon: Star, badge: "reviews" },
    ],
  },
  {
    id: "system",
    label: "System",
    items: [{ id: "settings", label: "Settings", path: "/admin/settings", icon: Settings }],
  },
];

export const NAV_ITEMS = NAV_GROUPS.flatMap((group) => group.items);

function matchLength(item, pathname) {
  let best = 0;
  for (const path of [item.path, ...(item.aliases ?? [])]) {
    const exact = pathname === path || pathname === `${path}/`;
    const nested = !item.end && pathname.startsWith(`${path}/`);
    if ((exact || nested) && path.length > best) best = path.length;
  }
  return best;
}

/**
 * The nav item whose path (or legacy alias) matches the URL most specifically,
 * so `/admin/masters/guides` lights up Guides rather than Tours.
 */
export function findActiveNavItem(pathname) {
  let best = null;
  let bestLength = 0;
  for (const item of NAV_ITEMS) {
    const length = matchLength(item, pathname);
    if (length > bestLength) {
      best = item;
      bestLength = length;
    }
  }
  if (!best) return null;
  const matched = [best.path, ...(best.aliases ?? [])]
    .filter((path) => pathname === path || pathname.startsWith(`${path}/`))
    .sort((a, b) => b.length - a.length)[0];
  return { item: best, group: NAV_GROUPS.find((group) => group.items.includes(best)), matchedPath: matched };
}

export function findActiveNavPath(pathname) {
  return findActiveNavItem(pathname)?.item.path ?? null;
}

/** Human labels for URL segments used by the breadcrumbs. */
export const SEGMENT_LABELS = {
  admin: "Admin",
  masters: "Masters",
  tours: "Tours",
  bookings: "Bookings",
  customers: "Customers",
  categories: "Categories",
  destinations: "Destinations",
  guides: "Guides",
  schedules: "Schedules",
  "tour-schedules": "Tour Schedules",
  reviews: "Reviews",
  reports: "Reports",
  settings: "Settings",
  profile: "Profile",
  create: "Create",
  edit: "Edit",
  delete: "Delete",
  legacy: "Legacy",
  dashboard: "Dashboard",
  _kit: "Component kit",
};

export function labelForSegment(segment) {
  if (SEGMENT_LABELS[segment]) return SEGMENT_LABELS[segment];
  // Record identifiers (numbers, uuids, slugs with digits) read as a detail view.
  if (/\d/.test(segment)) return "Details";
  return segment.replace(/[-_]/g, " ").replace(/^\w/, (char) => char.toUpperCase());
}
