import { SupabaseClient, User } from "@supabase/supabase-js";
import { DB_TABLES } from "@/config";

const createUser = async (data: User, client: SupabaseClient) => {
  return await client.from(DB_TABLES.USERS).insert({
    auth_id: data.id,
    name: data.user_metadata.name,
    email: data.email,
    ...(data.user_metadata.avatar_url && { avatar_url: data.user_metadata.avatar_url }),
  });
};

export { createUser };
