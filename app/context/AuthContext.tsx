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

  console.log('[AuthProvider] Render:', { user: !!user, userId: user?.id, loading });

  useEffect(() => {
    console.log('[AuthProvider] Initializing auth...');
    
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('[AuthProvider] Session check:', { hasSession: !!session, userId: session?.user?.id, email: session?.user?.email, error });
        
        // If we have a session, validate the user still exists
        if (session?.user) {
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', session.user.id)
            .single();
          
          // If user doesn't exist in database (deleted account), clear the session
          if (userError || !userData) {
            console.log('[AuthProvider] User not found in profiles, clearing session:', { userError });
            await supabase.auth.signOut();
            localStorage.clear();
            sessionStorage.clear();
            setUser(null);
            setLoading(false);
            return;
          }
        }
        
        console.log('[AuthProvider] Setting user:', { hasUser: !!session?.user, userId: session?.user?.id });
        setUser(session?.user ?? null);
        setLoading(false);
      } catch (error) {
        console.error('[AuthProvider] Error initializing auth:', error);
        // On error, clear everything to be safe
        await supabase.auth.signOut();
        localStorage.clear();
        sessionStorage.clear();
        setUser(null);
        setLoading(false);
      }
    };
    
    initializeAuth();

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Only update state if it's a meaningful change
      if (event === 'SIGNED_OUT' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null);
      }
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
      // Better error messages for common cases
      if (error.message.includes('already registered')) {
        return { success: false, error: 'This email is already registered. Try signing in instead.' };
      }
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
        // Better error messages for profile creation
        if (profileError.message.includes('duplicate key') && profileError.message.includes('username')) {
          return { success: false, error: 'This username is already taken. Please choose a different one.' };
        }
        if (profileError.message.includes('duplicate key') && profileError.message.includes('email')) {
          return { success: false, error: 'This email is already registered. Try signing in instead.' };
        }
        if (profileError.message.includes('duplicate key')) {
          return { success: false, error: 'An account with this information already exists. Try signing in instead.' };
        }
        return { success: false, error: 'Failed to create profile. Please try again.' };
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
