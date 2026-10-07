"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { categories, quotation } from "@/app/site-data";
import { Glare, Reveal } from "@/components/reveal";

type Category = (typeof categories)[number];

// Headline categories shown as large tiles; every category also appears in the rail below.
const featured = ["roofing", "doors", "sanitary"];

const image = (item: Category) => `/images/interiors/${item.id}.jpg`;

// Whether the rail is scrolled to either end, to disable the matching arrow.
const edges = (el: HTMLElement) => ({ start: el.scrollLeft <= 2, end: el.scrollLeft >= el.scrollWidth - el.clientWidth - 2 });

export function CategoryShowcase({ onSelect }: { onSelect: (item: Category) => void }) {
  const rail = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setEdge(edges(el)));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Page by the number of cards in view, like large retail carousels.
  const page = (dir: 1 | -1) => rail.current?.scrollBy({ left: dir * rail.current.clientWidth * .9, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });

  return <div className="showcase">
    <div className="showcase-featured">
      {categories.filter(item => featured.includes(item.id)).map((item, i) => <Reveal key={item.id} className="showcase-slot" delay={i * 0.12}><Glare className="glare-tile"><div className="showcase-feature">
        <img src={image(item)} alt={item.interiorAlt} width="960" height="1200" loading="lazy"/>
        {/* The whole tile opens the details; the pill above it goes straight to a quote. */}
        <button className="showcase-feature-open" onClick={() => onSelect(item)} aria-label={`Explore ${item.name}`}/>
        <span className="showcase-feature-go" aria-hidden="true"><ArrowUpRight size={20}/></span>
        <div className="showcase-feature-copy">
          <span className="showcase-feature-label">{item.label}</span>
          <span className="showcase-feature-name">{item.name}</span>
          <a className="showcase-pill" href={quotation(item.name)} target="_blank" rel="noreferrer">Get a quote</a>
        </div>
      </div></Glare></Reveal>)}
    </div>

    <Reveal>
    <div className="showcase-rail-head">
      <h3>Browse all solutions <span>{categories.length}</span></h3>
      <div className="showcase-arrows">
        <button onClick={() => page(-1)} disabled={edge.start} aria-label="Previous solutions"><ArrowLeft size={18}/></button>
        <button onClick={() => page(1)} disabled={edge.end} aria-label="Next solutions"><ArrowRight size={18}/></button>
      </div>
    </div>
    <div className="showcase-rail" ref={rail} onScroll={e => setEdge(edges(e.currentTarget))}>
      {categories.map(item => <button key={item.id} className="showcase-card" onClick={() => onSelect(item)} aria-label={`Explore ${item.name}`}>
        <span className="showcase-card-image"><img src={image(item)} alt={item.interiorAlt} width="960" height="1200" loading="lazy"/></span>
        <span className="showcase-card-name">{item.name}</span>
        <span className="showcase-card-label">{item.label}</span>
      </button>)}
    </div>
    </Reveal>
  </div>;
}
