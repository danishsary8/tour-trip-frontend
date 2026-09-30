import { createMastersHooks } from "../../lib/mastersQuery";
import { deleteSchedule, getSchedules, saveSchedule, setScheduleStatus } from "./api";

const hooks = createMastersHooks("schedules", { list: getSchedules, save: saveSchedule, remove: deleteSchedule, setStatus: setScheduleStatus });
export const useSchedules = hooks.useList;
export const useSaveSchedule = hooks.useSave;
export const useDeleteSchedule = hooks.useDelete;
export const useScheduleStatus = hooks.useStatus;
