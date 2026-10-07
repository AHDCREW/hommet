import type { Viewport } from "next";
import "./theme.css";
import { ThemeProvider } from "@/components/theme-context";

export const viewport: Viewport = { themeColor: "#F5F2E9" };

// /home2: the olive and cream palette (the look that was on the color-palette branch).
export default function Home2Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <ThemeProvider theme="home2">{children}</ThemeProvider>;
}
