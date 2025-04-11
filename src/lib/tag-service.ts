"use client";

// Types for tags
export interface Tag {
  id: string;
  name: string;
  description?: string;
  isHidden: boolean;
  category?: string;
  createdAt: Date;
}

// Get tags from localStorage or initialize with defaults
export function getTags(): Tag[] {
  if (typeof window === "undefined") return [];

  const storedTags = localStorage.getItem("mockTags");
  if (storedTags) {
    return JSON.parse(storedTags);
  }

  // Default tags if none exist
  const defaultTags: Tag[] = [
    {
      id: "1",
      name: "URL",
      description: "Ultimate Rap League",
      isHidden: false,
      category: "League",
      createdAt: new Date(),
    },
    {
      id: "2",
      name: "East Coast",
      description: "Battlers from the East Coast",
      isHidden: false,
      category: "Region",
      createdAt: new Date(),
    },
    {
      id: "3",
      name: "West Coast",
      description: "Battlers from the West Coast",
      isHidden: false,
      category: "Region",
      createdAt: new Date(),
    },
    {
      id: "4",
      name: "Veteran",
      description: "Experienced battlers",
      isHidden: false,
      category: "Experience",
      createdAt: new Date(),
    },
    {
      id: "5",
      name: "Puncher",
      description: "Known for punchlines",
      isHidden: false,
      category: "Style",
      createdAt: new Date(),
    },
    {
      id: "6",
      name: "Lyricist",
      description: "Known for lyrical ability",
      isHidden: false,
      category: "Style",
      createdAt: new Date(),
    },
    {
      id: "7",
      name: "Performance",
      description: "Known for performance",
      isHidden: false,
      category: "Style",
      createdAt: new Date(),
    },
    {
      id: "8",
      name: "Technical",
      description: "Technical rappers",
      isHidden: false,
      category: "Style",
      createdAt: new Date(),
    },
    {
      id: "9",
      name: "lady",
      description: "Female battlers",
      isHidden: true,
      category: "Gender",
      createdAt: new Date(),
    },
    {
      id: "10",
      name: "international",
      description: "Non-US battlers",
      isHidden: true,
      category: "Region",
      createdAt: new Date(),
    },
    {
      id: "11",
      name: "UK",
      description: "United Kingdom battlers",
      isHidden: false,
      category: "Region",
      createdAt: new Date(),
    },
    {
      id: "12",
      name: "QOTR",
      description: "Queen of the Ring",
      isHidden: false,
      category: "League",
      createdAt: new Date(),
    },
    {
      id: "13",
      name: "Don't Flop",
      description: "UK battle league",
      isHidden: false,
      category: "League",
      createdAt: new Date(),
    },
    {
      id: "14",
      name: "Street",
      description: "Street-oriented content",
      isHidden: false,
      category: "Style",
      createdAt: new Date(),
    },
  ];

  localStorage.setItem("mockTags", JSON.stringify(defaultTags));
  return defaultTags;
}

// Save tags to localStorage
export function saveTags(tags: Tag[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("mockTags", JSON.stringify(tags));
}

// Add a new tag
export function addTag(tag: Omit<Tag, "id" | "createdAt">): Tag {
  const tags = getTags();
  const newTag: Tag = {
    ...tag,
    id: Math.random().toString(36).substring(2, 9),
    createdAt: new Date(),
  };

  tags.push(newTag);
  saveTags(tags);
  return newTag;
}

// Update an existing tag
export function updateTag(id: string, updates: Partial<Omit<Tag, "id" | "createdAt">>): Tag | null {
  const tags = getTags();
  const index = tags.findIndex((tag) => tag.id === id);

  if (index === -1) return null;

  tags[index] = { ...tags[index], ...updates };
  saveTags(tags);
  return tags[index];
}

// Delete a tag
export function deleteTag(id: string): boolean {
  const tags = getTags();
  const filteredTags = tags.filter((tag) => tag.id !== id);

  if (filteredTags.length === tags.length) return false;

  saveTags(filteredTags);
  return true;
}

// Get tag categories
export function getTagCategories(): string[] {
  const tags = getTags();
  const categories = new Set<string>();

  tags.forEach((tag) => {
    if (tag.category) {
      categories.add(tag.category);
    }
  });

  return Array.from(categories).sort();
}
