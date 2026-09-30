import { CATEGORIES, DESTINATIONS, GUIDES, TOURS, dashboardDb } from "./dashboard";

const categoryDetails = [
  ["Ancient temples, living history and Khmer heritage.", "Landmark"],
  ["City stories, food, architecture and local culture.", "Building2"],
  ["Trails, rivers and nature-led adventures.", "Mountain"],
  ["Island stays and Cambodia's southern coast.", "Waves"],
  ["Cooler highlands and scenic hill stations.", "Trees"],
  ["Street food, night markets and Khmer flavours.", "UtensilsCrossed"],
];

CATEGORIES.forEach((item, index) => Object.assign(item, { description: categoryDetails[index][0], icon: categoryDetails[index][1], status: "Active" }));
DESTINATIONS.forEach((item) => Object.assign(item, {
  description: `${item.name} welcomes guests with a memorable mix of Cambodian landscapes and local life.`,
  // First active catalogue tour in each destination keeps Home and Masters imagery aligned.
  image: (TOURS.find((tour) => tour.destinationId === item.id) ?? TOURS[5]).image,
  status: "Active",
}));
GUIDES.forEach((item, index) => Object.assign(item, {
  languages: [["Khmer", "English"], ["Khmer", "English", "French"], ["Khmer", "Chinese"],
    ["Khmer", "English"], ["Khmer", "French"], ["Khmer", "English", "Chinese"]][index],
  phone: `+855 12 ${String(341000 + index * 7341).slice(0, 3)} ${String(341000 + index * 7341).slice(3)}`,
  status: "Active",
}));
TOURS.forEach((item, index) => Object.assign(item, {
  durationDays: [1, 1, 3, 2, 1, 1, 1, 1, 1, 1][index] ?? 1,
  description: `Discover ${item.destination} with an experienced local guide on a carefully paced TourTrip journey.`,
  itinerary: [{ title: "Meet your guide", description: "Welcome, orientation and the first local highlights." }],
  included: ["Local guide", "Transport", "Drinking water"],
  excluded: ["Personal expenses", "Travel insurance"],
  gallery: [item.image],
  coverImage: item.image,
  status: "Active",
}));
dashboardDb.schedules.forEach((item) => Object.assign(item, { status: "Active", priceOverride: null }));

/** Catalogue arrays are shared with the dashboard's mock store for this browser session. */
export const mastersDb = {
  categories: CATEGORIES,
  destinations: DESTINATIONS,
  guides: GUIDES,
  tours: TOURS,
  schedules: dashboardDb.schedules,
};

let nextId = 100;
const prefix = { categories: "cat", destinations: "dst", guides: "g", tours: "tour", schedules: "sch" };

function collection(domain) {
  const records = mastersDb[domain];
  if (!records) throw new Error(`Unknown master domain: ${domain}`);
  return records;
}

function decorate(domain, item) {
  if (domain === "categories") return { ...item, tourCount: TOURS.filter((tour) => tour.categoryId === item.id).length };
  if (domain === "destinations") return { ...item, tourCount: TOURS.filter((tour) => tour.destinationId === item.id).length };
  if (domain === "guides") return { ...item, assignedTours: TOURS.filter((tour) => tour.guideId === item.id).length };
  if (domain === "tours") return { ...item, bookingsCount: dashboardDb.bookings.filter((booking) => booking.tourId === item.id).length };
  return { ...item };
}

export function listMasters(domain) {
  return collection(domain).map((item) => structuredClone(decorate(domain, item)));
}

export function findMaster(domain, id) {
  const item = collection(domain).find((record) => record.id === id);
  return item ? structuredClone(decorate(domain, item)) : null;
}

function normalize(domain, data) {
  if (domain === "tours") {
    const destination = DESTINATIONS.find((item) => item.id === data.destinationId);
    return { ...data, destination: destination?.name ?? "", image: data.coverImage ?? data.gallery?.[0] ?? "", weight: data.weight ?? 0 };
  }
  if (domain === "schedules") {
    const tour = TOURS.find((item) => item.id === data.tourId);
    return { ...data, tourName: tour?.name ?? "", destination: tour?.destination ?? "", image: tour?.image ?? "", guide: GUIDES.find((item) => item.id === tour?.guideId) ?? null, seatsBooked: data.seatsBooked ?? 0 };
  }
  return data;
}

export function saveMaster(domain, data, id) {
  const records = collection(domain);
  const cleaned = normalize(domain, data);
  const sameName = domain !== "schedules" && records.some((item) => item.id !== id && item.name.toLowerCase() === cleaned.name?.toLowerCase());
  if (sameName) throw new Error(`A ${domain === "categories" ? "category" : domain.slice(0, -1)} with this name already exists.`);

  if (id) {
    const existing = records.find((item) => item.id === id);
    if (!existing) throw new Error("This record was not found.");
    Object.assign(existing, cleaned);
    if (domain === "tours") dashboardDb.schedules.filter((item) => item.tourId === id).forEach((item) => Object.assign(item, normalize("schedules", item)));
    return structuredClone(decorate(domain, existing));
  }
  const created = { id: `${prefix[domain]}-${nextId++}`, status: "Active", ...cleaned };
  records.unshift(created);
  return structuredClone(decorate(domain, created));
}

export function setMasterStatus(domain, id, status) {
  const item = collection(domain).find((record) => record.id === id);
  if (!item) throw new Error("This record was not found.");
  item.status = status;
  return structuredClone(decorate(domain, item));
}

export function deleteMaster(domain, id) {
  const records = collection(domain);
  const index = records.findIndex((item) => item.id === id);
  if (index < 0) throw new Error("This record was not found.");
  if (domain === "categories" && TOURS.some((tour) => tour.categoryId === id)) throw new Error("This category is used by tours. Move those tours before deleting it.");
  if (domain === "destinations" && TOURS.some((tour) => tour.destinationId === id)) throw new Error("This destination is used by tours. Move those tours before deleting it.");
  if (domain === "guides" && TOURS.some((tour) => tour.guideId === id)) throw new Error("This guide is assigned to tours. Reassign those tours before deleting the guide.");
  if (domain === "tours") {
    if (dashboardDb.bookings.some((booking) => booking.tourId === id)) throw new Error("This tour has bookings. Keep the tour record or move those bookings before deleting it.");
    for (let position = dashboardDb.schedules.length - 1; position >= 0; position -= 1) {
      if (dashboardDb.schedules[position].tourId === id) dashboardDb.schedules.splice(position, 1);
    }
  }
  const [deleted] = records.splice(index, 1);
  return structuredClone(deleted);
}
