/**
 * Tour photography. Every file under `assets/images/tours/<tour-id>/` is a real photo of the
 * named place, downloaded from Unsplash (free licence) and self-hosted; credits are in
 * `assets/images/tours/CREDITS.md`. The first photo of each tour is its cover (card, detail
 * hero, destination tile); the rest feed the Tour Detail gallery and the public Gallery page.
 */
const files = import.meta.glob("../assets/images/tours/*/*.jpg", { eager: true, import: "default" });

function photo(tourId, file, title, alt) {
  const src = files[`../assets/images/tours/${tourId}/${file}.jpg`];
  if (!src) throw new Error(`Missing tour photo ${tourId}/${file}.jpg`);
  return { src, title, alt };
}

export const TOUR_PHOTOS = {
  "angkor-sunrise": [
    photo("angkor-sunrise", "angkor-wat-sunrise", "Sunrise at Angkor Wat", "Angkor Wat silhouetted at sunrise over the reflecting pool"),
    photo("angkor-sunrise", "bayon-faces", "The faces of Bayon", "The stone-faced towers of Bayon in Angkor Thom"),
    photo("angkor-sunrise", "ta-prohm-roots", "Roots at Ta Prohm", "Silk-cotton tree roots over a doorway at Ta Prohm"),
  ],
  "phnom-penh-city": [
    photo("phnom-penh-city", "royal-palace-night", "The Royal Palace after dark", "The Royal Palace in Phnom Penh lit up at night"),
    photo("phnom-penh-city", "apsara-dancers", "Classical dance", "Cambodian dancers in traditional dress in Phnom Penh"),
    photo("phnom-penh-city", "riverside-boat", "The riverside", "A river cruise boat on the Tonlé Sap at Phnom Penh's riverside"),
    photo("phnom-penh-city", "russian-market-stall", "Russian Market", "A stallholder at the Russian Market in Phnom Penh"),
  ],
  "koh-rong": [
    photo("koh-rong", "lazy-beach", "Lazy Beach", "Lazy Beach on Koh Rong Sanloem"),
    photo("koh-rong", "lazy-beach-sandbar", "The sandbar", "A sandbar in the shallows near Lazy Beach, Koh Rong Sanloem"),
    photo("koh-rong", "sanloem-pier", "Koh Rong Sanloem", "Turquoise water and a pier on Koh Rong Sanloem"),
  ],
  "kampot-adventure": [
    photo("kampot-adventure", "kampot-river-mountains", "The Kampot river", "The Kampot river with the Elephant Mountains behind"),
    photo("kampot-adventure", "kampot-boatman", "River backwaters", "A boatman on a quiet backwater of the Kampot river"),
    photo("kampot-adventure", "pepper-vines", "Kampot pepper", "Green peppercorns ripening on the vine in Kampot"),
    photo("kampot-adventure", "pepper-farm-rows", "A pepper farm", "Rows of pepper vines on a Kampot farm"),
  ],
  "kulen-mountain": [
    photo("kulen-mountain", "kulen-waterfall", "Phnom Kulen falls", "The waterfall on Phnom Kulen in the forest above Siem Reap"),
    photo("kulen-mountain", "kulen-falls-closeup", "Under the falls", "Water spilling over rock at the Phnom Kulen falls"),
  ],
  "bokor-hill": [
    photo("bokor-hill", "bokor-church", "Bokor's old church", "The old Catholic church on Bokor Mountain"),
    photo("bokor-hill", "bokor-palace", "Bokor Palace", "The colonial-era Bokor Palace on the hilltop"),
    photo("bokor-hill", "bokor-view", "View to the gulf", "Forest and the Gulf of Thailand seen from the top of Bokor"),
  ],
  "tonle-sap-village": [
    photo("tonle-sap-village", "stilt-houses", "Houses on stilts", "Wooden houses on tall stilts beside the Tonlé Sap"),
    photo("tonle-sap-village", "stilt-village-boats", "Village moorings", "Boats moored beneath stilt houses in a Tonlé Sap village"),
  ],
  "siem-reap-street-food": [
    photo("siem-reap-street-food", "pub-street-night", "Pub Street at night", "Neon signs over Pub Street in Siem Reap at night"),
    photo("siem-reap-street-food", "siem-reap-fruit-stand", "A street-side stall", "A fruit and snack stall on a Siem Reap street"),
  ],
  "kep-rabbit-island": [
    photo("kep-rabbit-island", "rabbit-island-boat", "Rabbit Island", "A wooden boat pulled up on the beach at Rabbit Island (Koh Tonsay)"),
    photo("kep-rabbit-island", "kep-crab-market", "Kep crab market", "A vendor selling shellfish at the Kep crab market"),
    photo("kep-rabbit-island", "koh-tonsay-boats", "Dusk off Koh Tonsay", "Boats anchored off Koh Tonsay at dusk"),
  ],
  "battambang-countryside": [
    photo("battambang-countryside", "samlot-countryside", "Battambang countryside", "Green fields and mountains in Samlot, Battambang"),
    photo("battambang-countryside", "bamboo-train", "The bamboo train", "Riding the bamboo train through the Battambang countryside"),
    photo("battambang-countryside", "phnom-sampov", "From Phnom Sampov", "A pagoda and the town seen from Phnom Sampov, Battambang"),
  ],
  "bali-highlands": [
    photo("bali-highlands", "tegallalang-terraces", "Tegallalang terraces", "Morning on the Tegallalang rice terraces north of Ubud"),
    photo("bali-highlands", "ulun-danu-beratan", "Pura Ulun Danu Beratan", "Pura Ulun Danu Beratan on the shore of Lake Beratan"),
    photo("bali-highlands", "tegallalang-valley", "The rice valley", "Rice terraces in Tegallalang, just outside Ubud"),
  ],
  "hanoi-halong-bay": [
    photo("hanoi-halong-bay", "ha-long-bay", "Ha Long Bay", "Boats on the turquoise water of Ha Long Bay among limestone islands"),
    photo("hanoi-halong-bay", "ti-top-viewpoint", "From Ti Top Island", "Ha Long Bay seen from the Ti Top Island viewpoint"),
    photo("hanoi-halong-bay", "turtle-tower", "Hoan Kiem Lake", "The Turtle Tower on Hoan Kiem Lake in Hanoi"),
    photo("hanoi-halong-bay", "train-street", "Train Street", "Cafés along Hanoi's train street"),
  ],
  "kyoto-temples-gardens": [
    photo("kyoto-temples-gardens", "fushimi-inari-torii", "Fushimi Inari", "A tunnel of vermilion torii gates at Fushimi Inari Shrine, Kyoto"),
    photo("kyoto-temples-gardens", "hokanji-gion", "Gion and Hōkan-ji", "The Hōkan-ji pagoda above a quiet street in Gion, Kyoto"),
    photo("kyoto-temples-gardens", "arashiyama-bamboo", "Arashiyama", "A path through the Arashiyama bamboo grove in Kyoto"),
  ],
};

/** Cover image for a tour id (undefined for tours added later in admin without photos here). */
export const coverOf = (tourId) => TOUR_PHOTOS[tourId]?.[0]?.src;
