import csv from "csv-parser";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
);

const attributes = [
  {
    category: "writing",
    name: "Wordplay",
    description: "Clever manipulation of language and double entendres",
  },
  {
    category: "writing",
    name: "Punchlines",
    description: "Impactful lines designed to get reactions",
  },
  { category: "writing", name: "Schemes", description: "Extended metaphors and thematic writing" },
  {
    category: "writing",
    name: "Angles",
    description: "Unique perspectives and approaches to attacking opponents",
  },
  {
    category: "performance",
    name: "Delivery",
    description: "Clarity, timing, and emphasis in speech",
  },
  {
    category: "performance",
    name: "Stage Presence",
    description: "Commanding attention and energy on stage",
  },
  {
    category: "performance",
    name: "Crowd Control",
    description: "Ability to engage and manipulate audience reactions",
  },
  {
    category: "performance",
    name: "Showmanship",
    description: "Entertainment value and performance artistry",
  },
  {
    category: "personal",
    name: "Authenticity",
    description: "Genuineness and believability of content",
  },
  {
    category: "personal",
    name: "Battle IQ",
    description: "Strategic approach and in-battle adaptability",
  },
  {
    category: "personal",
    name: "Preparation",
    description: "Research and battle-specific content",
  },
  {
    category: "personal",
    name: "Consistency",
    description: "Reliability of performance quality across battles",
  },
];

function csvToObjects(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
}

async function importAttributes() {
  const { error } = await supabase.from("attributes").insert(attributes);
  console.log("Error inserting attributes", error);
}

async function importWritingBadges() {
  const filePath = "./src/utils/scripts/data/Battle Rap Experience - Writing Badges.csv";
  const objects = await csvToObjects(filePath);

  const badges = objects.map((object) => ({
    name: object.Badge,
    description: object.Description,
    is_positive: !String(object.Category).toLowerCase().startsWith("neg"),
    category: "writing",
  }));

  const { error } = await supabase.from("badges").insert(badges);
  console.log("Error inserting writing badges", error);
}

async function importPerformanceBadges() {
  const filePath = "./src/utils/scripts/data/Battle Rap Experience - Performance Badges.csv";
  const objects = await csvToObjects(filePath);

  const badges = objects.map((object) => ({
    name: object.Badge,
    description: object.Description,
    is_positive: !String(object.Category).toLowerCase().startsWith("neg"),
    category: "performance",
  }));

  // remove duplicates
  const uniqueBadges = badges.filter(
    (badge, index, self) => index === self.findIndex((t) => t.name === badge.name),
  );

  const { error } = await supabase.from("badges").insert(uniqueBadges);
  console.log("Error inserting performance badges", error);
}

async function importPersonalBadges() {
  const filePath =
    "./src/utils/scripts/data/Battle Rap Experience - Personal Reputation Badges.csv";
  const objects = await csvToObjects(filePath);

  const badges = objects.map((object) => ({
    name: object.Badge,
    description: object.Description,
    is_positive: !String(object.Category).toLowerCase().startsWith("neg"),
    category: "personal",
  }));

  const { error } = await supabase.from("badges").insert(badges);
  console.log("Error inserting personal badges", error);
}

async function main() {
  await importAttributes();
  await importWritingBadges();
  await importPerformanceBadges();
  await importPersonalBadges();
}

main();
