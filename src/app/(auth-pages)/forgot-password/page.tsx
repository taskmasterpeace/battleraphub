import { Message } from "@/components/form-message";
import ForgotPassword from "@/components/pages/auth/ForgotPassword";

export default async function ForgotPasswordPage(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return <ForgotPassword searchParams={searchParams} />;
}
