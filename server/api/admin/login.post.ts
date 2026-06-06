import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { username, password } = await readBody(event);

  if (!username || !password) {
    return { success: false };
  }

  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceKey,
  );

  const { data, error } = await supabase
    .from("admin_users")
    .select("id")
    .eq("username", username)
    .eq("password", password)
    .maybeSingle();

  if (!data || error) {
    return { success: false };
  }

  const token = crypto.randomUUID();

  const { error: updateError } = await supabase
    .from("admin_users")
    .update({ login_token: token })
    .eq("id", data.id);

  if (updateError) {
    return { success: false };
  }

  return { success: true, token };
});
