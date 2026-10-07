import { MessageCircle } from "lucide-react";
import type { CategoryProduct } from "@/app/category-products";
import { quotation } from "@/app/site-data";

// One product in a category grid. The only action is the site-wide "Get a quote" WhatsApp request.
export function ProductCard({ product }: { product: CategoryProduct }) {
  return <article className="pcard">
    <div className="pcard-image"><img src={product.image} alt={product.imageAlt} loading="lazy" width="1000" height="750"/></div>
    <div className="pcard-body">
      {product.brand && <span className="pcard-brand">{product.brand}</span>}
      <h3>{product.name}</h3>
      <p>{product.detail}</p>
      <a className="pcard-quote" href={quotation(product.name)} target="_blank" rel="noreferrer"><MessageCircle size={16}/>Get a quote</a>
    </div>
  </article>;
}

export function ProductGrid({ list }: { list: CategoryProduct[] }) {
  return <div className="pgrid">{list.map(p => <ProductCard key={p.slug} product={p}/>)}</div>;
}
