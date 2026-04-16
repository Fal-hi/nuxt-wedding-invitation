import { createClient } from "@supabase/supabase-js";

let supabaseInstance: any = null;

export const useSupabase = () => {
  if (!supabaseInstance) {
    const config = useRuntimeConfig();
    const supabaseUrl = config.public.supabaseUrl;
    const supabaseKey = config.public.supabaseKey;

    if (!supabaseUrl || !supabaseKey) {
      console.warn(
        "Supabase credentials not found. Make sure to set SUPABASE_URL and SUPABASE_KEY in .env",
      );
    }

    supabaseInstance = createClient(supabaseUrl as string, supabaseKey as string);
  }

  return supabaseInstance;
};
