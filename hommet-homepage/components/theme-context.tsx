"use client";

import { createContext, useContext, type ReactNode } from "react";
import { themes, type Theme, type ThemeId } from "@/app/themes";

// Lets client components read the palette of the route they are on (links, Homi avatar, effect colours).
// Server components receive the theme id as a prop from their route file instead.
const ThemeContext = createContext<ThemeId>("home1");

export function ThemeProvider({ theme, children }: { theme: ThemeId; children: ReactNode }) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export const useTheme = (): Theme => themes[useContext(ThemeContext)];
