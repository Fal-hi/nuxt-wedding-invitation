import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";

const fetchWishes = async () => {
  const supabase = useSupabase();
  const { data, error } = await supabase
    .from("wishes")
    .select("*")
    .order("id", { ascending: false });
  if (error) throw error;
  return data || [];
};

export const useWishesQuery = () => {
  return useQuery({
    queryKey: ["wishes"],
    queryFn: fetchWishes,
  });
};

export const useDeleteWishMutation = () => {
  const queryClient = useQueryClient();
  const supabase = useSupabase();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("wishes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishes"] });
    },
  });
};
