import { TOUR_PHOTOS } from "../../../mocks/tourImages";

const angkorBg = TOUR_PHOTOS["angkor-sunrise"][0].src;
const kohRongBg = TOUR_PHOTOS["koh-rong"][0].src;
const tonleSapBg = TOUR_PHOTOS["tonle-sap-village"][0].src;
const kampotBg = TOUR_PHOTOS["kampot-adventure"][0].src;
const royalPalaceBg = TOUR_PHOTOS["phnom-penh-city"][0].src;
const taProhmBg = TOUR_PHOTOS["angkor-sunrise"][2].src;

/** Hero slideshow behind the customer /login, /register and /forgot-password pages. */
export const AUTH_SLIDES = [
  {
    id: "angkor",
    image: angkorBg,
    alt: "Angkor Wat silhouetted at sunrise over the reflecting pool",
    tagline: "Sacred Stone & Dawn Light",
    title: "Angkor Sunrise",
    subtitle: "Sacred Sanctuaries · Siem Reap",
    gradient: "from-[#f5c66b] via-[#e89d58] to-[#c8553d]",
    description:
      "Watch dawn break over the five towers with a licensed heritage guide, then explore the inner galleries before the crowds arrive.",
    meta: "Siem Reap · Temple heritage",
    glowStyle:
      "bg-[radial-gradient(circle_at_15%_82%,rgba(200,85,61,.32),transparent_38%),radial-gradient(circle_at_76%_8%,rgba(233,185,73,.16),transparent_34%)]",
  },
  {
    id: "koh-rong",
    image: kohRongBg,
    alt: "Lazy Beach on Koh Rong Sanloem",
    tagline: "Untouched Shores & Azure Waters",
    title: "Koh Rong Island",
    subtitle: "Lazy Beach · Koh Rong Sanloem",
    gradient: "from-[#5eead4] via-[#2dd4bf] to-[#0ea5e9]",
    description:
      "Cross to Saracen Bay by longtail boat, snorkel clear turquoise water and stay for the glowing plankton after dark.",
    meta: "Gulf of Thailand · Island escapes",
    glowStyle:
      "bg-[radial-gradient(circle_at_18%_80%,rgba(20,184,166,.35),transparent_42%),radial-gradient(circle_at_78%_12%,rgba(56,189,248,.18),transparent_36%)]",
  },
  {
    id: "tonle-sap",
    image: tonleSapBg,
    alt: "Wooden houses on tall stilts beside the Tonlé Sap",
    tagline: "Living Waters & Changing Seasons",
    title: "Tonlé Sap Lake",
    subtitle: "Stilted Villages · Siem Reap",
    gradient: "from-[#fbbf24] via-[#f97316] to-[#ec4899]",
    description:
      "Glide past houses raised high on stilts and learn how lakeside families live with water that rises and falls with the seasons.",
    meta: "Southeast Asia's largest lake",
    glowStyle:
      "bg-[radial-gradient(circle_at_20%_85%,rgba(249,115,22,.32),transparent_40%),radial-gradient(circle_at_75%_10%,rgba(236,72,153,.18),transparent_35%)]",
  },
  {
    id: "kampot",
    image: kampotBg,
    alt: "The Kampot river with the Elephant Mountains behind",
    tagline: "Mountain Mist & Emerald Streams",
    title: "Kampot Serenity",
    subtitle: "Bokor Mist & Preaek Tuek Chhu · Kampot",
    gradient: "from-[#34d399] via-[#10b981] to-[#065f46]",
    description:
      "Unwind along tranquil mangrove riverbanks, kayak beneath the mist-shrouded Elephant Mountains, and visit heritage pepper plantations.",
    meta: "Riverside Highlands · Eco Retreats",
    glowStyle:
      "bg-[radial-gradient(circle_at_16%_82%,rgba(16,185,129,.32),transparent_40%),radial-gradient(circle_at_80%_15%,rgba(52,211,153,.18),transparent_35%)]",
  },
  {
    id: "royal-palace",
    image: royalPalaceBg,
    alt: "The Royal Palace in Phnom Penh lit up at night",
    tagline: "Golden Spire & Living Royalty",
    title: "Royal Palace",
    subtitle: "Chaktomuk Heritage · Phnom Penh",
    gradient: "from-[#fcd34d] via-[#f59e0b] to-[#d97706]",
    description:
      "Walk the ornate throne halls, see the Silver Pagoda's treasures and rest in frangipani-scented royal courtyards.",
    meta: "Chaktomuk Capital · Historic Spires",
    glowStyle:
      "bg-[radial-gradient(circle_at_15%_78%,rgba(245,158,11,.32),transparent_40%),radial-gradient(circle_at_82%_14%,rgba(251,191,36,.18),transparent_35%)]",
  },
  {
    id: "ta-prohm",
    image: taProhmBg,
    alt: "Silk-cotton tree roots over a doorway at Ta Prohm",
    tagline: "Centuries of Stone & Living Roots",
    title: "Ta Prohm Ruins",
    subtitle: "Jungle Sanctuary · Angkor Archaeological Park",
    gradient: "from-[#86efac] via-[#22c55e] to-[#ca8a04]",
    description:
      "Wander the legendary corridor ruins where massive silk-cotton tree roots embrace centuries-old carved Khmer sandstone galleries.",
    meta: "UNESCO World Heritage · 12th Century",
    glowStyle:
      "bg-[radial-gradient(circle_at_18%_85%,rgba(34,197,94,.30),transparent_42%),radial-gradient(circle_at_76%_12%,rgba(202,138,4,.18),transparent_36%)]",
  },
];
