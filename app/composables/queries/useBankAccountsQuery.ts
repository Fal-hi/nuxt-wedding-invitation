import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";

const fetchBankAccounts = async () => {
  const supabase = useSupabase();
  const { data, error } = await supabase
    .from("bank_accounts")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data || [];
};

const fetchBankOptions = async () => {
  const supabase = useSupabase();
  const { data, error } = await supabase
    .from("bank")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return data || [];
};

export const useBankAccountsQuery = () => {
  return useQuery({
    queryKey: ["bank-accounts"],
    queryFn: fetchBankAccounts,
  });
};

export const useBankOptionsQuery = () => {
  return useQuery({
    queryKey: ["bank-options"],
    queryFn: fetchBankOptions,
  });
};

export const useAddBankAccountMutation = () => {
  const queryClient = useQueryClient();
  const supabase = useSupabase();

  return useMutation({
    mutationFn: async (payload: Record<string, any>) => {
      const { error } = await supabase.from("bank_accounts").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank-accounts"] });
    },
  });
};

export const useUpdateBankAccountMutation = () => {
  const queryClient = useQueryClient();
  const supabase = useSupabase();

  return useMutation({
    mutationFn: async ({ id, ...payload }: Record<string, any>) => {
      const { error } = await supabase
        .from("bank_accounts")
        .update(payload)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank-accounts"] });
    },
  });
};

export const useDeleteBankAccountMutation = () => {
  const queryClient = useQueryClient();
  const supabase = useSupabase();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("bank_accounts")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank-accounts"] });
    },
  });
};
