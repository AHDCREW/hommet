"use client";

import { ArrowUpRight } from "lucide-react";
import { brands, type Brand } from "@/app/brands";
import { Glare, Reveal } from "@/components/reveal";
import { useTheme } from "@/components/theme-context";

// Image tiles linking to each brand page; pass `list` to show a subset.
export function BrandTiles({ list = brands }: { list?: Brand[] }) {
  const { base } = useTheme();
  return <div className={`brand-tiles${list.length === 3 ? " brand-tiles-3" : ""}`}>
    {list.map((b, i) => <Reveal key={b.slug} className="brand-slot" delay={i * 0.1}><Glare className="glare-tile"><a href={`${base}/brands/${b.slug}`} style={{ "--brand": b.accent } as React.CSSProperties} aria-label={`${b.name}, ${b.category}`}>
      <img src={b.image} alt="" style={{ objectPosition: b.focus }} loading="lazy" width="1200" height="800"/>
      <span className="brand-tile-copy"><strong className={b.wordmark}>{b.name}</strong><span>{b.category}</span></span>
      <span className="brand-tile-go" aria-hidden="true">Explore <ArrowUpRight size={15}/></span>
    </a></Glare></Reveal>)}
  </div>;
}
