"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import type { Session, User, AuthResponse } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: (redirectTo?: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<AuthResponse>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get session from Supabase
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    };

    getSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) {
      router.refresh();
    }
    return { error };
  };

  const signUp = async (name: string, email: string, password: string) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });
  };

  // const signUp = async (email: string, password: string, roles: UserRoles) => {
  //   // First create the auth user
  //   const { data, error } = await supabase.auth.signUp({
  //     email,
  //     password,
  //     options: {
  //       data: {
  //         roles: roles,
  //       },
  //     },
  //   })

  //   if (!error && data.user) {
  //     // Create the user profile with roles
  //     const { error: profileError } = await supabase.from("user_profiles").insert({
  //       id: data.user.id,
  //       email: data.user.email,
  //       displayName: email.split("@")[0],
  //       roles: roles,
  //       verified: false,
  //       createdAt: new Date().toISOString(),
  //     })

  //     if (profileError) {
  //       console.error("Error creating user profile:", profileError)
  //     }
  //   }

  //   return { data, error }
  // }

  const signInWithGoogle = async (redirectTo?: string) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectTo
            ? `${window.location.origin}${redirectTo}`
            : `${window.location.origin}/`,
        },
      });

      if (error) {
        console.error("Error signing in with Google:", error);
        throw error;
      }
    } catch (error) {
      console.error("Exception during Google sign-in:", error);
      throw error;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
