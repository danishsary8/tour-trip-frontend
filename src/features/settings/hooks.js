import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSettings, saveSettings } from "./api";

const SETTINGS_KEY = ["settings"];

export function useSettings() {
  return useQuery({ queryKey: SETTINGS_KEY, queryFn: getSettings, staleTime: Infinity });
}

export function useSaveSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveSettings,
    onSuccess: (settings) => queryClient.setQueryData(SETTINGS_KEY, settings),
  });
}
