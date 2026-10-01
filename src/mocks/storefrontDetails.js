import { TOUR_PHOTOS } from "./tourImages";

/** The tour's photos for the detail gallery: cover first, then the rest of its set in `tourImages.js`. */
export function tourPhotos(tour) {
  const primary = { src: tour.coverImage ?? tour.image, alt: `${tour.name} in ${tour.destination}` };
  const set = (TOUR_PHOTOS[tour.id] ?? []).map(({ src, alt }) => ({ src, alt }));
  // The cover's own entry carries a better description than the generic fallback.
  const coverEntry = set.find((item) => item.src === primary.src);
  return [coverEntry ?? primary, ...set.filter((item) => item.src !== primary.src)];
}

/** Editorial copy only. Core tour fields, guide, reviews and availability stay in their shared stores. */
const STORIES = {
  "angkor-sunrise": {
    overview: "Begin before the city wakes and watch the lotus towers emerge from the morning mist. Your guide leads you beyond the familiar postcard view, through quiet galleries, carved stories and shaded temple paths at a pace that leaves room to take it all in.",
    meetingPoint: "Siem Reap hotel pickup",
    itinerary: [{ title: "Sunrise over Angkor", description: "Early pickup, sunrise at Angkor Wat, a relaxed breakfast stop, then Bayon faces and the tree-rooted halls of Ta Prohm." }],
    included: ["Local Khmer guide", "Hotel pickup and transport", "Drinking water"], excluded: ["Angkor entry pass", "Personal expenses"],
  },
  "phnom-penh-city": {
    overview: "Follow the capital's layered story from gilded palace roofs to everyday riverside life. This small-group route pairs landmark architecture with market moments and thoughtful context from a local guide.",
    meetingPoint: "Riverside, Phnom Penh",
    itinerary: [{ title: "Capital stories", description: "Meet by the riverside, visit the Royal Palace and Silver Pagoda, explore a local market and finish with a Mekong sunset view." }],
    included: ["Local guide", "City transport", "Drinking water"], excluded: ["Palace entry ticket", "Meals and personal purchases"],
  },
  "koh-rong": {
    overview: "Trade the mainland rush for three unhurried days beside the Gulf. Boat across clear water, explore palm-fringed shores and leave plenty of room for the island's quieter corners.",
    meetingPoint: "Sihanoukville ferry pier",
    itinerary: [
      { title: "Cross to the island", description: "Meet at the pier, take the ferry to Koh Rong and settle in for an afternoon on the beach." },
      { title: "Water and wilderness", description: "Snorkel sheltered water, walk a coastal trail and enjoy a relaxed evening by the shore." },
      { title: "Slow morning, return", description: "Start with free time by the sea before the return crossing to Sihanoukville." },
    ],
    included: ["Local guide", "Return ferry", "Drinking water"], excluded: ["Accommodation", "Meals and personal expenses"],
  },
  "kampot-adventure": {
    overview: "Kampot's green waterways and pepper-growing countryside make this a gentle adventure with a strong sense of place. Paddle, taste and slow down beside the river.",
    meetingPoint: "Kampot riverside",
    itinerary: [
      { title: "River and pepper", description: "Meet your guide, visit a pepper farm, then kayak a calm stretch of the river as the light softens." },
      { title: "Countryside morning", description: "Explore local lanes and riverside villages before returning to central Kampot." },
    ],
    included: ["Local guide", "Kayak equipment", "Transport and drinking water"], excluded: ["Accommodation", "Meals and personal expenses"],
  },
  "kulen-mountain": {
    overview: "Head into the cooler foothills above Siem Reap for sacred carvings, forest paths and a waterfall pause. A local guide connects the landscape with the stories that give it meaning.",
    meetingPoint: "Siem Reap hotel pickup",
    itinerary: [{ title: "Mountain and waterfall", description: "Drive to Phnom Kulen, see the River of a Thousand Lingas and reclining Buddha, then relax near the waterfall." }],
    included: ["Local guide", "Transport", "Drinking water"], excluded: ["National park entry", "Lunch and personal expenses"],
  },
  "bokor-hill": {
    overview: "Climb from Kampot's warm lowlands into misty hill air and atmospheric colonial-era ruins. Wide views and a slower pace make the mountain feel a world away.",
    meetingPoint: "Kampot town centre",
    itinerary: [{ title: "Into the highlands", description: "Travel to Bokor National Park, visit the historic hill station and stop at scenic overlooks on the return." }],
    included: ["Local guide", "Transport", "Drinking water"], excluded: ["Park admission", "Meals and personal expenses"],
  },
  "tonle-sap-village": {
    overview: "Life around Tonlé Sap changes with the water. Travel by boat among stilted homes and flooded forest while learning how communities adapt to the lake's seasons.",
    meetingPoint: "Siem Reap hotel pickup",
    itinerary: [{ title: "Life on the lake", description: "Drive to the boat landing, cruise through a lakeside village and flooded forest, then return to Siem Reap." }],
    included: ["Local guide", "Boat trip", "Transport and drinking water"], excluded: ["Meals", "Personal expenses"],
  },
  "siem-reap-street-food": {
    overview: "Follow the evening aromas through Siem Reap's markets and side streets. Taste beloved Khmer dishes, meet the people behind the stalls and hear how local food is shared.",
    meetingPoint: "Old Market, Siem Reap",
    itinerary: [{ title: "Night-market tastes", description: "Meet your foodie guide, sample market snacks and Khmer favourites, then finish with a relaxed dessert stop." }],
    included: ["Local food guide", "Tasting stops", "Drinking water"], excluded: ["Alcoholic drinks", "Extra purchases"],
  },
  "kep-rabbit-island": {
    overview: "Begin at Kep's famous crab market, where the sea and Kampot pepper meet. Then cross to Rabbit Island for sand, shade and an easygoing afternoon.",
    meetingPoint: "Kep Crab Market",
    itinerary: [{ title: "Market to island", description: "Meet at the crab market, sample the local catch, cross to Rabbit Island and return to Kep in the late afternoon." }],
    included: ["Local guide", "Return boat", "Drinking water"], excluded: ["Crab lunch", "Personal expenses"],
  },
  "battambang-countryside": {
    overview: "Battambang moves to a gentler rhythm. Ride the bamboo train past rice fields, meet local makers and discover why this creative riverside city rewards a slower look.",
    meetingPoint: "Battambang town centre",
    itinerary: [{ title: "Bamboo train and rural life", description: "Meet your guide in town, ride the bamboo train, visit countryside workshops and return via quiet village roads." }],
    included: ["Local guide", "Bamboo-train ride", "Transport and drinking water"], excluded: ["Lunch", "Personal purchases"],
  },
};

export function tourStory(tour, guide) {
  const copy = STORIES[tour.id] ?? {};
  return {
    overview: copy.overview ?? tour.description,
    meetingPoint: copy.meetingPoint ?? `${tour.destination} town centre`,
    languages: guide?.languages ?? ["Khmer", "English"],
    itinerary: copy.itinerary ?? tour.itinerary ?? [],
    included: copy.included ?? tour.included ?? [],
    excluded: copy.excluded ?? tour.excluded ?? [],
  };
}
