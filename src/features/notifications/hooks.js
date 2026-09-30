import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clearNotifications, getNotifications, getShellSummary, markAllNotificationsRead } from "./api";

const NOTIFICATIONS_KEY = ["notifications"];
const SHELL_SUMMARY_KEY = ["shell-summary"];

export function useNotifications() {
  return useQuery({ queryKey: NOTIFICATIONS_KEY, queryFn: getNotifications });
}

/** Optimistic update so the menu reacts instantly; rolls back if the request fails. */
function useOptimisticNotifications(mutationFn, update) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEY });
      const previous = queryClient.getQueryData(NOTIFICATIONS_KEY);
      queryClient.setQueryData(NOTIFICATIONS_KEY, (current = []) => update(current));
      return { previous };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(NOTIFICATIONS_KEY, context?.previous);
    },
    onSuccess: (data) => queryClient.setQueryData(NOTIFICATIONS_KEY, data),
  });
}

export function useMarkAllNotificationsRead() {
  return useOptimisticNotifications(markAllNotificationsRead, (list) => list.map((item) => ({ ...item, read: true })));
}

export function useClearNotifications() {
  return useOptimisticNotifications(clearNotifications, () => []);
}

export function useShellSummary() {
  return useQuery({ queryKey: SHELL_SUMMARY_KEY, queryFn: getShellSummary, staleTime: 60_000 });
}
