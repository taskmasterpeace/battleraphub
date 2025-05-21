import BattlerDetails from "@/components/pages/battlers/details";
import { BattlerProvider } from "@/contexts/battler.context";
import { DB_TABLES } from "@/config";
import { protectedCreateClient } from "@/utils/supabase/protected-server";

export default async function BattlerDetailPage() {
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

  return (
    <BattlerProvider badgeData={badgeData} attributeData={attributeData}>
      <BattlerDetails />
    </BattlerProvider>
  );
}
