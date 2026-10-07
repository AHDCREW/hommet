import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { BrandTiles } from "@/components/brand-tiles";
import { ChatBot } from "@/components/chat-bot";
import { brands, brandBySlug } from "../../brands";
import { quotation } from "../../site-data";

type Params = Promise<{ slug: string }>;

export const generateStaticParams = () => brands.map(b => ({ slug: b.slug }));

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const brand = brandBySlug((await params).slug);
  return brand ? { title: `${brand.name} ${brand.category} | Hommet`, description: brand.intro } : {};
}

export default async function BrandPage({ params }: { params: Params }) {
  const brand = brandBySlug((await params).slug);
  if (!brand) notFound();
  const others = brands.filter(b => b.slug !== brand.slug);
  return <div className="brand-page" style={{ "--brand": brand.accent } as React.CSSProperties}>
    <a className="skip-link" href="#main">Skip to content</a>
    <SiteHeader/>
    <main id="main">
      <section className="brand-hero">
        <img src={brand.image} alt={brand.imageAlt} style={{ objectPosition: brand.focus }} width="2000" height="1125"/>
        <div className="brand-hero-copy">
          <a className="brand-back" href="/#partners"><ArrowLeft size={15}/> Our partner brands</a>
          <p className="eyebrow">{brand.category.toUpperCase()} / BY HOMMET</p>
          <h1><span className={brand.wordmark}>{brand.name}</span></h1>
          <p className="brand-tagline">{brand.tagline}</p>
          <p className="brand-intro">{brand.intro}</p>
          <a className="button brand-cta" href={quotation(brand.quoteSubject)} target="_blank" rel="noreferrer"><MessageCircle size={18}/>Get a quote</a>
        </div>
      </section>
      <section className="section brand-range" id="range">
        <div className="section-heading"><div><p className="eyebrow">PRODUCT RANGE</p><h2>What we offer<br/><em>with {brand.name}.</em></h2></div><p>Share your requirements and our team will confirm the right options for your project.</p></div>
        {brand.products.length > 0
          ? <div className="brand-products">{brand.products.map((p, i) => <article key={p.name}><span>0{i + 1}</span><h3>{p.name}</h3><p>{p.detail}</p></article>)}</div>
          : <p className="brand-empty">Product details are being prepared. Ask our team for the available range.</p>}
        {brand.note && <p className="brand-note">{brand.note}</p>}
        <p className="image-note">Imagery is illustrative, pending official {brand.name} assets.</p>
      </section>
      <section className="section brand-more">
        <div className="section-heading"><div><p className="eyebrow">MORE FROM HOMMET</p><h2>Our other<br/><em>partner brands.</em></h2></div></div>
        <BrandTiles list={others}/>
      </section>
    </main>
    <SiteFooter/>
    <ChatBot brand={brand.slug}/>
  </div>;
}
