import { Message } from "@/components/form-message";
import ResetPassword from "@/components/pages/auth/ResetPassword";

export default async function ResetPasswordPage(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return <ResetPassword searchParams={searchParams} />;
}
