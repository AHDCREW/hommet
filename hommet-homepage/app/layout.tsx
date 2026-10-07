import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
 title: "Hommet | Integrated Building & Living Solutions",
 description: "Everything your home needs, from one partner you trust. Explore building and living solutions with Hommet. Rooted in Kerala. Earning trust across India.",
 icons: {icon: "/images/hommet_icon.png", shortcut: "/images/hommet_icon.png"},
};
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
 // Scroll reveals start hidden and are shown by script; without JavaScript, show everything.
 return <html lang="en"><body>{children}<noscript><style>{".invisible{visibility:visible!important}"}</style></noscript></body></html>;
}
