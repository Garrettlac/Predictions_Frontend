"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface UserMetadata {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  birthday: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, metadata: UserMetadata) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (emailOrUsername: string, password: string) => {
    let email = emailOrUsername;

    // Check if input is a username (doesn't contain @)
    if (!emailOrUsername.includes('@')) {
      // Look up email by username
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', emailOrUsername)
        .single();

      if (profileError || !profileData) {
        return { success: false, error: 'Username not found' };
      }

      email = profileData.email;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  const signUp = async (email: string, password: string, metadata: UserMetadata) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Create profile entry if user was created
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: metadata.email,
          username: metadata.username,
          first_name: metadata.firstName,
          last_name: metadata.lastName,
          birthday: metadata.birthday,
        });

      if (profileError) {
        return { success: false, error: profileError.message };
      }
    }

    return { success: true };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated: !!user, 
      user, 
      signIn, 
      signUp,
      signOut,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
