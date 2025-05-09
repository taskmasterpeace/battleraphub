import { MediaContent } from "@/types";

// Mock data for media content
const mediaContent: MediaContent[] = [
  {
    id: "1",
    userId: "1",
    title: "Loaded Lux vs Geechi Gotti - Who Really Won?",
    description:
      "Breaking down the highly anticipated battle between Loaded Lux and Geechi Gotti. Who do you think won?",
    url: "https://youtube.com/watch?v=example1",
    type: "video",
    thumbnail: "/placeholder.svg?height=300&width=600&text=Lux+vs+Geechi",
    likes: 1245,
    likedByCurrentUser: false,
    createdAt: "2023-05-15T00:00:00Z",
    updatedAt: "2023-05-15T00:00:00Z",
  },
  {
    id: "2",
    userId: "1",
    title: "Top 5 Performances of the Month",
    description:
      "Ranking the top 5 battle rap performances from the past month. Did your favorite make the list?",
    url: "https://youtube.com/watch?v=example2",
    type: "video",
    thumbnail: "/placeholder.svg?height=300&width=600&text=Top+5+Performances",
    likes: 987,
    likedByCurrentUser: false,
    createdAt: "2023-05-10T00:00:00Z",
    updatedAt: "2023-05-10T00:00:00Z",
  },
  {
    id: "3",
    userId: "1",
    title: "The Evolution of Battle Rap",
    description: "An in-depth article exploring how battle rap has evolved over the past decade.",
    url: "https://champion.example.com/evolution-of-battle-rap",
    type: "article",
    likes: 543,
    likedByCurrentUser: false,
    createdAt: "2023-05-05T00:00:00Z",
    updatedAt: "2023-05-05T00:00:00Z",
  },
];

export async function addUserContent(
  userId: string,
  data: Partial<MediaContent>,
): Promise<MediaContent> {
  // In a real app, this would insert into your database
  const newContent: MediaContent = {
    id: (mediaContent.length + 1).toString(),
    userId,
    title: data.title || "",
    description: data.description || "",
    url: data.url || "",
    type: data.type as "video" | "article" | "podcast",
    thumbnail: data.thumbnail,
    likes: 0,
    likedByCurrentUser: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mediaContent.unshift(newContent);

  return newContent;
}

export async function getUserContent(userId: string): Promise<MediaContent[]> {
  // In a real app, this would query your database
  return mediaContent
    .filter((content) => content.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function likeContent(contentId: string): Promise<void> {
  // In a real app, this would update your database
  const contentIndex = mediaContent.findIndex((c) => c.id === contentId);

  if (contentIndex === -1) {
    throw new Error("Content not found");
  }

  mediaContent[contentIndex] = {
    ...mediaContent[contentIndex],
    likes: mediaContent[contentIndex].likes + 1,
    likedByCurrentUser: true,
  };
}
