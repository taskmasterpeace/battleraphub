"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, ExternalLink, Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/auth.context";
import { MediaContent, User } from "@/types";
import { deleteContentAction, getUserContentAction } from "@/app/actions";
import FormContentDialog from "@/components/pages/profile/FormContentDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

interface MediaContentSectionProps {
  userDetails: User;
}

export default function MediaContentSection({ userDetails }: MediaContentSectionProps) {
  const { user: currentUser } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [content, setContent] = useState<MediaContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const isOwnProfile = currentUser?.id === userDetails?.id;

  const fetchContent = useCallback(async () => {
    try {
      const data = await getUserContentAction(userDetails?.id);
      setContent(data);
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userDetails]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // const handleLike = async (contentId: string) => {
  //   if (!currentUser) return;

  //   try {
  //     await likeContent(contentId);

  //     // Update local state
  //     setContent((prev) =>
  //       prev.map((item) => {
  //         if (item.id === contentId) {
  //           return {
  //             ...item,
  //             likes: item.likes + 1,
  //             likedByCurrentUser: true,
  //           };
  //         }
  //         return item;
  //       }),
  //     );
  //   } catch (error) {
  //     console.error("Error liking content:", error);
  //   }
  // };

  const filteredContent =
    activeTab === "all" ? content : content.filter((item) => item.type === activeTab);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Media Content</h2>
        {isOwnProfile && (
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Content
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
          <TabsTrigger value="article">Articles</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-0 h-48 bg-muted animate-pulse"></CardContent>
            </Card>
          ))}
        </div>
      ) : filteredContent.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {isOwnProfile
            ? "You haven't added any content yet. Click 'Add Content' to get started."
            : `${userDetails?.name} hasn't added any content yet.`}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredContent.map((item, index) => (
            <ContentCard
              key={index}
              content={item}
              isOwner={isOwnProfile}
              fetchContent={fetchContent}
              // onLike={handleLike}
            />
          ))}
        </div>
      )}

      {isOwnProfile && (
        <FormContentDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          userId={userDetails?.id}
          fetchContent={fetchContent}
          isContentCreate={true}
        />
      )}
    </div>
  );
}

interface ContentCardProps {
  content: MediaContent;
  isOwner: boolean;
  fetchContent: () => void;
  // onLike: (contentId: string) => void;
}

function ContentCard({
  content,
  isOwner,
  fetchContent,
  // onLike
}: ContentCardProps) {
  // const { user } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);

  const handleContentDelete = async (contentId: string) => {
    try {
      await deleteContentAction(contentId);
      fetchContent();
      setIsOpenDelete(false);
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "video":
        return "bg-destructive text-destructive-foreground border-destructive";
      case "article":
        return "bg-blue-900/30 text-blue-400 border-blue-700";
      default:
        return "bg-background text-muted-foreground border-border";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <Card className="bg-background border-border overflow-hidden hover:border-amber-500 transition-all">
      <CardContent className="p-0">
        <div className="flex flex-col">
          {content.thumbnail_img && (
            <div className="relative h-48 w-full">
              <Image
                src={content.thumbnail_img || "/placeholder.svg"}
                alt={content.title}
                fill
                className="object-cover"
              />
              <Badge className={`absolute top-2 right-2 ${getTypeColor(content.type)}`}>
                {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
              </Badge>
              {isOwner && (
                <div className="absolute top-2 left-2 flex gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setIsEditOpen(true)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Dialog open={isOpenDelete} onOpenChange={setIsOpenDelete}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogDescription>
                          {`Are you sure you want to delete this ${content.type} content?`}
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          type="submit"
                          onClick={() => setIsOpenDelete(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          type="submit"
                          onClick={() => handleContentDelete(content.id)}
                        >
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
              {isEditOpen && (
                <FormContentDialog
                  open={isEditOpen}
                  fetchContent={fetchContent}
                  onOpenChange={setIsEditOpen}
                  contentData={content}
                />
              )}
            </div>
          )}

          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">{content.title}</h3>
            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{content.description}</p>

            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(content.created_at)}
              </div>

              <div className="flex gap-2">
                {/* <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center gap-1 ${content.likedByCurrentUser ? "text-amber-400" : "text-muted-foreground hover:text-amber-400"}`}
                  onClick={() => !content.likedByCurrentUser && onLike(content.id)}
                  disabled={!user || content.likedByCurrentUser}
                >
                  <ThumbsUp className="w-4 h-4" />
                  {content.likes}
                </Button> */}

                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-muted-foreground"
                >
                  <a href={content.link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    View
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
