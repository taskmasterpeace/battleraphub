import NewsTools from "@/components/pages/admin/news-tools";
import { getBattleRapPrompts } from "@/lib/kv";

const NewsToolsPage = async () => {
  const prompts = (await getBattleRapPrompts()) as Record<string, string>;
  return (
    <div>
      <NewsTools prompts={prompts} />
    </div>
  );
};

export default NewsToolsPage;
