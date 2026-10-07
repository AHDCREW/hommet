"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, MessageCircle, Pause, Play } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { categories, quotation } from "@/app/site-data";

type Category = (typeof categories)[number];
const total = categories.length;
const pad = (n: number) => String(n).padStart(2, "0");
const collectionCopy: Record<string, { label: string; title: string; description: string }> = {
  roofing: { label: "Roofing", title: "Roofing & building materials.", description: "From the first structure to the final roof. Discover materials for the place you call home." },
  doors: { label: "Doors & windows", title: "Doors & windows.", description: "Let the light in. Explore steel doors and UPVC windows for your space." },
  sealants: { label: "Sealants", title: "The finishing details.", description: "Explore sealants and construction accessories for the details that bring your project together." },
  terracotta: { label: "Terracotta", title: "Texture. Warmth. Terracotta.", description: "Bring character to your architecture. Discover terracotta for your next design." },
  sanitary: { label: "Sanitary ware", title: "A fresh perspective on bathrooms.", description: "Explore washbasins and sanitary ware. Find the right pieces for your everyday space." },
  toilets: { label: "Smart toilets", title: "Meet the modern bathroom.", description: "Discover smart toilet options. Talk to us about features, fit and installation." },
  fitness: { label: "Home fitness", title: "Make room for movement.", description: "Explore home fitness equipment for your routine, your space and your goals." },
  hvac: { label: "HVAC", title: "Comfort starts here.", description: "Discover HVAC solutions and discuss the requirements of your home or building with our team." },
  pumps: { label: "Pumps", title: "Keep life flowing.", description: "Explore pumps and fluid systems. Get help choosing the right solution for your application." },
  automation: { label: "Automation", title: "A more connected building.", description: "Explore building automation and performance solutions, shaped around your project." },
};

function subscribeMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

export function HeroSlider({ onSelect, held = false }: { onSelect: (item: Category) => void; held?: boolean }) {
  const [api, setApi] = useState<CarouselApi>();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const navigation = useRef<HTMLDivElement>(null);
  const reducedMotion = useSyncExternalStore(subscribeMotion, () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, () => false);
  const current = categories[active];
  const copy = collectionCopy[current.id];
  const running = !!api && !paused && !hovered && !held && !reducedMotion;

  useEffect(() => {
    if (!api) return;
    const select = () => setActive(api.selectedScrollSnap());
    api.on("select", select);
    api.on("reInit", select);
    return () => { api.off("select", select); api.off("reInit", select); };
  }, [api]);

  useEffect(() => {
    const track = navigation.current;
    const button = track?.children[active] as HTMLElement | undefined;
    if (!track || !button) return;
    // Reveal the selected thumbnail without moving the page vertically.
    const reveal = () => track.scrollTo({ left: button.offsetLeft - (track.clientWidth - button.offsetWidth) / 2, behavior: "instant" });
    const observer = new ResizeObserver(reveal);
    observer.observe(track);
    reveal();
    return () => observer.disconnect();
  }, [active]);

  const go = (index: number) => {
    setPaused(true);
    api?.scrollTo((index + total) % total, reducedMotion);
  };

  return (
    <section className="showcase" aria-label="Explore the Hommet collections" data-running={running}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocusCapture={e => { if (!(e.target as HTMLElement).closest(".showcase-play")) setPaused(true); }}>
      <div className="showcase-main">
        <div className="showcase-copy">
          <p className="showcase-kicker"><span aria-hidden="true" />THE HOMMET COLLECTION</p>
          <div className="showcase-story" key={current.id}>
            <p className="showcase-category-name">{current.name}</p>
            <h1 id="hero-title">{copy?.title ?? current.name}</h1>
            <p className="showcase-description">{copy?.description ?? current.description}</p>
          </div>
          <div className="showcase-actions">
            <button className="showcase-primary" onClick={() => onSelect(current)}>
              Explore collection <ArrowUpRight size={19} aria-hidden="true" />
            </button>
            <a className="showcase-quote" href={quotation(current.name)} target="_blank" rel="noreferrer">
              <MessageCircle size={17} aria-hidden="true" />Get a quote
            </a>
          </div>
          <p className="showcase-help">Find something you like? Let’s make it part of your project.</p>
        </div>

        <Carousel className="showcase-gallery" setApi={setApi} opts={{ loop: true, duration: reducedMotion ? 0 : 35 }}
          aria-label="Product collection images"
          onKeyDownCapture={e => {
            if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
              e.preventDefault();
              go(active + (e.key === "ArrowRight" ? 1 : -1));
            }
          }}>
          <div className="showcase-image-wrap" onPointerDown={() => setPaused(true)}>
            <CarouselContent className="showcase-track">
              {categories.map((item, i) => (
                <CarouselItem key={item.id} className="showcase-slide" aria-label={`${i + 1} of ${total}: ${item.name}`}
                  aria-hidden={i !== active} inert={i !== active}>
                  <button className={`showcase-image${item.contain ? " contain" : ""}`} onClick={() => onSelect(item)} aria-label={`Explore ${item.name}`}>
                    <img src={`/images/hero/${item.image}`} alt={item.alt} width="1200" height="1000" draggable={false}
                      loading={i === active ? "eager" : "lazy"} fetchPriority={i === 0 ? "high" : undefined}
                      style={item.focus ? { objectPosition: item.focus } : undefined} />
                    <span className="showcase-image-action" aria-hidden="true"><ArrowUpRight size={23} /></span>
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>
            <span className="showcase-image-label" aria-hidden="true">{current.label}</span>
          </div>
          <div className="showcase-image-meta">
            {current.credit ? <a href={current.credit.href} target="_blank" rel="noreferrer">Reference imagery · {current.credit.label}</a> : <a href="/image-credits.html" target="_blank" rel="noreferrer">Illustrative collection imagery</a>}
            <span>Drag to discover <ArrowRight size={13} aria-hidden="true" /></span>
          </div>
          <div className="showcase-controls">
            <span className="showcase-count" aria-hidden="true">{pad(active + 1)}<span> / {pad(total)}</span></span>
            <div className="showcase-timer" aria-hidden="true">
              <span key={current.id} onAnimationEnd={() => { if (running) api?.scrollNext(); }} />
            </div>
            <button className="showcase-play" onClick={() => setPaused(value => !value)} aria-label={paused ? "Play slideshow" : "Pause slideshow"}>
              {paused ? <Play size={15} /> : <Pause size={15} />}
            </button>
            <button className="showcase-arrow" onClick={() => go(active - 1)} aria-label="Previous category"><ArrowLeft size={19} /></button>
            <button className="showcase-arrow" onClick={() => go(active + 1)} aria-label="Next category"><ArrowRight size={19} /></button>
          </div>
        </Carousel>
      </div>

      <div className="showcase-browse">
        <div className="showcase-browse-heading"><p>Find your collection</p><span>{total} ways to make it yours</span></div>
        <div className="showcase-thumbnails" role="group" aria-label="Choose a collection" ref={navigation}
          onKeyDown={e => {
            const index = Array.from(e.currentTarget.children).indexOf(e.target as Element);
            if (index === -1) return;
            let next: number;
            if (e.key === "ArrowLeft") next = (index - 1 + total) % total;
            else if (e.key === "ArrowRight") next = (index + 1) % total;
            else if (e.key === "Home") next = 0;
            else if (e.key === "End") next = total - 1;
            else return;
            e.preventDefault();
            go(next);
            (e.currentTarget.children[next] as HTMLButtonElement).focus({ preventScroll: true });
          }}>
          {categories.map((item, i) => (
            <button key={item.id} className={`showcase-thumbnail${i === active ? " active" : ""}`} onClick={() => go(i)}
              aria-label={`Show ${item.name}`} aria-current={i === active ? "true" : undefined}>
              <span className={`showcase-thumbnail-image${item.contain ? " contain" : ""}`}>
                <img src={`/images/hero/${item.image}`} alt="" width="140" height="90" loading="lazy" draggable={false} />
              </span>
              <span>{collectionCopy[item.id]?.label ?? item.name}</span>
            </button>
          ))}
        </div>
      </div>
      <p className="sr-only" aria-live={running ? "off" : "polite"} aria-atomic="true">Collection {active + 1} of {total}: {current.name}</p>
    </section>
  );
}