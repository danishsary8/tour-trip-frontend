import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getActivity,
  getAttention,
  getBookingsTimeline,
  getPaymentBreakdown,
  getPopularTours,
  getRevenueSeries,
  getStatusBreakdown,
  getSummary,
  getUpcomingDepartures,
} from "./api";

const DASHBOARD = "dashboard";

/**
 * Range queries keep showing the previous range's data while the next one loads,
 * so charts morph between ranges instead of flashing skeletons.
 */
function useRangeQuery(name, queryFn, range) {
  return useQuery({
    queryKey: [DASHBOARD, name, range],
    queryFn: () => queryFn(range),
    placeholderData: keepPreviousData,
  });
}

export const useSummary = (range) => useRangeQuery("summary", getSummary, range);
export const useRevenueSeries = (range) => useRangeQuery("revenue", getRevenueSeries, range);
export const useStatusBreakdown = (range) => useRangeQuery("status", getStatusBreakdown, range);
export const useBookingsTimeline = (range) => useRangeQuery("timeline", getBookingsTimeline, range);
export const usePopularTours = (range) => useRangeQuery("popular-tours", getPopularTours, range);
export const usePaymentBreakdown = (range) => useRangeQuery("payments", getPaymentBreakdown, range);

export const useUpcomingDepartures = () => useQuery({ queryKey: [DASHBOARD, "departures"], queryFn: getUpcomingDepartures });
export const useAttention = () => useQuery({ queryKey: [DASHBOARD, "attention"], queryFn: getAttention });
export const useActivity = () => useQuery({ queryKey: [DASHBOARD, "activity"], queryFn: getActivity });
