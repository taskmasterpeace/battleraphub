import { Message } from "@/components/form-message";
import BattlersListTable from "@/components/pages/battlers/admin-table/BattlersListTable";

export default async function BattlersAdminPage(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return <BattlersListTable searchParams={searchParams} />;
}
