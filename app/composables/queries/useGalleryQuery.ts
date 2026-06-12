import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";

const fetchGallery = async () => {
  const supabase = useSupabase();
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data || [];
};

export const useGalleryQuery = () => {
  return useQuery({
    queryKey: ["gallery"],
    queryFn: fetchGallery,
  });
};

export const useAddGalleryMutation = () => {
  const queryClient = useQueryClient();
  const supabase = useSupabase();

  return useMutation({
    mutationFn: async (payload: {
      image_url: string;
      alt_text: string;
      sort_order: number;
    }) => {
      const { error } = await supabase.from("gallery").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
  });
};

export const useDeleteGalleryMutation = () => {
  const queryClient = useQueryClient();
  const supabase = useSupabase();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("gallery").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
  });
};
