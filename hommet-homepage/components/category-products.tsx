"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowRight, ArrowUpRight, MessageCircle } from "lucide-react";
import { categoryPages, HOME_PRODUCT_LIMIT } from "@/app/category-products";
import { Headline, Intro } from "@/components/reveal";
import { quotation } from "@/app/site-data";

// Homepage section: category tabs over a two-column grid of photo tiles, up to HOME_PRODUCT_LIMIT per category.
// "Show more" appears only when the category has more, and opens the category's own page.
export function CategoryProducts() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const select = (i: number) => { setActive(i); tabs.current[i]?.focus(); };
  const onKeyDown = (e: KeyboardEvent, i: number) => {
    const last = categoryPages.length - 1;
    const next = e.key === "ArrowRight" ? (i === last ? 0 : i + 1) : e.key === "ArrowLeft" ? (i === 0 ? last : i - 1) : e.key === "Home" ? 0 : e.key === "End" ? last : null;
    if (next === null) return;
    e.preventDefault();
    select(next);
  };
  return <section className="products section" id="products">
    <div className="section-heading"><div><p className="eyebrow">02 / OUR PRODUCTS</p><Headline lines={[{ text: "Products for" }, { text: "every part of the build.", em: true }]}/></div><Intro>Browse roofing, doors and windows, and sealants. Ask our team for a quotation on anything you need.</Intro></div>
    <div className="ptabs" role="tablist" aria-label="Product categories">
      {categoryPages.map(({ id, category }, i) => <button key={id} ref={el => { tabs.current[i] = el; }} className="ptab" role="tab" id={`ptab-${id}`} aria-selected={i === active} aria-controls={`ppanel-${id}`} tabIndex={i === active ? 0 : -1} onClick={() => setActive(i)} onKeyDown={e => onKeyDown(e, i)}>{category.name}</button>)}
    </div>
    {categoryPages.map(({ id, path, category, list }, i) => <div className="ppanel" role="tabpanel" id={`ppanel-${id}`} aria-labelledby={`ptab-${id}`} hidden={i !== active} key={id}>
      <div className="ppanel-head"><p>{category.description}</p><a href={path}>View category page<ArrowUpRight size={16}/></a></div>
      <div className="ptiles">
        {list.slice(0, HOME_PRODUCT_LIMIT).map(p => <article className="ptile" key={p.slug}>
          <img src={p.image} alt={p.imageAlt} loading="lazy" width="1000" height="750"/>
          <div className="ptile-copy">{p.brand && <span>{p.brand}</span>}<h3>{p.name}</h3></div>
          <a className="ptile-quote" href={quotation(p.name)} target="_blank" rel="noreferrer"><MessageCircle size={15}/>Get a quote</a>
        </article>)}
      </div>
      {list.length > HOME_PRODUCT_LIMIT && <div className="pblock-more"><a className="button" href={path}>Show more<ArrowRight size={17}/></a></div>}
    </div>)}
    <p className="image-note">Product photography is illustrative, pending Hommet product photography. See image credits.</p>
  </section>;
}

/* Previous layout, commented out: one stacked block per category with a 4x2 grid of product cards.
   To bring it back, rename it to CategoryProducts (replacing the tabbed one above) and add
   `import { ProductGrid } from "@/components/product-card";`. The .pblock-* and .pgrid CSS is still in globals.css.

export function CategoryProductsBlocks() {
  return <section className="products section" id="products">
    <div className="section-heading"><div><p className="eyebrow">02 / OUR PRODUCTS</p><Headline lines={[{ text: "Products for" }, { text: "every part of the build.", em: true }]}/></div><Intro>Browse roofing, doors and windows, and sealants. Ask our team for a quotation on anything you need.</Intro></div>
    {categoryPages.map(({ id, path, category, list }) => <div className="pblock" id={`products-${id}`} key={id}>
      <div className="pblock-head">
        <div><p className="eyebrow">{category.label.toUpperCase()}</p><h3><a href={path}>{category.name}<ArrowUpRight size={22}/></a></h3></div>
        <p>{category.description}</p>
      </div>
      <ProductGrid list={list.slice(0, HOME_PRODUCT_LIMIT)}/>
      {list.length > HOME_PRODUCT_LIMIT && <div className="pblock-more"><a className="button" href={path}>Show more<ArrowRight size={17}/></a></div>}
    </div>)}
    <p className="image-note">Product photography is illustrative, pending Hommet product photography. See image credits.</p>
  </section>;
}
*/
