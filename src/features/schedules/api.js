import { createMastersApi } from "../../lib/mastersApi";

const api = createMastersApi("schedules");
export const getSchedules = api.list;
export const saveSchedule = api.save;
export const deleteSchedule = api.remove;
export const setScheduleStatus = api.setStatus;
