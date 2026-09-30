import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/** Standard query/mutation lifecycle for every Masters domain. */
export function createMastersHooks(domain, api) {
  const key = ["masters", domain];
  function useList() {
    return useQuery({ queryKey: key, queryFn: api.list });
  }
  function useChangedMutation(mutationFn) {
    const client = useQueryClient();
    return useMutation({
      mutationFn,
      onSuccess: () => {
        client.invalidateQueries({ queryKey: ["masters"] });
        client.invalidateQueries({ queryKey: ["dashboard"] });
      },
    });
  }
  return {
    useList,
    useSave: () => useChangedMutation(api.save),
    useDelete: () => useChangedMutation(api.remove),
    useStatus: () => useChangedMutation(api.setStatus),
  };
}
