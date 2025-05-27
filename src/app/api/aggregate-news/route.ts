import { NextResponse } from "next/server";
import { NewsAggregatorAgent } from ".";

const xAccounts = ["urltv", "KingOfTheDot"];

// This route is protected by a cron secret, get youtube videos from AlgorithmInstituteofBR channel for home page videos with vercel cron job
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  try {
    const newsAgent = new NewsAggregatorAgent();
    const result = await newsAgent.analyzeTopics(xAccounts);
    console.log("Result", result);
    return NextResponse.json({ message: "Videos updated successfully", result });
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return NextResponse.json({ error: "Failed to fetch YouTube videos" }, { status: 500 });
  }
}
