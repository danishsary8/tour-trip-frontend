import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCustomer, getCustomers, getLegacyCustomers, setCustomerStatus } from "./api";

export const CUSTOMERS_KEY = ["customers"];

export function useCustomers() {
  return useQuery({ queryKey: CUSTOMERS_KEY, queryFn: getCustomers });
}

export function useLegacyCustomers() {
  return useQuery({ queryKey: ["customers", "legacy"], queryFn: getLegacyCustomers });
}

function useCustomerMutation(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export const useCreateCustomer = () => useCustomerMutation(createCustomer);

/** Optimistic Active/Inactive toggle so the list and profile update immediately. */
export function useCustomerStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: setCustomerStatus,
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: CUSTOMERS_KEY });
      const previous = queryClient.getQueryData(CUSTOMERS_KEY);
      queryClient.setQueryData(CUSTOMERS_KEY, (list) => list?.map((customer) => (customer.id === id ? { ...customer, status } : customer)));
      return previous;
    },
    onError: (_error, _variables, previous) => queryClient.setQueryData(CUSTOMERS_KEY, previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: CUSTOMERS_KEY }),
  });
}
