import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";

const fetchWeddingInfo = async () => {
  const supabase = useSupabase();
  const { data, error } = await supabase
    .from("wedding_info")
    .select("*")
    .eq("id", 1)
    .single();
  if (error) throw error;
  return data;
};

export const useWeddingInfoQuery = () => {
  return useQuery({
    queryKey: ["wedding-info"],
    queryFn: fetchWeddingInfo,
  });
};

export const useWeddingInfoMutation = () => {
  const queryClient = useQueryClient();
  const supabase = useSupabase();

  return useMutation({
    mutationFn: async (payload: Record<string, any>) => {
      const { error } = await supabase
        .from("wedding_info")
        .update(payload)
        .eq("id", 1);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wedding-info"] });
    },
  });
};
