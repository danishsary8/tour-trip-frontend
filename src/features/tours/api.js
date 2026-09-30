import { createMastersApi } from "../../lib/mastersApi";

const api = createMastersApi("tours");
export const getTours = api.list;
export const saveTour = api.save;
export const deleteTour = api.remove;
export const setTourStatus = api.setStatus;
