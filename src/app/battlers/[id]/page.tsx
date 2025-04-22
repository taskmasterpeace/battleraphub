import BattlerDetails from "@/components/pages/battlers/details";
import { DB_TABLES } from "@/config";
import { protectedCreateClient } from "@/utils/supabase/protected-server";

export default async function BattlerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await protectedCreateClient();
  const { data: badgeData, error } = await supabase.from(DB_TABLES.BADGES).select("*");

  const { data: attributeData, error: attributeError } = await supabase
    .from(DB_TABLES.ATTRIBUTES)
    .select("*");

  if (error) {
    console.error(`Error fetching BadgeError:`, error.message);
    return <div>Error fetching battlers</div>;
  }

  if (attributeError) {
    console.error(`Error fetching AttributeError:`, attributeError.message);
    return <div>Error fetching attributes</div>;
  }

  return <BattlerDetails params={params} badgeData={badgeData} attributeData={attributeData} />;
}
