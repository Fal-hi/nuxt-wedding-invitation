import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";
import crypto from "crypto";

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
    .select("id, password")
    .eq("username", username)
    .maybeSingle();

  if (!data || error) {
    return { success: false };
  }

  const isPasswordValid = await bcrypt.compare(password, data.password);

  if (!isPasswordValid) {
    return { success: false };
  }

  const rawToken = crypto.randomUUID();

  const hashedToken = await bcrypt.hash(rawToken, 10);

  const { error: updateError } = await supabase
    .from("admin_users")
    .update({ login_token: hashedToken })
    .eq("id", data.id);

  if (updateError) {
    return { success: false };
  }

  return { success: true, token: rawToken };
});
