import { Building2, HelpCircle, Images, MessageSquareQuote, Send } from "lucide-react";

const startsWith = (path) => (location) => location.pathname.startsWith(path);

/** Public site navigation. Core links for the uncluttered desktop header. */
export const STOREFRONT_NAV = [
  { label: "Home", to: "/", match: (location) => location.pathname === "/" && !location.hash },
  { label: "Tours", to: "/tours", match: startsWith("/tours") },
  { label: "Destinations", to: "/destinations", match: startsWith("/destinations") },
];

/** Secondary pages, grouped under the header's "More" menu and in the mobile menu. */
export const STOREFRONT_MORE_NAV = [
  {
    title: "Explore",
    items: [
      { label: "Gallery", to: "/gallery", description: "Cambodia through our guests' lenses", icon: Images, match: startsWith("/gallery") },
      { label: "Reviews", to: "/reviews", description: "What travellers say after the trip", icon: MessageSquareQuote, match: startsWith("/reviews") },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About us", to: "/about", description: "Our story and the guides you'll meet", icon: Building2, match: startsWith("/about") },
      { label: "Contact", to: "/contact", description: "Phone, WhatsApp, email or drop by", icon: Send, match: startsWith("/contact") },
      { label: "FAQ", to: "/faq", description: "Booking, payment and cancellation help", icon: HelpCircle, match: startsWith("/faq") },
    ],
  },
];

export const STOREFRONT_SECONDARY_NAV = STOREFRONT_MORE_NAV.flatMap((group) => group.items);

export const ALL_STOREFRONT_NAV = [...STOREFRONT_NAV, ...STOREFRONT_SECONDARY_NAV];

export const ACCOUNT_LINKS = {
  signIn: "/login",
  register: "/register",
  bookings: "/account/bookings",
  wishlist: "/wishlist",
};
