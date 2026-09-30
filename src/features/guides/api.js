import { createMastersApi } from "../../lib/mastersApi";

const api = createMastersApi("guides");
export const getGuides = api.list;
export const saveGuide = api.save;
export const deleteGuide = api.remove;
export const setGuideStatus = api.setStatus;
