"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "light" | "dark" | "system" | "cream"; // Added 'cream' theme
type FontFamily = "Inter" | "Roboto" | "Open Sans" | "Lato" | "Montserrat" | "Times New Roman" | "System Default";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    return savedTheme || "system";
  });

  const [fontFamily, setFontFamily] = useState<FontFamily>(() => {
    const savedFont = localStorage.getItem("fontFamily") as FontFamily | null;
    return savedFont || "Times New Roman";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    
    const root = document.documentElement;
    root.classList.remove("light", "dark", "cream"); // Remove all theme classes first
    
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        const systemTheme = mediaQuery.matches ? "dark" : "light";
        document.documentElement.classList.remove("light", "dark", "cream");
        document.documentElement.classList.add(systemTheme);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("fontFamily", fontFamily);
    const root = document.documentElement;
    switch (fontFamily) {
      case "Inter":
        root.style.fontFamily = "Inter, sans-serif";
        break;
      case "Roboto":
        root.style.fontFamily = "Roboto, sans-serif";
        break;
      case "Open Sans":
        root.style.fontFamily = "'Open Sans', sans-serif";
        break;
      case "Lato":
        root.style.fontFamily = "Lato, sans-serif";
        break;
      case "Montserrat":
        root.style.fontFamily = "Montserrat, sans-serif";
        break;
      case "Times New Roman":
        root.style.fontFamily = "'Times New Roman', serif";
        break;
      case "System Default":
      default:
        root.style.fontFamily = ""; // Revert to default Tailwind font
        break;
    }
  }, [fontFamily]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, fontFamily, setFontFamily }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};