"use client";

import { useSyncExternalStore, type ComponentProps, type ReactNode } from "react";
import AnimatedContent from "./AnimatedContent";
import GlareHover from "./GlareHover";
import Magnet from "./Magnet";
import ScrollReveal from "./ScrollReveal";
import SplitText from "./SplitText";

// One place that adapts the React Bits components to this site: every animated piece goes through
// here so it is skipped for visitors who ask for reduced motion (the CSS rule in globals.css cannot stop JS animation).
const media = (query: string) => ({
  subscribe: (notify: () => void) => {
    const list = matchMedia(query);
    list.addEventListener("change", notify);
    return () => list.removeEventListener("change", notify);
  },
  get: () => matchMedia(query).matches,
});
const reduced = media("(prefers-reduced-motion: reduce)");
const mouse = media("(hover: hover) and (pointer: fine)");

// Server snapshots are false, so the server renders the animated version and reduced-motion visitors switch after hydration.
const useReducedMotion = () => useSyncExternalStore(reduced.subscribe, reduced.get, () => false);
const useMouse = () => useSyncExternalStore(mouse.subscribe, mouse.get, () => false);

type Line = { text: string; em?: boolean };

// Fades and rises into view once. `className` goes on the wrapper, which becomes the layout child (grid/flex slot).
export function Reveal({ children, className = "", ...rest }: Omit<ComponentProps<typeof AnimatedContent>, "children"> & { children: ReactNode }) {
  const still = useReducedMotion();
  if (still) return <div className={className} id={rest.id}>{children}</div>;
  return <AnimatedContent distance={48} duration={0.9} threshold={0.12} className={className} {...rest}>{children}</AnimatedContent>;
}

// A section heading. Each line is split into words that rise in; lines marked `em` keep the muted <em> style.
export function Headline({ lines, className }: { lines: Line[]; className?: string }) {
  const still = useReducedMotion();
  return <h2 className={className}>{lines.map(({ text, em }) => {
    const line = still ? <span className="hl-line">{text}</span>
      : <SplitText tag="span" text={text} textAlign="left" splitType="words" delay={70} duration={1} threshold={0} rootMargin="-40px"/>;
    return em ? <em key={text} className="hl-line">{line}</em> : <span key={text} className="hl-line">{line}</span>;
  })}</h2>;
}

// The product name in the hero, letters rising in on every slide change.
export function HeroTitle({ children }: { children: string }) {
  const still = useReducedMotion();
  if (still) return <h2>{children}</h2>;
  return <SplitText tag="h2" text={children} textAlign="left" splitType="chars" delay={22} duration={0.9} threshold={0} rootMargin="0px"/>;
}

// Section intro paragraph whose words un-blur as it scrolls into view.
export function Intro({ children }: { children: string }) {
  const still = useReducedMotion();
  if (still) return <p>{children}</p>;
  return <ScrollReveal baseOpacity={0.2} blurStrength={3}>{children}</ScrollReveal>;
}

// Pulls a button slightly towards the cursor. Only wraps it for a mouse; touch and reduced motion get the bare button.
export function Pull({ children }: { children: ReactNode }) {
  const still = useReducedMotion();
  const withMouse = useMouse();
  if (still || !withMouse) return <>{children}</>;
  return <Magnet padding={70} magnetStrength={4}>{children}</Magnet>;
}

// A light sheen sweeping across an image tile on hover. `className` carries the tile's corner radius.
export function Glare({ children, className = "" }: { children: ReactNode; className?: string }) {
  const still = useReducedMotion();
  if (still) return <div className={className}>{children}</div>;
  return <GlareHover className={className} glareOpacity={0.12} glareSize={300} transitionDuration={800}>{children}</GlareHover>;
}
