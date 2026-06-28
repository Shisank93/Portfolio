"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (forcedTheme?: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("aether-theme") as Theme;
      if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
      const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
      return prefersLight ? "light" : "dark";
    }
    return "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  const toggleTheme = (forcedTheme?: Theme) => {
    const nextTheme = forcedTheme || (theme === "dark" ? "light" : "dark");
    setTheme(nextTheme);
    localStorage.setItem("aether-theme", nextTheme);
    
    if (nextTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  };

  return (
    <ThemeContext.Provider value={ { theme, toggleTheme } }>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
