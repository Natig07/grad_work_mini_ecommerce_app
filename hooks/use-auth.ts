"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import type { AuthUser } from "@/types/auth";

const isSupabaseConfigured = () => {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setIsLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            fullName: session.user.user_metadata?.full_name || "",
          });
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || "",
          fullName: session.user.user_metadata?.full_name || "",
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, fullName: string) => {
      if (!isSupabaseConfigured()) {
        console.error("Supabase not configured");
        return new Error("Authentication not available");
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });
      return error;
    },
    [],
  );

  const signIn = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      console.error("Supabase not configured");
      return new Error("Authentication not available");
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return error;
  }, []);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setUser(null);
      return;
    }

    await supabase.auth.signOut();
    setUser(null);
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
  };
}
