/**
 * /tours filters live in the URL so Home links, the hero search and shared links all work:
 * ?q=&destination=a,b&category=a,b&min=&max=&duration=day|multi&rating=4|4.5&date=&travelers=&sort=
 */

export const SORT_OPTIONS = [
  { value: "popular", label: "Most popular" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
];

export const DURATION_OPTIONS = [
  { value: "", label: "Any length" },
  { value: "day", label: "Day trips", test: (days) => days <= 1 },
  { value: "multi", label: "2–3 days", test: (days) => days >= 2 },
];

export const RATING_OPTIONS = [
  { value: "", label: "Any rating" },
  { value: "4.5", label: "4.5 & up" },
  { value: "4", label: "4.0 & up" },
];

const list = (value) =>
  value
    ? value
        .split(",")
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean)
    : [];
const number = (value) => (value === null || value === "" || Number.isNaN(Number(value)) ? null : Number(value));

export function parseFilters(params) {
  const sort = params.get("sort");
  return {
    q: params.get("q") ?? "",
    destination: list(params.get("destination")),
    category: list(params.get("category")),
    min: number(params.get("min")),
    max: number(params.get("max")),
    duration: DURATION_OPTIONS.some((option) => option.value === params.get("duration")) ? params.get("duration") : "",
    rating: RATING_OPTIONS.some((option) => option.value === params.get("rating")) ? params.get("rating") : "",
    date: params.get("date") ?? "",
    travelers: params.get("travelers") ?? "",
    sort: SORT_OPTIONS.some((option) => option.value === sort) ? sort : "popular",
  };
}

/** Writes changed filter keys back to the query string, dropping empty values. */
export function withFilters(params, changes) {
  const next = new URLSearchParams(params);
  for (const [key, value] of Object.entries(changes)) {
    const serialized = Array.isArray(value) ? value.join(",") : value;
    if (serialized === "" || serialized === null || serialized === undefined || (key === "sort" && serialized === "popular")) next.delete(key);
    else next.set(key, String(serialized));
  }
  return next;
}

/** Filter keys that narrow results (date and travellers are informational for daily tours). */
export const FILTER_KEYS = ["q", "destination", "category", "min", "max", "duration", "rating"];

export function countActiveFilters(filters) {
  return (
    (filters.q ? 1 : 0) +
    filters.destination.length +
    filters.category.length +
    (filters.min !== null || filters.max !== null ? 1 : 0) +
    (filters.duration ? 1 : 0) +
    (filters.rating ? 1 : 0)
  );
}

export function priceBounds(tours) {
  if (!tours.length) return { min: 0, max: 0 };
  const prices = tours.map((tour) => tour.price);
  return { min: Math.floor(Math.min(...prices) / 5) * 5, max: Math.ceil(Math.max(...prices) / 5) * 5 };
}

export function applyFilters(tours, filters) {
  const query = filters.q.trim().toLowerCase();
  const duration = DURATION_OPTIONS.find((option) => option.value === filters.duration)?.test;
  const minRating = filters.rating ? Number(filters.rating) : null;

  const matches = tours.filter(
    (tour) =>
      (!query || `${tour.name} ${tour.destination} ${tour.category} ${tour.tagline}`.toLowerCase().includes(query)) &&
      (!filters.destination.length || filters.destination.includes(tour.destinationId)) &&
      (!filters.category.length || filters.category.includes(tour.categoryId)) &&
      (filters.min === null || tour.price >= filters.min) &&
      (filters.max === null || tour.price <= filters.max) &&
      (!duration || duration(tour.durationDays)) &&
      (minRating === null || (tour.rating ?? 0) >= minRating),
  );

  const byPopularity = (a, b) => b.popularity - a.popularity;
  const sorters = {
    popular: byPopularity,
    "price-asc": (a, b) => a.price - b.price || byPopularity(a, b),
    "price-desc": (a, b) => b.price - a.price || byPopularity(a, b),
    rating: (a, b) => (b.rating ?? 0) - (a.rating ?? 0) || b.reviewCount - a.reviewCount || byPopularity(a, b),
  };
  return matches.sort(sorters[filters.sort]);
}
