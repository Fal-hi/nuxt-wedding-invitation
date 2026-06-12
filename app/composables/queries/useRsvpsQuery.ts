import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";

const fetchRsvps = async () => {
  const supabase = useSupabase();
  const { data, error } = await supabase
    .from("rsvps")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
};

export const useRsvpsQuery = () => {
  return useQuery({
    queryKey: ["rsvps"],
    queryFn: fetchRsvps,
  });
};

export const useDeleteRsvpMutation = () => {
  const queryClient = useQueryClient();
  const supabase = useSupabase();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("rsvps").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rsvps"] });
    },
  });
};
