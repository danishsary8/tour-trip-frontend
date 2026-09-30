import apiClient from "../../lib/axios";
import legacyCustomers from "../../data/CustomerData";
import { dashboardDb, toKey } from "../../mocks/dashboard";
import { bookingsByCustomer, summarizeBookings } from "./stats";

const useMock = import.meta.env.VITE_USE_MOCK !== "false";
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

/**
 * Customers live in the same session store as bookings (`dashboardDb`), so their totals are
 * computed from the shared booking records on every read.
 */
export async function getCustomers() {
  if (!useMock) return apiClient.get("/admin/customers").then(({ data }) => data);
  await wait(300);

  const groups = bookingsByCustomer(dashboardDb.bookings);
  return dashboardDb.customers.map((customer) => ({ ...customer, ...summarizeBookings(groups.get(customer.id) ?? []) }));
}

const initialsOf = (name) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export async function createCustomer({ name, email, phone }) {
  if (!useMock) return apiClient.post("/admin/customers", { name, email, phone }).then(({ data }) => data);
  await wait(400);

  const normalizedEmail = email.trim().toLowerCase();
  if (dashboardDb.customers.some((customer) => customer.email.toLowerCase() === normalizedEmail)) {
    throw new Error("A customer with this email already exists");
  }
  const next = Math.max(...dashboardDb.customers.map((customer) => Number(customer.id.slice(2)))) + 1;
  const customer = {
    id: `c-${String(next).padStart(3, "0")}`,
    name: name.trim(),
    initials: initialsOf(name),
    email: normalizedEmail,
    phone: phone.trim(),
    country: "",
    joinedAt: toKey(new Date()),
    status: "Active",
  };
  dashboardDb.customers.unshift(customer);
  return { ...customer, ...summarizeBookings([]) };
}

export async function setCustomerStatus({ id, status }) {
  if (!useMock) return apiClient.patch(`/admin/customers/${id}`, { status }).then(({ data }) => data);
  await wait(300);

  const customer = dashboardDb.customers.find((item) => item.id === id);
  if (!customer) throw new Error("Customer not found");
  customer.status = status;
  return { ...customer };
}

/** Teammate-owned fixture used only by the legacy customer page (`/admin/customers/legacy`). */
export async function getLegacyCustomers() {
  return legacyCustomers.map((customer) => ({ ...customer }));
}
