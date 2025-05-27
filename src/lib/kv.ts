import { createClient } from "@vercel/kv";
import { PROMPT_KEY } from "@/config";
// import { battleRapPrompts } from "./static/prompt";

// Initialize KV client with environment variables
const kv = createClient({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
  automaticDeserialization: true,
});

/**
 * Retrieves all battle rap prompts from the KV store.
 * Reconstructs the object to match the shape of `BattleRapPrompts`.
 */
export async function getBattleRapPrompts(): Promise<Record<string, string> | null> {
  try {
    const keys = PROMPT_KEY;
    const result: Record<string, string> = {};

    for (const key of keys) {
      const data = await kv.get<string>(key);

      if (typeof data !== "string") {
        console.warn(`[KV] Invalid or missing prompt for key "${key}". Expected a string.`);
        continue;
      }

      result[key] = data;
    }
    console.log("kv data", result);
    return result;
  } catch (error) {
    console.error("[KV] Error retrieving news prompts:", error);
    return null;
  }
}

export async function getKey(key: string): Promise<string> {
  try {
    const data = await kv.get<string>(key);
    return data || "";
  } catch (error) {
    console.error("[KV] Error retrieving key:", error);
    return "";
  }
}
