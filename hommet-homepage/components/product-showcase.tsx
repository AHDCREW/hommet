"use client";

import { useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import { products } from "@/app/shop-data";
import { quotation } from "@/app/site-data";
import { HeroTitle, Pull } from "@/components/reveal";

const total = products.length;

export function ProductShowcase() {
  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [dir, setDir] = useState(1);
  const [hovered, setHovered] = useState(false);
  // Autoplay runs until the visitor does anything themselves, then hands control over for good.
  const [interacted, setInteracted] = useState(false);
  const rail = useRef<HTMLDivElement>(null);
  const touch = useRef<number | null>(null);
  const product = products[active];

  const go = (index: number, byUser = true) => {
    const next = (index + total) % total;
    if (next === active) return;
    if (byUser) setInteracted(true);
    setDir(index < active ? -1 : 1);
    setPrevious(active);
    setActive(next);
    // Centre the active thumbnail inside the rail without scrolling the page.
    const el = rail.current, thumb = el?.children[next] as HTMLElement | undefined;
    if (el && thumb) el.scrollTo({ left: thumb.offsetLeft - (el.clientWidth - thumb.offsetWidth) / 2, behavior: "smooth" });
  };

  return <section className="shop-hero" aria-labelledby="hero-title" aria-roledescription="carousel" data-running={!interacted && !hovered}
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onTouchStart={e => { touch.current = e.touches[0].clientX; }}
    onTouchEnd={e => { const start = touch.current; touch.current = null; if (start === null) return; const dx = e.changedTouches[0].clientX - start; if (Math.abs(dx) > 50) go(active + (dx < 0 ? 1 : -1)); }}>
    <h1 id="hero-title" className="sr-only">Everything your home needs, from one partner you trust.</h1>
    <div className="shop-stage">
      {products.map((p, i) => (i === active || i === previous) && <figure key={p.id} className={`shop-slide ${i === active ? "active" : "previous"}`} data-dir={dir} aria-hidden={i !== active}>
        <img src={p.photo} alt={p.photoAlt} fetchPriority={i === 0 ? "high" : undefined}/>
      </figure>)}
    </div>
    <div className="shop-overlay">
      <div className="shop-info">
        <div className="shop-copy" key={product.id}>
          <p className="shop-eyebrow">{product.brand} · {product.category}</p>
          <HeroTitle>{product.name}</HeroTitle>
          <p className="shop-desc">{product.description}</p>
          <div className="shop-actions">
            <Pull><a className="shop-btn light" href={quotation(product.name)} target="_blank" rel="noreferrer"><MessageCircle size={18}/>Get a quote</a></Pull>
            <a className="shop-btn outline" href="#solutions">Explore solutions<ArrowDown size={17}/></a>
          </div>
        </div>
      </div>
      <div className="shop-side">
        <div className="shop-rail" ref={rail} role="group" aria-label="Choose a product">
          {products.map((p, i) => <button key={p.id} className={`shop-thumb${i === active ? " active" : ""}`} onClick={() => go(i)} aria-label={`Show ${p.name}`} aria-current={i === active}>
            <img src={p.photo} alt="" width="64" height="64"/>
            {i === active && !interacted && <span className="shop-thumb-progress" onAnimationEnd={() => go(active + 1, false)}/>}
          </button>)}
        </div>
        <div className="shop-arrows"><button onClick={() => go(active - 1)} aria-label="Previous product"><ArrowLeft size={18}/></button><button onClick={() => go(active + 1)} aria-label="Next product"><ArrowRight size={18}/></button></div>
      </div>
    </div>
  </section>;
}
