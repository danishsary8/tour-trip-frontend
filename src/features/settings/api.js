import apiClient from "../../lib/axios";
import { MOCK_KEYS, readJson, writeJson } from "../../mocks/persistence";
import { MOCK_SETTINGS } from "../../mocks/settings";

const useMock = import.meta.env.VITE_USE_MOCK !== "false";
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

// Saved to localStorage so checkout (possibly in another tab) offers only the payment methods
// the admin left enabled. Sections missing from an older saved copy fall back to the defaults.
const stored = () => ({ ...structuredClone(MOCK_SETTINGS), ...readJson(MOCK_KEYS.settings, {}) });
let settings = stored();

export async function getSettings() {
  if (!useMock) return apiClient.get("/admin/settings").then(({ data }) => data);
  await wait(450);
  settings = stored();
  return structuredClone(settings);
}

/** Saves one section (`general | payments | email | other`). Currency stays USD. */
export async function saveSettings({ section, values }) {
  if (!useMock) return apiClient.put(`/admin/settings/${section}`, values).then(({ data }) => data);
  await wait(500);
  if (!(section in settings)) throw new Error("Unknown settings section");

  const next = structuredClone(values);
  if (section === "general") Object.assign(next, { currency: "USD", timezone: settings.general.timezone });
  settings = { ...stored(), [section]: next };
  writeJson(MOCK_KEYS.settings, settings);
  return structuredClone(settings);
}
