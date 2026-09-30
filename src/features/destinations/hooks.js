import { createMastersHooks } from "../../lib/mastersQuery";
import { deleteDestination, getDestinations, saveDestination, setDestinationStatus } from "./api";

const hooks = createMastersHooks("destinations", { list: getDestinations, save: saveDestination, remove: deleteDestination, setStatus: setDestinationStatus });
export const useDestinations = hooks.useList;
export const useSaveDestination = hooks.useSave;
export const useDeleteDestination = hooks.useDelete;
export const useDestinationStatus = hooks.useStatus;
