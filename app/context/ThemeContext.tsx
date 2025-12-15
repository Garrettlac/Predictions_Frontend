"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/lib/supabase";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [theme, setThemeState] = useState<Theme>("light");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  console.log('[ThemeProvider] Render - theme:', theme, 'user:', !!user);

  // Apply theme to document immediately
  useEffect(() => {
    console.log('[ThemeProvider] Mounting...');
    setMounted(true);
    // Apply default theme on mount
    const applyInitialTheme = () => {
      const root = document.documentElement;
      root.classList.remove('dark');
      applyTheme(theme);
    };
    applyInitialTheme();
  }, []);

  // Apply theme to document
  const applyTheme = (selectedTheme: Theme) => {
    const root = document.documentElement;
    
    let actualTheme: "light" | "dark" = "light";
    
    if (selectedTheme === "system") {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      actualTheme = prefersDark ? "dark" : "light";
    } else {
      actualTheme = selectedTheme;
    }
    
    console.log('[ThemeContext] Applying theme:', selectedTheme, 'Actual:', actualTheme);
    console.log('[ThemeContext] Root element:', root);
    console.log('[ThemeContext] Classes before:', root.classList.toString());
    
    // Force remove/add to ensure it works
    root.classList.remove('dark');
    if (actualTheme === "dark") {
      root.classList.add('dark');
    }
    
    console.log('[ThemeContext] Classes after:', root.classList.toString());
    
    setResolvedTheme(actualTheme);
  };

  // Load theme from user profile
  useEffect(() => {
    async function loadTheme() {
      if (user && mounted) {
        const { data } = await supabase
          .from("profiles")
          .select("theme")
          .eq("id", user.id)
          .single();
        
        if (data?.theme) {
          const userTheme = data.theme as Theme;
          setThemeState(userTheme);
          applyTheme(userTheme);
        }
      }
    }
    
    loadTheme();
  }, [user, mounted]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme === "system") {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme("system");
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [theme]);

  const setTheme = async (newTheme: Theme) => {
    console.log('[ThemeContext] setTheme called with:', newTheme);
    setThemeState(newTheme);
    applyTheme(newTheme);
    
    // Save to Supabase if user is logged in
    if (user) {
      const { error } = await supabase
        .from("profiles")
        .update({ theme: newTheme })
        .eq("id", user.id);
      
      if (error) {
        console.error("Failed to save theme:", error);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
