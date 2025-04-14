"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth.context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import GoogleButton from "@/components/pages/auth/GoogleButton";

import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { createUser } from "./index";
import { User } from "@supabase/supabase-js";
export default function Signup() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const { data, error } = await signUp(name, email, password);
      if (error) {
        setError(error.message);
      } else {
        // Clear form
        setEmail("");
        setName("");
        setPassword("");
        setConfirmPassword("");

        const supabase = await createClient();
        const { error: createUserError } = await createUser(data.user as User, supabase);

        if (createUserError) {
          setError(createUserError.message);
        } else {
          setSuccess("Registration successful! Please check your email to confirm your account.");
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during registration");
      }
    } finally {
      setIsLoading(false);
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
          <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
          <CardDescription className="text-center">
            {"Sign up to rate and analyze battle rap performances"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm bg-red-900/30 border border-red-800 text-red-400 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 text-sm bg-green-900/30 border border-green-800 text-green-400 rounded-md">
              {success}
            </div>
          )}

          <GoogleButton />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-700"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-gray-400">Password must be at least 8 characters long</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Signing up..." : "Continue"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <p className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-purple-400 hover:text-purple-300">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
