import apiClient from "../../lib/axios";
import { MOCK_SETTINGS } from "../../mocks/settings";

const useMock = import.meta.env.VITE_USE_MOCK !== "false";
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

// Session copy: saves survive navigation but reset on reload, like the rest of the mock data.
let settings = structuredClone(MOCK_SETTINGS);

export async function getSettings() {
  if (!useMock) return apiClient.get("/admin/settings").then(({ data }) => data);
  await wait(450);
  return structuredClone(settings);
}

/** Saves one section (`general | payments | email | other`). Currency stays USD. */
export async function saveSettings({ section, values }) {
  if (!useMock) return apiClient.put(`/admin/settings/${section}`, values).then(({ data }) => data);
  await wait(500);
  if (!(section in settings)) throw new Error("Unknown settings section");

  const next = structuredClone(values);
  if (section === "general") Object.assign(next, { currency: "USD", timezone: settings.general.timezone });
  settings = { ...settings, [section]: next };
  return structuredClone(settings);
}
