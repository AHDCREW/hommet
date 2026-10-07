import type { Metadata } from "next";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { BrandTiles } from "@/components/brand-tiles";
import { ChatBot } from "@/components/chat-bot";
import { ProductGrid } from "@/components/product-card";
import { Headline, Pull } from "@/components/reveal";
import { brandBySlug, type Brand } from "@/app/brands";
import { categoryBrands, categoryPages, type CategoryId } from "@/app/category-products";
import { quotation } from "@/app/site-data";
import { themes, type ThemeId } from "@/app/themes";

const pageFor = (id: CategoryId) => categoryPages.find(p => p.id === id)!;

export const categoryMetadata = (id: CategoryId): Metadata => {
  const { category } = pageFor(id);
  return { title: `${category.name} | Hommet`, description: category.description };
};

// /home1|home2/roofing, /doors and /sealants: hero, the full product grid, partner brands where there are any, and a quote band.
// Hero, grid and partner tiles reuse the brand-page styles so the header and chat launcher behave the same way.
export function CategoryPage({ id, theme }: { id: CategoryId; theme: ThemeId }) {
  const { category, hero, list } = pageFor(id);
  const partners = categoryBrands[id].map(brandBySlug).filter((b): b is Brand => !!b);
  return <div className="brand-page" style={{ "--brand": "var(--accent-category)" } as React.CSSProperties}>
    <a className="skip-link" href="#main">Skip to content</a>
    <SiteHeader/>
    <main id="main">
      <section className="brand-hero cat-hero">
        <img src={hero.photo} alt={hero.photoAlt} style={{ objectPosition: hero.focus }} width="2000" height="1125"/>
        <div className="brand-hero-copy">
          <a className="brand-back" href={`${themes[theme].base}#products`}><ArrowLeft size={15}/> All products</a>
          <p className="eyebrow">{category.label.toUpperCase()} / BY HOMMET</p>
          <h1>{category.name}</h1>
          <p className="brand-intro">{category.description}</p>
          <a className="button brand-cta" href={quotation(category.name)} target="_blank" rel="noreferrer"><MessageCircle size={18}/>Get a quote</a>
        </div>
      </section>
      <section className="section cat-range" id="products">
        <div className="section-heading"><div><p className="eyebrow">PRODUCT RANGE</p><h2>Explore the<br/><em>full range.</em></h2></div><p>Share your requirements and our team will confirm the right options for your project.</p></div>
        <ProductGrid list={list}/>
        <p className="image-note">Product photography is illustrative, pending Hommet product photography. Product types shown are indicative; ask our team for the available range.</p>
      </section>
      {partners.length > 0 && <section className="section brand-more">
        <div className="section-heading"><div><p className="eyebrow">OUR PARTNER BRANDS</p><h2>Brands in<br/><em>this range.</em></h2></div></div>
        <BrandTiles list={partners}/>
      </section>}
      <section className="contact section">
        <div><p className="eyebrow">LOOKING FOR SOMETHING SPECIFIC?</p><Headline lines={[{ text: "Tell us what you need." }, { text: "We will help from there.", em: true }]}/><p>Share your project and the products you have in mind. Our team will come back with the available options.</p></div>
        <div className="contact-actions"><Pull><a className="button" href={quotation(category.name)} target="_blank" rel="noreferrer"><MessageCircle size={18}/>Get a quote</a></Pull></div>
      </section>
    </main>
    <SiteFooter/>
    <ChatBot/>
  </div>;
}
