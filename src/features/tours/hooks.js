import { createMastersHooks } from "../../lib/mastersQuery";
import { deleteTour, getTours, saveTour, setTourStatus } from "./api";

const hooks = createMastersHooks("tours", { list: getTours, save: saveTour, remove: deleteTour, setStatus: setTourStatus });
export const useTours = hooks.useList;
export const useSaveTour = hooks.useSave;
export const useDeleteTour = hooks.useDelete;
export const useTourStatus = hooks.useStatus;
