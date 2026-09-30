/**
 * Deterministic mock reviews dataset for TourTrip Cambodia.
 * ~26 reviews spanning Cambodia tours with realistic feedback and varied ratings.
 */

function addDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function toKey(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}
const INITIAL_REVIEWS = [
  {
    id: "rev-01",
    customerName: "Emma Schneider",
    tourName: "Angkor Wat Sunrise Tour",
    rating: 5,
    comment:
      "Watching the sunrise illuminate the five central towers of Angkor Wat was absolutely breathtaking. Our guide Sokha knew every single relief carving and guided us away from the heavy crowds.",
    daysAgo: 1,
    status: "Pending",
  },
  {
    id: "rev-02",
    customerName: "Lucas Dubois",
    tourName: "Phnom Penh City Tour",
    rating: 3,
    comment:
      "The Royal Palace and Tuol Sleng museum were deeply moving and well explained by our guide. However, our tuk-tuk driver was nearly 30 minutes late for the morning hotel pickup.",
    daysAgo: 2,
    status: "Pending",
  },
  {
    id: "rev-03",
    customerName: "Dara Sok",
    tourName: "Koh Rong Island",
    rating: 4,
    comment:
      "Pristine turquoise water and powdered white sand at Saracen Bay. The speedboat ride was smooth and well-organized, though beachside lunch could have been served an hour earlier.",
    daysAgo: 3,
    status: "Pending",
  },
  {
    id: "rev-04",
    customerName: "Hana Kim",
    tourName: "Kampot Adventure",
    rating: 5,
    comment:
      "Kayaking down the green river at sunset with the mist over Bokor mountain in the background was magical. The organic black pepper tasting at La Plantation was top notch!",
    daysAgo: 4,
    status: "Pending",
  },
  {
    id: "rev-05",
    customerName: "Oliver Grant",
    tourName: "Kulen Mountain Tour",
    rating: 5,
    comment:
      "The sacred River of a Thousand Lingas and the massive reclining Buddha carved into the hilltop rock were awe-inspiring. Bring swim wear for the lower jungle waterfall pool!",
    daysAgo: 5,
    status: "Pending",
  },
  {
    id: "rev-06",
    customerName: "Sophea Chan",
    tourName: "Bokor Hill Station",
    rating: 4,
    comment:
      "The cool mountain air at the summit is such a welcome relief from the lowlands heat. The misty French colonial church ruins feel like walking into history. Tour bus was very comfortable.",
    daysAgo: 6,
    status: "Pending",
  },
  {
    id: "rev-07",
    customerName: "Mateo García",
    tourName: "Phnom Penh City Tour",
    rating: 1,
    comment:
      "Air conditioning in the van stopped working halfway through the tour in 38 degree heat. The driver drove recklessly and seemed in a rush the whole afternoon. Disappointing.",
    daysAgo: 7,
    status: "Pending",
  },
  {
    id: "rev-08",
    customerName: "Channary Lim",
    tourName: "Angkor Wat Sunrise Tour",
    rating: 5,
    comment:
      "Ta Prohm with the giant banyan roots wrapping over centuries-old stones was like stepping into an adventure movie. Fantastic breakfast box provided by the tour company.",
    daysAgo: 8,
    status: "Pending",
  },
  {
    id: "rev-09",
    customerName: "Daniel Lee",
    tourName: "Koh Rong Island",
    rating: 5,
    comment:
      "Night swimming with bioluminescent plankton was a once-in-a-lifetime experience. The beach bungalows were spotless and the seafood BBQ dinner was delicious.",
    daysAgo: 10,
    status: "Approved",
  },
  {
    id: "rev-10",
    customerName: "Maya Roberts",
    tourName: "Kampot Adventure",
    rating: 5,
    comment:
      "Our guide Sreyleak made the day so memorable. She took us through secret mangrove channels and introduced us to local salt farmers. Highly recommend for families.",
    daysAgo: 11,
    status: "Approved",
  },
  {
    id: "rev-11",
    customerName: "Yuki Tanaka",
    tourName: "Angkor Wat Sunrise Tour",
    rating: 5,
    comment:
      "Bayon temple with the enigmatic stone smiling faces was my favorite part. Excellent photography tips from the guide who knew the exact light angles.",
    daysAgo: 12,
    status: "Approved",
  },
  {
    id: "rev-12",
    customerName: "Isabella Rossi",
    tourName: "Kulen Mountain Tour",
    rating: 4,
    comment:
      "Beautiful sacred sites and lush jungle environment. The mountain road is winding so take motion sickness tablets if prone, but the destination is well worth it.",
    daysAgo: 14,
    status: "Approved",
  },
  {
    id: "rev-13",
    customerName: "Noah Martin",
    tourName: "Bokor Hill Station",
    rating: 4,
    comment:
      "Stunning views over the coastline and Kampot bay from the cliff edge temple. Guide Chenda gave rich context on pre-war Cambodian history.",
    daysAgo: 15,
    status: "Approved",
  },
  {
    id: "rev-14",
    customerName: "Mia Johansson",
    tourName: "Phnom Penh City Tour",
    rating: 4,
    comment:
      "The Central Market and National Museum were great cultural highlights. Comfortable modern minivan with cold drinking water provided throughout the day.",
    daysAgo: 16,
    status: "Approved",
  },
  {
    id: "rev-15",
    customerName: "Ethan Walker",
    tourName: "Angkor Wat Sunrise Tour",
    rating: 5,
    comment:
      "Worth waking up at 4:30 AM! The reflection of the lotus ponds during the pink dawn sky is forever etched in my mind. Seamless pickup and return.",
    daysAgo: 18,
    status: "Approved",
  },
  {
    id: "rev-16",
    customerName: "Chloe Nguyen",
    tourName: "Koh Rong Island",
    rating: 5,
    comment:
      "Snorkeling gear was clean and modern. The coral reef at Koh Rong Sanloem had plenty of colorful fish and clear visibility. 10/10.",
    daysAgo: 19,
    status: "Approved",
  },
  {
    id: "rev-17",
    customerName: "Liam O'Connor",
    tourName: "Kampot Adventure",
    rating: 4,
    comment:
      "Great relaxed pace. Loved the countryside bicycle ride through the pepper orchards. Very polite and knowledgeable driver.",
    daysAgo: 21,
    status: "Approved",
  },
  {
    id: "rev-18",
    customerName: "Visal Ouk",
    tourName: "Kulen Mountain Tour",
    rating: 5,
    comment:
      "Spectacular natural wonders. The lunch buffet of traditional Khmer dishes (amok and fresh tropical fruit) was unexpectedly high quality.",
    daysAgo: 22,
    status: "Approved",
  },
  {
    id: "rev-19",
    customerName: "Ava Thompson",
    tourName: "Angkor Wat Sunrise Tour",
    rating: 5,
    comment:
      "Could not have asked for a better Siem Reap temple introduction. Guide Sokha paced our walking so my elderly parents could comfortably enjoy every temple.",
    daysAgo: 24,
    status: "Approved",
  },
  {
    id: "rev-20",
    customerName: "Jonas Weber",
    tourName: "Bokor Hill Station",
    rating: 5,
    comment:
      "Atmospheric misty mountain setting. Stopped by the giant Yeay Mao monument on the way up. Excellent private tour service.",
    daysAgo: 25,
    status: "Approved",
  },
  {
    id: "rev-21",
    customerName: "Priya Sharma",
    tourName: "Phnom Penh City Tour",
    rating: 4,
    comment:
      "Sunset boat cruise on the Chaktomuk river junction capped off a wonderful day in the capital city. Very friendly staff.",
    daysAgo: 27,
    status: "Approved",
  },
  {
    id: "rev-22",
    customerName: "Rithy Mao",
    tourName: "Angkor Wat Sunrise Tour",
    rating: 5,
    comment:
      "The Banteay Srei pink sandstone carvings in the afternoon extension were the highlight of my trip to Cambodia. Outstanding day.",
    daysAgo: 29,
    status: "Approved",
  },
  {
    id: "rev-23",
    customerName: "Kosal Chea",
    tourName: "Koh Rong Island",
    rating: 2,
    comment:
      "Spam review promoting an external private boat booking service with suspicious links. (Flagged for moderation)",
    daysAgo: 13,
    status: "Hidden",
  },
  {
    id: "rev-24",
    customerName: "Anonymous User",
    tourName: "Kampot Adventure",
    rating: 1,
    comment:
      "Inappropriate language and offensive remarks directed toward the guide team. Hidden by automated profanity filter.",
    daysAgo: 17,
    status: "Hidden",
  },
  {
    id: "rev-25",
    customerName: "Travel Deals Bot",
    tourName: "Phnom Penh City Tour",
    rating: 1,
    comment:
      "CLICK HERE FOR DISCOUNT HOTEL VOUCHERS AND CHEAP FLIGHTS TO SIEM REAP! WWW.DISCOUNT-TRIPS-FAKE.XYZ",
    daysAgo: 20,
    status: "Hidden",
  },
  {
    id: "rev-26",
    customerName: "Sreymom Keo",
    tourName: "Angkor Wat Sunrise Tour",
    rating: 2,
    comment:
      "Duplicate submission: reviewer posted the exact same review three times in consecutive minutes due to double click.",
    daysAgo: 23,
    status: "Hidden",
  },
];

const initialsOf = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const baseDate = new Date();

/** Initialize the in-memory mutable store. */
function createReviewsStore() {
  return INITIAL_REVIEWS.map((review) => {
    const reviewDate = addDays(baseDate, -review.daysAgo);
    return {
      ...review,
      createdAt: reviewDate.toISOString(),
      dateKey: toKey(reviewDate),
      initials: initialsOf(review.customerName),
    };
  });
}

/** In-memory store that survives re-renders during the user's browser session. */
let reviewsDb = createReviewsStore();

export function getReviewsDb() {
  return reviewsDb.map((review) => ({ ...review }));
}

export function getPendingReviewsCount() {
  return reviewsDb.filter((r) => r.status === "Pending").length;
}

export function updateReviewStatusInDb(id, nextStatus) {
  const review = reviewsDb.find((item) => item.id === id);
  if (!review) throw new Error(`Review ${id} not found`);
  const previousStatus = review.status;
  review.status = nextStatus;
  return { review: { ...review }, previousStatus };
}

export function deleteReviewFromDb(id) {
  const index = reviewsDb.findIndex((item) => item.id === id);
  if (index === -1) throw new Error(`Review ${id} not found`);
  const [removed] = reviewsDb.splice(index, 1);
  return { review: removed, index };
}

export function restoreReviewInDb(id, snapshotStatus) {
  const review = reviewsDb.find((item) => item.id === id);
  if (!review) throw new Error(`Review ${id} not found`);
  review.status = snapshotStatus;
  return { review: { ...review } };
}

export function resetReviewsDb() {
  reviewsDb = createReviewsStore();
  return getReviewsDb();
}
