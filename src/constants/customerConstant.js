export const STEPS = [
  "Personal Details",
  "Trip Preferences",
  "Review & Create",
];

export const COUNTRY_CODES = [
  "+1",
  "+44",
  "+61",
  "+65",
  "+855",
  "+66",
  "+84",
  "+91",
  "+81",
  "+82",
];

export const TRAVEL_TYPES = [
  "Solo",
  "Couple",
  "Family",
  "Friends",
  "Business",
  "Group Tour",
];
export const TRANSPORT_OPTIONS = [
  "Flight",
  "Bus",
  "Train",
  "Cruise",
  "Private Vehicle",
];
export const INTEREST_OPTIONS = [
  "Adventure",
  "Beach",
  "Nature",
  "Hiking",
  "Food",
  "Shopping",
  "Historical",
  "Photography",
  "Luxury",
  "Honeymoon",
];
export const ACCOMMODATION_OPTIONS = ["Budget", "Standard", "Deluxe", "Luxury"];

export const emptyForm = {
  photo: null,
  fullName: "",
  gender: "",
  dob: "",
  nationality: "",
  passportNumber: "",
  passportExpiry: "",
  occupation: "",
  email: "",
  phone: "",
  countryCode: "+855",
  address: "",
  city: "",
  province: "",
  country: "",
  postalCode: "",
  emergencyName: "",
  relationship: "",
  emergencyPhone: "",
  emergencyEmail: "",
  emergencyAddress: "",
  destination: "",
  departureCity: "",
  departureDate: "",
  returnDate: "",
  flexibleDates: false,
  travelType: "",
  accommodation: "",
  transportation: "",
  interests: [],
  specialRequests: "",
};

export const INITIAL_CUSTOMERS = [
  {
    id: "c1",
    name: "Sopheak Ratana",
    email: "sopheak.r@email.com",
    destination: "Bali, Indonesia",
    status: "Active",
    created: "Aug 14, 2026",
    initials: "SR",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "c2",
    name: "Michael Chen",
    email: "m.chen@email.com",
    destination: "Kyoto, Japan",
    status: "Pending",
    created: "Aug 18, 2026",
    initials: "MC",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "c3",
    name: "Amara Okafor",
    email: "amara.o@email.com",
    destination: "Santorini, Greece",
    status: "Active",
    created: "Aug 20, 2026",
    initials: "AO",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=200&q=80",
  },
];
