import { createMastersApi } from "../../lib/mastersApi";

const api = createMastersApi("destinations");
export const getDestinations = api.list;
export const saveDestination = api.save;
export const deleteDestination = api.remove;
export const setDestinationStatus = api.setStatus;
