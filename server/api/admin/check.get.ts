import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const token = getCookie(event, "admin_auth");

  if (!token) {
    return { authenticated: false };
  }

  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceKey,
  );

  const { data, error } = await supabase
    .from("admin_users")
    .select("id")
    .eq("login_token", token)
    .maybeSingle();

  if (!data || error) {
    return { authenticated: false };
  }

  return { authenticated: true };
});
