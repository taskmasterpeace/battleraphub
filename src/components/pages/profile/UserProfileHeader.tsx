"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, MapPin, Calendar, ExternalLink } from "lucide-react";
import { User } from "@/types";
import { useAuth } from "@/contexts/auth.context";
import EditProfileDialog from "@/components/pages/profile/EditProfileDialog";
import { ROLE } from "@/config";

interface UserProfileHeaderProps {
  user: User;
}

export default function UserProfileHeader({ user }: UserProfileHeaderProps) {
  const { user: currentUser } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const isOwnProfile = currentUser?.id === user.id;

  // Get role badges
  const getRoleBadges = () => {
    const badges = [];

    if (user.role_id === ROLE.ADMIN)
      badges.push({
        label: "Admin",
        color:
          "bg-destructive-foreground dark:bg-destructive/10 text-destructive border-destructive",
      });
    if (user?.role_id === ROLE.MEDIA) badges.push({ label: "Media", color: "text-foreground" });
    if (user?.role_id === ROLE.BATTLE)
      badges.push({
        label: "Battler",
        color: "bg-success-foreground dark:bg-success/20 text-success border-success",
      });
    if (user.role_id === ROLE.LEAGUE_OWNER_INVESTOR)
      badges.push({
        label: "League Owner",
        color: "bg-amber-900/30 text-amber-400 border-amber-700",
      });
    if (badges.length === 0 || user.role_id === ROLE.FAN)
      badges.push({ label: "Fan", color: "bg-blue-900/30 text-blue-400 border-blue-700" });

    return badges;
  };

  return (
    <div className="relative">
      {/* Banner */}
      <div className="h-48 md:h-64 rounded-xl overflow-hidden relative">
        <Image
          src={user.image || "/placeholder.svg?height=200&width=1200"}
          alt={`${user.name}'s banner`}
          width={1200}
          height={200}
          className="h-full w-full object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent"></div>
      </div>

      {/* Profile info */}
      <div className="relative -mt-20 px-4 md:px-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Avatar */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-border relative">
            <Image
              src={user.avatar || "/placeholder.svg?height=400&width=400"}
              alt={user.name || "profile-avatar"}
              width={152}
              height={152}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{user.name}</h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  {getRoleBadges().map((badge, index) => (
                    <Badge key={index} className={badge.color}>
                      {badge.label}
                    </Badge>
                  ))}
                  {user.verified && (
                    <Badge className="bg-muted hover:bg-background text-foreground">Verified</Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                  {user.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {user.location}
                    </div>
                  )}
                  {user.created_at && (
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Joined {new Date(user.created_at).toLocaleDateString("en-US")}
                    </div>
                  )}
                  {user.website && (
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:text-muted-foreground"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Website
                    </a>
                  )}
                </div>
              </div>

              {isOwnProfile && (
                <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {isOwnProfile && (
        <EditProfileDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} user={user} />
      )}
    </div>
  );
}
