export interface Item {
  kind: string;
  etag: string;
  id: ID;
  snippet: Snippet;
}

export interface ID {
  kind: string;
  videoId: string;
}

export interface Snippet {
  publishedAt: Date;
  channelId: string;
  title: string;
  description: string;
  thumbnails: Thumbnails;
  channelTitle: string;
  liveBroadcastContent: string;
  publishTime: Date;
}

export interface Thumbnails {
  default: Default;
  medium: Default;
  high: Default;
}

export interface Default {
  url: string;
  width: number;
  height: number;
}

export interface Video {
  title: string;
  videoId: string;
  thumbnail: string;
  order: number;
  channelId?: string;
  id: string;
  description?: string;
  publishedAt?: string;
  views?: number;
  likes?: number;
  comments?: number;
  tag?: "latest" | "popular";
}

export interface VideoStatistics {
  viewCount?: string;
  likeCount?: string;
  commentCount?: string;
}
