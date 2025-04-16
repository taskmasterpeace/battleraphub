import { createClient } from "@supabase/supabase-js";

export const protectedCreateClient = async () => {
  console.log(process.env.SERVICE_ROLE_KEY);
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SERVICE_ROLE_KEY!);
};
