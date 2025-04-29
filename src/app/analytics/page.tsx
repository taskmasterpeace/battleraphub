import React from "react";
import AnalyticsContentPage from "@/components/pages/analytics";
import { protectedCreateClient } from "@/utils/supabase/protected-server";
import { DB_TABLES } from "@/config";
import { AnalyticsProvider } from "@/contexts/analytics.context";

const AnalyticsPage = async () => {
  const supabase = await protectedCreateClient();

  const { data: attributeData, error: attributeError } = await supabase
    .from(DB_TABLES.ATTRIBUTES)
    .select("*");

  if (attributeError) {
    console.error(`Error fetching AttributeError:`, attributeError.message);
    return <div>Error fetching attributes</div>;
  }
  return (
    <AnalyticsProvider>
      <AnalyticsContentPage attributeData={attributeData} />
    </AnalyticsProvider>
  );
};

export default AnalyticsPage;
