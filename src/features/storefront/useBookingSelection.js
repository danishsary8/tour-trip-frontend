import { useState } from "react";
import { seatsLeft, upcomingSchedules } from "./booking";

/**
 * Departure + traveller selection for one tour. Lives in the page so the in-page Departures
 * list and the sticky booking card (or mobile sheet) share one choice.
 */
export function useBookingSelection(schedules, onBook) {
  const [selected, setSelected] = useState(null);
  const [adults, setAdults] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [open, setOpen] = useState(false);
  const future = upcomingSchedules(schedules);
  const choose = (schedule) => { setSelected(schedule); if (adults + childrenCount > seatsLeft(schedule)) { setAdults(1); setChildrenCount(0); } };
  const submit = () => { if (selected && seatsLeft(selected) >= adults + childrenCount) { setOpen(false); onBook({ date: selected.date, adults, children: childrenCount }); } };
  return { future, selected, choose, adults, setAdults, childrenCount, setChildrenCount, open, setOpen, submit };
}
