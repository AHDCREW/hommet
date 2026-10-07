"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { Menu, MessageCircle } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { offices, enquiry, quotation } from "@/app/site-data";

// The header turns into frosted glass once the page has scrolled.
const onScroll = (cb: () => void) => { window.addEventListener("scroll", cb, { passive: true }); return () => window.removeEventListener("scroll", cb); };

const links = [["Our solutions","solutions"],["Why Hommet","why-hommet"],["Roofing","roofing"],["Our partners","partners"]];
const mobileLinks = [...links, ["Contact","contact"]];

// On the homepage the links scroll to sections; on other pages they go back to the matching section of the homepage.
export function SiteHeader({ home = false, solid = false }: { home?: boolean; solid?: boolean }) {
  const scrolled = useSyncExternalStore(onScroll, () => window.scrollY > 8, () => false) || solid;
  const [menuOpen, setMenuOpen] = useState(false);
  // Radix returns focus to the menu button (top of the page) on close, so scroll to the chosen section after that instead.
  const menuTarget = useRef<string | null>(null);
  const href = (id: string) => `${home ? "" : "/"}#${id}`;
  return <header className={`site-header${scrolled ? " scrolled" : ""}`}>
    <a className="brand" href={home ? "#" : "/"} aria-label="Hommet home"><img src={scrolled ? "/images/logo-hommet.png" : "/images/logo-hommet-white.png"} alt="Hommet" width="3569" height="1262" /></a>
    <nav className="desktop-nav" aria-label="Main navigation">{links.map(([label,id])=><a key={id} href={href(id)}>{label}</a>)}</nav>
    <a className="button header-enquiry" href={quotation("my project")} target="_blank" rel="noreferrer">Get a quote</a>
    <Sheet open={menuOpen} onOpenChange={setMenuOpen}><SheetTrigger asChild><button className="menu-button" aria-label="Open navigation"><Menu size={24}/></button></SheetTrigger><SheetContent className="mobile-menu" onCloseAutoFocus={e=>{const id=menuTarget.current;if(!id)return;menuTarget.current=null;e.preventDefault();if(home){document.getElementById(id)?.scrollIntoView();history.replaceState(history.state,"",`#${id}`);}else location.href=href(id);}}><SheetTitle>Explore Hommet</SheetTitle><SheetDescription>Integrated Building & Living Solutions</SheetDescription><nav aria-label="Mobile navigation">{mobileLinks.map(([label,id])=><a key={id} href={href(id)} onClick={e=>{e.preventDefault();menuTarget.current=id;setMenuOpen(false);}}>{label}</a>)}</nav><a className="button" href={quotation("my project")} target="_blank" rel="noreferrer"><MessageCircle size={18}/>Get a quote</a></SheetContent></Sheet>
  </header>;
}

export function SiteFooter({ home = false }: { home?: boolean }) {
  return <footer><div className="footer-top"><div className="footer-intro"><a className="brand footer-brand" href={home ? "#" : "/"} aria-label="Hommet home"><img src="/images/logo-hommet-white.png" alt="Hommet" width="3569" height="1262"/></a><p>Integrated Building & Living Solutions</p><p className="footer-tagline">Crafting Durable Dreams</p></div>{offices.map(office=><div className="office" key={office.city}><h3>{office.city}</h3><p>{office.address}</p></div>)}</div><div className="footer-bottom"><span>© {new Date().getFullYear()} Hommet Industries Private Limited</span><div><a href={enquiry("becoming a dealer / partner")} target="_blank" rel="noreferrer">Become a dealer / partner</a><a href="/image-credits.html" target="_blank" rel="noreferrer">Image credits</a></div><span>Rooted in Kerala. Across India.</span></div></footer>;
}
