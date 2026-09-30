import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getDestinationReport, getIncomeReport, getPaymentReport, getStatusReport, getToursReport } from "./api";

/** Like the dashboard, switching range or year keeps the old data visible while the next loads. */
function useReportQuery(name, queryFn, param) {
  return useQuery({
    queryKey: ["reports", name, param],
    queryFn: () => queryFn(param),
    placeholderData: keepPreviousData,
  });
}

export const useIncomeReport = (year) => useReportQuery("income", getIncomeReport, year);
export const useToursReport = (range) => useReportQuery("tours", getToursReport, range);
export const useStatusReport = (range) => useReportQuery("status", getStatusReport, range);
export const useDestinationReport = (range) => useReportQuery("destinations", getDestinationReport, range);
export const usePaymentReport = (range) => useReportQuery("payments", getPaymentReport, range);
