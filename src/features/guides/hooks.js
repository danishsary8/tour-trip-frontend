import { createMastersHooks } from "../../lib/mastersQuery";
import { deleteGuide, getGuides, saveGuide, setGuideStatus } from "./api";

const hooks = createMastersHooks("guides", { list: getGuides, save: saveGuide, remove: deleteGuide, setStatus: setGuideStatus });
export const useGuides = hooks.useList;
export const useSaveGuide = hooks.useSave;
export const useDeleteGuide = hooks.useDelete;
export const useGuideStatus = hooks.useStatus;
