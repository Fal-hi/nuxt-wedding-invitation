import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";

const fetchGuestList = async () => {
  const supabase = useSupabase();
  const { data, error } = await supabase
    .from("guest_list")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
};

export const useGuestListQuery = () => {
  return useQuery({
    queryKey: ["guest-list"],
    queryFn: fetchGuestList,
  });
};

const fetchWeddingNicknames = async () => {
  const supabase = useSupabase();
  const { data } = await supabase
    .from("wedding_info")
    .select("bride_nickname, groom_nickname")
    .maybeSingle();
  return data || { bride_nickname: "", groom_nickname: "" };
};

export const useWeddingNicknames = () => {
  return useQuery({
    queryKey: ["wedding-info", "nicknames"],
    queryFn: fetchWeddingNicknames,
  });
};

export const useAddGuestMutation = () => {
  const queryClient = useQueryClient();
  const supabase = useSupabase();

  return useMutation({
    mutationFn: async (payload: Record<string, any>) => {
      const { error } = await supabase.from("guest_list").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guest-list"] });
    },
  });
};

export const useUpdateGuestMutation = () => {
  const queryClient = useQueryClient();
  const supabase = useSupabase();

  return useMutation({
    mutationFn: async ({ id, ...payload }: Record<string, any>) => {
      const { error } = await supabase
        .from("guest_list")
        .update(payload)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guest-list"] });
    },
  });
};

export const useDeleteGuestMutation = () => {
  const queryClient = useQueryClient();
  const supabase = useSupabase();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("guest_list")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guest-list"] });
    },
  });
};

export const useSendWhatsAppMutation = () => {
  const queryClient = useQueryClient();
  const supabase = useSupabase();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("guest_list")
        .update({
          invitation_sent: true,
          sent_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guest-list"] });
    },
  });
};
