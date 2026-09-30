import apiClient from "./axios";
import { deleteMaster, listMasters, saveMaster, setMasterStatus } from "../mocks/masters";

const useMock = import.meta.env.VITE_USE_MOCK !== "false";
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

/** Keeps the Laravel switch inside each feature's API facade. */
export function createMastersApi(domain) {
  const path = `/admin/masters/${domain}`;
  return {
    async list() {
      if (!useMock) return apiClient.get(path).then(({ data }) => data);
      await wait(250);
      return listMasters(domain);
    },
    async save({ data, id }) {
      if (!useMock) return apiClient[id ? "put" : "post"](id ? `${path}/${id}` : path, data).then(({ data: result }) => result);
      await wait(250);
      return saveMaster(domain, data, id);
    },
    async remove(id) {
      if (!useMock) return apiClient.delete(`${path}/${id}`).then(({ data }) => data);
      await wait(220);
      return deleteMaster(domain, id);
    },
    async setStatus({ id, status }) {
      if (!useMock) return apiClient.patch(`${path}/${id}/status`, { status }).then(({ data }) => data);
      await wait(200);
      return setMasterStatus(domain, id, status);
    },
  };
}
