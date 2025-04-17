import Battlers from "@/components/pages/battlers";
import { DB_TABLES } from "@/config";
import { TagsOption } from "@/types";
import { createClient } from "@/utils/supabase/server";

export default async function BattlersPage() {
  const supabase = await createClient();
  const { data: tags, error } = await supabase.from(DB_TABLES.TAGS).select("id, name");
  if (error) {
    console.error("Error fetching battlers:", error);
    return <div>Error fetching battlers</div>;
  }
  return <Battlers tags={tags as TagsOption[]} />;
}
