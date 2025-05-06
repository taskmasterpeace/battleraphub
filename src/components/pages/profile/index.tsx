"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/auth.context";
import { supabase } from "@/utils/supabase/client";
import { DB_TABLES } from "@/config";
import { User } from "@/types";
import Link from "next/link";
import PlatformX from "../../../../public/image/twitter-x.svg";
import Youtube from "../../../../public/image/youtube.svg";
import Instagram from "../../../../public/image/instagram.svg";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CircleUser } from "lucide-react";
import EditProfileForm from "@/components/pages/profile/EditProfileForm";

const Profile = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const [profileData, setProfileData] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProfileData = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from(DB_TABLES.USERS)
        .select("*")
        .eq("id", userId)
        .single();
      if (error) {
        console.error("Error fetching profile data:", error);
        return;
      }
      setProfileData(data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  if (isLoading || !profileData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 md:mb-12 text-center bg-gradient-to-r bg-clip-text">
          Profile
        </h1>
        <div className="w-full max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative group">
              <div className="flex flex-col items-center gap-3">
                <div className="my-2 w-56 h-56 rounded-full overflow-hidden bg-gray-800 animate-pulse">
                  <div className="w-full h-full rounded-full bg-gray-700" />
                </div>
              </div>
            </div>
            <div className="w-full text-center md:text-left space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="text-start">
                  <div className="w-40 h-6 bg-gray-800 rounded animate-pulse mb-2" />
                  <div className="w-52 h-4 bg-gray-800 rounded animate-pulse" />
                </div>
                <div className="w-32 h-10 bg-gray-800 rounded animate-pulse" />
              </div>
              <div className="bg-gray-800/70 text-start p-3 rounded-md min-h-[250px] max-h-[300px] overflow-y-auto"></div>
              <div className="py-4 flex flex-wrap justify-center md:justify-start gap-6">
                <div className="w-32 h-10 bg-gray-800 rounded animate-pulse" />
                <div className="w-32 h-10 bg-gray-800 rounded animate-pulse" />
                <div className="w-32 h-10 bg-gray-800 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isEditing && profileData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 md:mb-12 text-center bg-gradient-to-r bg-clip-text">
          Profile
        </h1>
        <div className="w-full max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative group">
              <div className="flex flex-col items-center gap-3">
                {profileData?.avatar ? (
                  <div
                    className="my-2 w-56 h-56 rounded-full overflow-hidden cursor-pointer"
                    onClick={() => fileRef.current?.click()}
                  >
                    <Image
                      src={profileData?.avatar || ""}
                      alt={profileData?.name}
                      className="relative object-cover rounded-full w-56 h-56"
                      width={180}
                      height={180}
                      unoptimized
                    />
                  </div>
                ) : (
                  <CircleUser className="w-[128px] h-[128px] text-gray-400" />
                )}
              </div>
            </div>
            <div className="w-full text-center md:text-left space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="text-start">
                  <h2 className="text-2xl font-bold capitalize">{profileData?.name}</h2>
                  <Link
                    href={`mailto:${profileData?.email}` || "#"}
                    className="text-gray-400 hover:underline py-3"
                  >
                    {profileData?.email}
                  </Link>
                </div>

                <Button className="text-white px-4 py-2 rounded" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              </div>
              <div className="bg-gray-800/70 text-start p-3 rounded-md max-h-[300px] overflow-y-auto">
                <p className="text-gray-400 leading-relaxed text-sm w-full py-2 md:max-w-[550px]">
                  {profileData?.bio}
                </p>
              </div>
              <div className="py-4 flex flex-wrap justify-center md:justify-start gap-6">
                <Link
                  href={profileData?.instagram || "#"}
                  className="flex border border-gray-700/90 items-center gap-3 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
                >
                  <Image src={Instagram} alt="instagram" width={20} height={20} />
                  <span className="text-gray-300">Instagram</span>
                </Link>
                <Link
                  href={profileData?.twitter || "#"}
                  className="flex border border-gray-700/90 items-center gap-3 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
                >
                  <Image src={PlatformX} alt="twitter" width={16} height={16} />
                  <span className="text-gray-300">Platform X</span>
                </Link>
                <Link
                  href={profileData?.youtube || "#"}
                  className="flex border border-gray-700/90 items-center gap-3 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
                >
                  <Image src={Youtube} alt="youtube" width={20} height={20} />
                  <span className="text-gray-300">Youtube</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center bg-gradient-to-r bg-clip-text">Edit Profile</h1>
      <EditProfileForm
        profileData={profileData}
        setIsEditing={setIsEditing}
        setIsLoading={setIsLoading}
        fetchProfileData={fetchProfileData}
      />
    </div>
  );
};

export default Profile;
