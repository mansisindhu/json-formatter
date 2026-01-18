"use client";

import { useCallback, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "theme";
const DEFAULT_THEME: Theme = "light";

// Get theme from localStorage
function getStoredTheme(): Theme {
  if (typeof window === "undefined") return DEFAULT_THEME;
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  return stored === "dark" ? "dark" : "light";
}

// Subscribe to theme changes
function subscribeToTheme(callback: () => void): () => void {
  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) callback();
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener("theme-change", callback);
  
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener("theme-change", callback);
  };
}

// Server snapshot
function getServerTheme(): Theme {
  return DEFAULT_THEME;
}

export function useTheme() {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getStoredTheme,
    getServerTheme
  );

  // Apply theme to document
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", theme);
  }

  // Set theme function
  const setTheme = useCallback((newTheme: Theme) => {
    localStorage.setItem(STORAGE_KEY, newTheme);
    window.dispatchEvent(new Event("theme-change"));
  }, []);

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    const current = getStoredTheme();
    const newTheme: Theme = current === "light" ? "dark" : "light";
    setTheme(newTheme);
  }, [setTheme]);

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === "dark",
  };
}
