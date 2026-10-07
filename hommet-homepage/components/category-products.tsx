import { ArrowRight, ArrowUpRight } from "lucide-react";
import { categoryPages, HOME_PRODUCT_LIMIT } from "@/app/category-products";
import { ProductGrid } from "@/components/product-card";
import { Headline, Intro } from "@/components/reveal";

// Homepage section: one block per category with up to HOME_PRODUCT_LIMIT products.
// "Show more" appears only when the category has more, and opens the category's own page.
export function CategoryProducts() {
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
