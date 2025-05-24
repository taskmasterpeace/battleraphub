import { createClient } from "@vercel/kv";
import { PROMPT_KEY } from "@/config";
// import { battleRapPrompts } from "./static/prompt";

// Initialize KV client with environment variables
const kv = createClient({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
  automaticDeserialization: true,
});

// Define the type of the prompt object
// export type BattleRapPrompts = typeof battleRapPrompts;

// Extract keys of battleRapPrompts as an array of its keys
// const PROMPT_KEYS = Object.keys(battleRapPrompts) as (keyof BattleRapPrompts)[];

/**
 * Stores each battle rap prompt in the KV store.
 * Overwrites existing keys with new data from the local `battleRapPrompts` object.
 */
// export async function storePrompts(): Promise<void> {
//   for (const key of PROMPT_KEYS) {
//     const kvKey = `news:${key}`; // Prefix the key with "news:"
//     const newPrompt = battleRapPrompts[key];

//     try {
//       await kv.set(kvKey, newPrompt);
//       console.info(`[KV] Prompt "${kvKey}" successfully stored.`);
//     } catch (error) {
//       console.error(`[KV] Failed to store prompt "${kvKey}":`, error);
//     }
//   }
// }

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

    console.info("[KV] News prompts successfully retrieved.");
    console.log("kv data", result);
    return result;
  } catch (error) {
    console.error("[KV] Error retrieving news prompts:", error);
    return null;
  }
}
