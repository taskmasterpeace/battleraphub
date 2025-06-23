import { NextResponse } from "next/server";
import { NewsAggregatorAgent } from ".";
import { DB_TABLES } from "@/config";
import { protectedCreateClient } from "@/utils/supabase/protected-server";

const xAccounts = [
  "LTBRpodcast",
  "15MofeRadio",
  "hiphopisrealtv",
  "BattleRapTrap",
  "Iam_AWard",
  "MetaphorMessiah",
  "bigGeechiMbb",
  "TheOnlyTayRoc",
  "islandgodverb",
  "Eazyblockcapt",
  "RuinYourDayNow",
  "ChrisUnbias",
  "HitmanHolla",
  "chillajones",
  "foe_tru",
  "JoeyNine3",
  "bigGeechiMbb",
];

// This route is protected by a cron secret, get youtube videos from AlgorithmInstituteofBR channel for home page videos with vercel cron job
export async function GET(request: Request) {
  const supabase = await protectedCreateClient();
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  try {
    const newsAgent = new NewsAggregatorAgent();
    const result = await newsAgent.analyzeTopics(xAccounts);

    // need to updated with result data into this supabase db to add this bellow data with actual result
    const newsItems = result.map((item) => ({
      reading_time: item.reading_time,
      headline: item.headline,
      blurb: item.blurb,
      published_at: new Date(item.published_at as string),
      event_date: new Date(item.event_date as string),
      tags: item.tags,
      main_content: item.main_content,
      created_at: new Date(),
    }));

    const { error } = await supabase.from(DB_TABLES.NEWS_CONTENTS).insert(newsItems);
    if (error) {
      console.error("Error inserting news content into Supabase:", error);
      return NextResponse.json(
        { error: "Failed to insert news content into Supabase" },
        { status: 500 },
      );
    }
    return NextResponse.json({ message: "News updated successfully", result });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
