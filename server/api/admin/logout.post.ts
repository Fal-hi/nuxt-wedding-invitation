import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event).catch(() => ({}));
  const token = body?.token || getCookie(event, "admin_auth");

  if (!token) {
    return { success: true };
  }

  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceKey,
  );

  const { error } = await supabase
    .from("admin_users")
    .update({ login_token: null })
    .eq("login_token", token);

  if (error) {
    return { success: false };
  }

  deleteCookie(event, "admin_auth", {
    path: "/",
  });

  return { success: true };
});
