import "./theme.css";
import { ThemeProvider } from "@/components/theme-context";

// /home1: the white, black and blue palette (the look that was on the main branch).
export default function Home1Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <ThemeProvider theme="home1">{children}</ThemeProvider>;
}
