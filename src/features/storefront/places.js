/**
 * Where each tour actually happens, for the small coordinates caption on Tour Detail and the
 * International Escapes cards. Two decimals (about 1 km): the place, not a meeting point.
 */
const PLACES = {
  "angkor-sunrise": { label: "Angkor Wat", lat: 13.41, lng: 103.87 },
  "phnom-penh-city": { label: "Royal Palace, Phnom Penh", lat: 11.56, lng: 104.93 },
  "koh-rong": { label: "Koh Rong Sanloem", lat: 10.59, lng: 103.29 },
  "kampot-adventure": { label: "Kampot river", lat: 10.61, lng: 104.18 },
  "kulen-mountain": { label: "Phnom Kulen", lat: 13.57, lng: 104.11 },
  "bokor-hill": { label: "Bokor Mountain", lat: 10.62, lng: 104.03 },
  "tonle-sap-village": { label: "Kampong Phluk, Tonlé Sap", lat: 13.21, lng: 103.98 },
  "siem-reap-street-food": { label: "Pub Street, Siem Reap", lat: 13.35, lng: 103.86 },
  "kep-rabbit-island": { label: "Kep & Koh Tonsay", lat: 10.48, lng: 104.32 },
  "battambang-countryside": { label: "Battambang", lat: 13.1, lng: 103.2 },
  "bali-highlands": { label: "Tegallalang, Bali", lat: -8.43, lng: 115.28 },
  "hanoi-halong-bay": { label: "Ha Long Bay", lat: 20.91, lng: 107.18 },
  "kyoto-temples-gardens": { label: "Fushimi Inari, Kyoto", lat: 34.97, lng: 135.77 },
};

const fixed = (value) => Math.abs(value).toFixed(2);

/** "13.41° N · 103.87° E", or null for a tour without a known place. */
export function coordinatesOf(tourId) {
  const place = PLACES[tourId];
  if (!place) return null;
  return `${fixed(place.lat)}° ${place.lat < 0 ? "S" : "N"} · ${fixed(place.lng)}° ${place.lng < 0 ? "W" : "E"}`;
}

export const placeOf = (tourId) => PLACES[tourId] ?? null;
