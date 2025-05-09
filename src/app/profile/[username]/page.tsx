import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, User, Video, Youtube } from "lucide-react";
import UserProfileHeader from "@/components/pages/profile/UserProfileHeader";
import UserRatingsSection from "@/components/pages/profile/UserRatingsSection";
import UserBadgesSection from "@/components/pages/profile/UserBadgesSection";
import SocialLinksSection from "@/components/pages/profile/SocialLinksSection";
import { getUserByUsername } from "@/app/actions";
import YouTubeVideoSection from "@/components/pages/profile/YoutubeVideoSection";
import { ROLE } from "@/config";
import MediaContentSection from "@/components/pages/profile/MediaContentSection";

type UserProfileParams = Promise<{ username: string }>;

export default async function UserProfilePage({ params }: { params: UserProfileParams }) {
  const { username } = await params;
  const userDetails = await getUserByUsername(username);

  if (!userDetails) {
    notFound();
  }

  const isMediaUser = userDetails.role_id === ROLE.MEDIA;

  return (
    <div className="container mx-auto px-4 py-8">
      <UserProfileHeader user={userDetails} />
      <Tabs defaultValue="about" className="mt-12">
        <TabsList className="mb-6">
          {isMediaUser && (
            <>
              <TabsTrigger value="videos">
                <Youtube className="h-4 w-4 mr-2" />
                YouTube Videos
              </TabsTrigger>

              <TabsTrigger value="content">
                <Video className="h-4 w-4 mr-2" />
                Media Content
              </TabsTrigger>
            </>
          )}

          <TabsTrigger value="ratings">
            <Trophy className="h-4 w-4 mr-2" />
            Ratings
          </TabsTrigger>

          <TabsTrigger value="badges">
            <Trophy className="h-4 w-4 mr-2" />
            Badges
          </TabsTrigger>

          <TabsTrigger value="about">
            <User className="h-4 w-4 mr-2" />
            About
          </TabsTrigger>
        </TabsList>

        {isMediaUser && (
          <>
            <TabsContent value="videos">
              <YouTubeVideoSection youtubeHandleUrl={userDetails?.youtube} />
            </TabsContent>

            <TabsContent value="content">
              <MediaContentSection userId={userDetails.id} username={username} />
            </TabsContent>
          </>
        )}

        <TabsContent value="ratings">
          <UserRatingsSection userId={userDetails.id} />
        </TabsContent>

        <TabsContent value="badges">
          <UserBadgesSection userId={userDetails.id} />
        </TabsContent>

        <TabsContent value="about">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-background rounded-lg p-6 border border-border">
                <h3 className="text-xl font-semibold mb-4">About</h3>
                <p className="text-muted-foreground">{userDetails.bio || "No bio provided."}</p>
              </div>
            </div>

            <div>
              <SocialLinksSection user={userDetails} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
