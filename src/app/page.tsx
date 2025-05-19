import HomePage from "@/components/pages/home";
import { HomeProvider } from "@/contexts/home.context";

export default async function Home() {
  return (
    <HomeProvider>
      <HomePage />
    </HomeProvider>
  );
}
