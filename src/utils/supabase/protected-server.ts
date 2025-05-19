import { createClient } from "@supabase/supabase-js";

export const protectedCreateClient = async () => {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SERVICE_ROLE_KEY!);
};
