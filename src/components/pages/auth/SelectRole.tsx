"use client";

import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useState } from "react";
import RoleSelector from "./RoleSelector";
import Image from "next/image";
import { ROLE } from "@/config";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function SelectRole() {
  const [role, setRole] = useState<number>(ROLE.FAN);
  const router = useRouter();

  const handleRoleChange = (role: number) => {
    setRole(role);
  };

  const handleSubmit = async () => {
    try {
      const supabase = await createClient();
      // Update user role in metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          role: role,
        },
      });

      if (error) {
        throw error;
      }

      // Refresh the token to get the latest role
      await supabase.auth.getSession();
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1ahq-LogoshiRes-enhance-3.4x.png-RgnWSrnet4mLXiyHJq8wddQ1bMJ8Wr.jpeg"
              alt="Algorithm Institute of Battle Rap"
              width={180}
              height={45}
              className="object-contain"
              priority
              style={{ maxHeight: "45px" }}
            />
          </div>
          <CardTitle className="text-2xl text-center">Select Your Role</CardTitle>
          <CardDescription className="text-center">
            {"Tell us about your role in the battle rap community"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RoleSelector role={role} onChange={handleRoleChange} />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          {/* Continue button */}
          <Button className="w-full" onClick={handleSubmit}>
            Continue
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
