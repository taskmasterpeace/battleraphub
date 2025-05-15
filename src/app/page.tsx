import HomePage from "@/components/pages/home";
import { DB_TABLES, ROLE } from "@/config";
import { HomeProvider } from "@/contexts/home.context";
import { protectedCreateClient } from "@/utils/supabase/protected-server";

export default async function Home() {
  const supabase = await protectedCreateClient();
  const { data: usersData, error: usersError } = await supabase
    .from(DB_TABLES.USERS)
    .select("*")
    .limit(3)
    .eq("role_id", ROLE.MEDIA);

  if (usersError) {
    console.error(`Error fetching usersError:`, usersError.message);
    return <div>Error fetching users</div>;
  }

  return (
    <HomeProvider>
      <HomePage usersData={usersData} />
    </HomeProvider>
  );
}
