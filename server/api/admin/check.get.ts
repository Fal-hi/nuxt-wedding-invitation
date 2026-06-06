import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const cookieToken = getCookie(event, "admin_auth");

  if (!cookieToken) {
    return { authenticated: false };
  }

  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceKey,
  );

  const { data } = await supabase
    .from("admin_users")
    .select("id, login_token")
    .not("login_token", "is", null)
    .maybeSingle();

  if (!data?.login_token) {
    return { authenticated: false };
  }

  const isValid = await bcrypt.compare(cookieToken, data.login_token);

  return { authenticated: isValid };
});
