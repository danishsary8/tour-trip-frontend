/**
 * Static storefront copy: company story, contact details, trust points and FAQ. This is site
 * content rather than mock data, so it stays when the Laravel API arrives. Values the admin
 * can change (contact email/phone, cancellation window, payment methods) are read from the
 * shared settings and domain constants instead of being typed twice.
 */
import { PAYMENT_METHODS } from "../../mocks/dashboard";
import { MOCK_SETTINGS } from "../../mocks/settings";
import { FacebookIcon, InstagramIcon, TiktokIcon, YoutubeIcon } from "./components/SocialIcons";

export const FOUNDED_YEAR = 2016;

/** Customer-facing names for the four domain payment methods ("(Simulation)" is a demo marker). */
export const PAYMENT_METHOD_NAMES = PAYMENT_METHODS.map((method) => method.replace(/\s*\(Simulation\)$/, ""));

const cancellationDays = MOCK_SETTINGS.other.cancellationWindowDays;
export const CANCELLATION_WINDOW = `${cancellationDays * 24} hours`;

export const CONTACT = {
  email: MOCK_SETTINGS.general.contactEmail,
  phone: MOCK_SETTINGS.general.contactPhone,
  phoneHref: `tel:${MOCK_SETTINGS.general.contactPhone.replace(/\s/g, "")}`,
  whatsapp: "+855 12 900 123",
  whatsappHref: "https://wa.me/85512900123",
  addressLines: ["No. 38, Street 240", "Chey Chumneas, Daun Penh", "Phnom Penh 12206, Cambodia"],
  landmark: "Two minutes' walk from the Royal Palace, opposite the Street 240 bookshop.",
  hours: [
    { days: "Monday – Saturday", time: "8:00 am – 8:00 pm" },
    { days: "Sunday & public holidays", time: "9:00 am – 5:00 pm" },
  ],
  hoursNote: "Phone and WhatsApp are answered around the clock for travellers already on tour.",
};

/** Social profiles. Placeholders (no href) until TourTrip's real accounts exist. */
export const SOCIAL_LINKS = [
  { label: "Facebook", handle: "TourTrip Cambodia", Icon: FacebookIcon },
  { label: "Instagram", handle: "@tourtrip.kh", Icon: InstagramIcon },
  { label: "YouTube", handle: "TourTrip Cambodia", Icon: YoutubeIcon },
  { label: "TikTok", handle: "@tourtrip.kh", Icon: TiktokIcon },
];

/** Home "Why book with us" points. `icon` names map to lucide icons in the section component. */
export const WHY_BOOK = [
  {
    icon: "ShieldCheck",
    title: "Secure, flexible payment",
    body: `ABA Pay, card or bank transfer online — or cash to your guide on the day. No hidden fees, prices in USD.`,
  },
  {
    icon: "Compass",
    title: "Local expert guides",
    body: "Licensed Cambodian guides who know the back gate at Ta Prohm and the best num banh chok in town.",
  },
  {
    icon: "CalendarCheck",
    title: "Free cancellation",
    body: `Plans change. Cancel up to ${CANCELLATION_WINDOW} before your tour starts and get a full refund.`,
  },
  {
    icon: "Headset",
    title: "24/7 support",
    body: "A real person on WhatsApp or phone, 24/7, in English and Khmer — before and during your trip.",
  },
];

export const PROMO = {
  code: "EXPLORE10",
  title: "Book 5+ days ahead and save 10%",
  body: "Plan early, travel for less. Use the code at checkout on any tour — sunrise temples included.",
  deadline: "Offer ends 31 December",
};

export const ABOUT_STORY = [
  `TourTrip began in ${FOUNDED_YEAR} as three friends and one rented minivan. Sokha had spent years guiding at Angkor, Dara knew every market stall along the Phnom Penh riverside, and Vanna had grown up on the boats of the Tonlé Sap. Visitors kept asking them the same thing: how do we see the real Cambodia, not just the postcard?`,
  "So we built the trips we would take our own families on. Small groups, so you can hear your guide. Early starts where they matter, long lunches where they don't. Honest prices in US dollars, paid the way that suits you. And routes that send money into the villages, homestays and family kitchens we visit, not around them.",
  "Today we're a small team based on Street 240 in Phnom Penh, with guides in Siem Reap, Kampot, Kep and on the coast. We still answer the phone ourselves, and we still think the best part of any tour is the moment a guest stops taking photos and just looks.",
];

export const ABOUT_VALUES = [
  { title: "Small groups, always", body: "Groups are capped at 12–24 guests depending on the tour, so there's always time for questions." },
  { title: "Local first", body: "Guides, drivers, cooks and homestays are Cambodian and fairly paid." },
  { title: "Honest pricing", body: "One price per person in USD. What's included is written on every tour." },
];

/** Roles and bios for the Guides from Masters, keyed by guide id. Unknown guides get a generic line. */
export const TEAM_COPY = {
  "g-sokha": { role: "Co-founder · Lead temple guide", bio: "Has watched more than 2,000 sunrises at Angkor and still points out a new carving every time." },
  "g-dara": { role: "Co-founder · City & food guide", bio: "Grew up above a noodle shop near Psar Thmei. Knows which stalls are worth the queue." },
  "g-vanna": { role: "Co-founder · Lakes & islands", bio: "A Tonlé Sap native who now splits her weeks between the floating villages and Koh Rong." },
  "g-sreyleak": { role: "Kampot & Kep guide", bio: "Former pepper-farm manager. Leads the river kayaks and the best crab lunch on the coast." },
  "g-piseth": { role: "Trekking guide", bio: "Walks Phnom Kulen's jungle trails in sandals and can name every bird you'll hear." },
  "g-chenda": { role: "Hill station guide", bio: "Studied history in Phnom Penh; brings Bokor's colonial ruins and their stories back to life." },
};

export const TRUST_BADGES = [
  { icon: "Lock", label: "Secure payment" },
  { icon: "BadgeCheck", label: "Verified reviews" },
  { icon: "BadgeDollarSign", label: "Best price guarantee" },
  { icon: "CalendarCheck", label: `Free cancellation · ${CANCELLATION_WINDOW}` },
];

export const FAQ_GROUPS = [
  {
    id: "booking",
    title: "Booking & payment",
    items: [
      {
        q: "How do I book a tour?",
        a: "Pick a tour, choose a departure date and the number of travellers, then sign in or create a free account to confirm. You'll get a booking reference by email straight away, and we confirm availability within a few hours (usually much faster).",
      },
      {
        q: "What payment methods do you accept?",
        a: `We accept four methods: ${PAYMENT_METHOD_NAMES.slice(0, -1).join(", ")} and ${PAYMENT_METHOD_NAMES.at(-1)}. ABA Pay, card and bank transfer are paid when you book. If you choose cash, you pay your guide in US dollars on the morning of the tour.`,
      },
      {
        q: "Are prices per person, and in which currency?",
        a: "Yes. Every price on TourTrip is per traveller in US dollars — the currency used day to day across Cambodia — and the same for adults and children. The total you see before confirming is the total you pay: no booking fees, no surprise surcharges.",
      },
      {
        q: "Can I book for a group or a private tour?",
        a: `Group bookings are welcome up to each tour's group size. For a private departure, a school trip or a company outing, contact us at ${MOCK_SETTINGS.general.contactEmail} with your dates and we'll send a quote within one working day.`,
      },
    ],
  },
  {
    id: "cancellation",
    title: "Cancellation & refunds",
    items: [
      {
        q: "Can I cancel my booking?",
        a: `Yes. Cancel from My Bookings up to ${CANCELLATION_WINDOW} (${cancellationDays} days) before your tour starts for a full refund. Inside that window we can't refund, because guides and boats are already booked — but we'll always try to move you to another date.`,
      },
      {
        q: "How long does a refund take?",
        a: "Refunds go back to the method you paid with. ABA Pay refunds usually arrive within 1–2 working days; card and bank transfer refunds can take 5–10 working days depending on your bank.",
      },
      {
        q: "What happens if the weather is bad?",
        a: "Most tours run in light rain — the temples are beautiful in it. If a boat trip or island crossing is unsafe, we'll cancel it ourselves and offer you another date or a full refund, whichever you prefer.",
      },
      {
        q: "Can I change the date instead of cancelling?",
        a: "Usually, yes. Message us before the cancellation window closes and we'll move your booking to any date with free seats, at no extra cost.",
      },
    ],
  },
  {
    id: "on-tour",
    title: "On the tour",
    items: [
      {
        q: "What's included in the tour price?",
        a: "Every tour includes your licensed local guide, transport during the tour and drinking water. Many also include meals, boat trips or entry tickets — each tour page lists exactly what is and isn't included. Personal expenses and travel insurance are never included.",
      },
      {
        q: "Is hotel pickup included?",
        a: "Transport during the tour is always included. Most day tours in Siem Reap and Phnom Penh also pick you up from central hotels — add your hotel name when you book and your guide will confirm the pickup time the evening before.",
      },
      {
        q: "Do I need a visa for Cambodia?",
        a: "Most visitors do. A 30-day tourist e-visa (currently US$30 plus a processing fee) can be bought online at evisa.gov.kh before you fly, or you can get a visa on arrival at the main airports and land borders. Your passport needs at least six months' validity. Always check the latest rules for your nationality before travelling.",
      },
      {
        q: "What should I wear to the temples?",
        a: "Angkor and the Royal Palace are active religious sites: cover your shoulders and knees. Light, breathable clothes, a hat, sunscreen and comfortable shoes with grip are ideal — the temple steps are steep.",
      },
    ],
  },
];
