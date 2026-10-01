/**
 * Tour photography. Every file under `assets/images/tours/<tour-id>/` is a real photo of the
 * named place, downloaded from Unsplash (free licence) and self-hosted; credits are in
 * `assets/images/tours/CREDITS.md`. The first photo of each tour is its cover (card, detail
 * hero, destination tile); the rest feed the Tour Detail gallery and the public Gallery page.
 * Width and height are each file's real pixel size, so layouts can reserve space before load.
 */
const files = import.meta.glob("../assets/images/tours/*/*.jpg", { eager: true, import: "default" });

function photo(tourId, file, width, height, title, alt) {
  const src = files[`../assets/images/tours/${tourId}/${file}.jpg`];
  if (!src) throw new Error(`Missing tour photo ${tourId}/${file}.jpg`);
  return { src, width, height, title, alt };
}

export const TOUR_PHOTOS = {
  "angkor-sunrise": [
    photo("angkor-sunrise", "angkor-wat-sunrise", 2000, 1333, "Sunrise at Angkor Wat", "Angkor Wat silhouetted at sunrise over the reflecting pool"),
    photo("angkor-sunrise", "bayon-faces", 1600, 1200, "The faces of Bayon", "The stone-faced towers of Bayon in Angkor Thom"),
    photo("angkor-sunrise", "ta-prohm-roots", 1600, 1067, "Roots at Ta Prohm", "Silk-cotton tree roots over a doorway at Ta Prohm"),
  ],
  "phnom-penh-city": [
    photo("phnom-penh-city", "royal-palace-night", 2000, 1333, "The Royal Palace after dark", "The Royal Palace in Phnom Penh lit up at night"),
    photo("phnom-penh-city", "apsara-dancers", 1067, 1600, "Classical dance", "Cambodian dancers in traditional dress in Phnom Penh"),
    photo("phnom-penh-city", "riverside-boat", 1600, 1200, "The riverside", "A river cruise boat on the Tonlé Sap at Phnom Penh's riverside"),
    photo("phnom-penh-city", "russian-market-stall", 1600, 1067, "Russian Market", "A stallholder at the Russian Market in Phnom Penh"),
  ],
  "koh-rong": [
    photo("koh-rong", "lazy-beach", 2000, 1335, "Lazy Beach", "Lazy Beach on Koh Rong Sanloem"),
    photo("koh-rong", "lazy-beach-sandbar", 1600, 1067, "The sandbar", "A sandbar in the shallows near Lazy Beach, Koh Rong Sanloem"),
    photo("koh-rong", "sanloem-pier", 1600, 1067, "Koh Rong Sanloem", "Turquoise water and a pier on Koh Rong Sanloem"),
  ],
  "kampot-adventure": [
    photo("kampot-adventure", "kampot-river-mountains", 1600, 1067, "The Kampot river", "The Kampot river with the Elephant Mountains behind"),
    photo("kampot-adventure", "kampot-boatman", 1600, 1067, "River backwaters", "A boatman on a quiet backwater of the Kampot river"),
    photo("kampot-adventure", "pepper-vines", 2000, 1333, "Kampot pepper", "Green peppercorns ripening on the vine in Kampot"),
    photo("kampot-adventure", "pepper-farm-rows", 1600, 1067, "A pepper farm", "Rows of pepper vines on a Kampot farm"),
  ],
  "kulen-mountain": [
    photo("kulen-mountain", "kulen-waterfall", 2000, 1123, "Phnom Kulen falls", "The waterfall on Phnom Kulen in the forest above Siem Reap"),
    photo("kulen-mountain", "kulen-falls-closeup", 1600, 1067, "Under the falls", "Water spilling over rock at the Phnom Kulen falls"),
  ],
  "bokor-hill": [
    photo("bokor-hill", "bokor-church", 2000, 1333, "Bokor's old church", "The old Catholic church on Bokor Mountain"),
    photo("bokor-hill", "bokor-palace", 1600, 1067, "Bokor Palace", "The colonial-era Bokor Palace on the hilltop"),
    photo("bokor-hill", "bokor-view", 1600, 1068, "View to the gulf", "Forest and the Gulf of Thailand seen from the top of Bokor"),
  ],
  "tonle-sap-village": [
    photo("tonle-sap-village", "stilt-houses", 2000, 1333, "Houses on stilts", "Wooden houses on tall stilts beside the Tonlé Sap"),
    photo("tonle-sap-village", "stilt-village-boats", 1600, 1067, "Village moorings", "Boats moored beneath stilt houses in a Tonlé Sap village"),
  ],
  "siem-reap-street-food": [
    photo("siem-reap-street-food", "pub-street-night", 1067, 1600, "Pub Street at night", "Neon signs over Pub Street in Siem Reap at night"),
    photo("siem-reap-street-food", "siem-reap-fruit-stand", 1600, 1067, "A street-side stall", "A fruit and snack stall on a Siem Reap street"),
  ],
  "kep-rabbit-island": [
    photo("kep-rabbit-island", "rabbit-island-boat", 2000, 1333, "Rabbit Island", "A wooden boat pulled up on the beach at Rabbit Island (Koh Tonsay)"),
    photo("kep-rabbit-island", "kep-crab-market", 1200, 1600, "Kep crab market", "A vendor selling shellfish at the Kep crab market"),
    photo("kep-rabbit-island", "koh-tonsay-boats", 1600, 1067, "Dusk off Koh Tonsay", "Boats anchored off Koh Tonsay at dusk"),
  ],
  "battambang-countryside": [
    photo("battambang-countryside", "samlot-countryside", 2000, 1124, "Battambang countryside", "Green fields and mountains in Samlot, Battambang"),
    photo("battambang-countryside", "bamboo-train", 1600, 1067, "The bamboo train", "Riding the bamboo train through the Battambang countryside"),
    photo("battambang-countryside", "phnom-sampov", 1067, 1600, "From Phnom Sampov", "A pagoda and the town seen from Phnom Sampov, Battambang"),
  ],
  "bali-highlands": [
    photo("bali-highlands", "tegallalang-terraces", 2000, 1333, "Tegallalang terraces", "Morning on the Tegallalang rice terraces north of Ubud"),
    photo("bali-highlands", "ulun-danu-beratan", 1600, 1068, "Pura Ulun Danu Beratan", "Pura Ulun Danu Beratan on the shore of Lake Beratan"),
    photo("bali-highlands", "tegallalang-valley", 1600, 1064, "The rice valley", "Rice terraces in Tegallalang, just outside Ubud"),
  ],
  "hanoi-halong-bay": [
    photo("hanoi-halong-bay", "ha-long-bay", 2000, 978, "Ha Long Bay", "Boats on the turquoise water of Ha Long Bay among limestone islands"),
    photo("hanoi-halong-bay", "ti-top-viewpoint", 1280, 1600, "From Ti Top Island", "Ha Long Bay seen from the Ti Top Island viewpoint"),
    photo("hanoi-halong-bay", "turtle-tower", 1200, 1600, "Hoan Kiem Lake", "The Turtle Tower on Hoan Kiem Lake in Hanoi"),
    photo("hanoi-halong-bay", "train-street", 1600, 1067, "Train Street", "Cafés along Hanoi's train street"),
  ],
  "kyoto-temples-gardens": [
    photo("kyoto-temples-gardens", "fushimi-inari-torii", 1600, 1071, "Fushimi Inari", "A tunnel of vermilion torii gates at Fushimi Inari Shrine, Kyoto"),
    photo("kyoto-temples-gardens", "hokanji-gion", 2000, 1333, "Gion and Hōkan-ji", "The Hōkan-ji pagoda above a quiet street in Gion, Kyoto"),
    photo("kyoto-temples-gardens", "arashiyama-bamboo", 1067, 1600, "Arashiyama", "A path through the Arashiyama bamboo grove in Kyoto"),
  ],
};

/** Cover image for a tour id (undefined for tours added later in admin without photos here). */
export const coverOf = (tourId) => TOUR_PHOTOS[tourId]?.[0]?.src;
