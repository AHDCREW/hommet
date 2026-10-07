import { brandBySlug } from "./brands";
import { categories } from "./site-data";
import { products } from "./shop-data";

// Product lists for the three category pages (/roofing, /doors, /sealants) and the matching homepage blocks.
// Items with a `brand` come from the partner data in brands.ts. Items without one are GENERIC product types that
// Hommet has not confirmed: they carry no brand, model or performance claim and read "Ask our team...".
// Replace them with confirmed products when the range is final. Photos are illustrative stock (see image-credits.html).
export type CategoryProduct = { slug: string; name: string; detail: string; image: string; imageAlt: string; brand?: string };
export type CategoryId = "roofing" | "doors" | "sealants";

const GENERIC_DETAIL = "Ask our team about the available options.";
const photo = (id: CategoryId, slug: string) => `/images/products/${id}/${slug}.jpg`;

// A partner product keeps the name and description written in brands.ts.
const partner = (id: CategoryId, brandSlug: string, name: string, slug: string, imageAlt: string): CategoryProduct => {
  const brand = brandBySlug(brandSlug);
  const item = brand?.products.find(p => p.name === name);
  if (!brand || !item) throw new Error(`Partner product not found: ${brandSlug} / ${name}`);
  return { slug, name, detail: item.detail, image: photo(id, slug), imageAlt, brand: brand.name };
};
const generic = (id: CategoryId, slug: string, name: string, imageAlt: string): CategoryProduct => ({ slug, name, detail: GENERIC_DETAIL, image: photo(id, slug), imageAlt });

export const categoryProducts: Record<CategoryId, CategoryProduct[]> = {
  roofing: [
    partner("roofing", "atlantique", "Ceramic roof tiles", "ceramic-roof-tiles", "Ceramic roof tiles on a house"),
    partner("roofing", "atlantique", "Stone-coated roofing sheets", "stone-coated-roofing-sheets", "Stone-coated metal roofing sheets"),
    partner("roofing", "atlantique", "Roofing shingles", "roofing-shingles", "Roofing shingles on a pitched roof"),
    generic("roofing", "ridge-and-hip-caps", "Ridge and hip caps", "Ridge caps along the top of a tiled roof"),
    generic("roofing", "roof-underlay", "Roof underlay", "Roof underlay being laid under roofing"),
    generic("roofing", "waterproofing-membranes", "Waterproofing membranes", "Waterproofing membrane on a roof"),
    generic("roofing", "roof-insulation", "Roof insulation", "Insulation fitted in a roof space"),
    generic("roofing", "gutters-and-downpipes", "Gutters and downpipes", "Gutter and downpipe on a building"),
    generic("roofing", "roof-fasteners-and-fixings", "Roof fasteners and fixings", "Roofing screws and fixings"),
    generic("roofing", "skylights", "Skylights", "Skylight set into a roof"),
  ],
  doors: [
    partner("doors", "staly", "Main entrance doors", "main-entrance-doors", "Steel main entrance door"),
    partner("doors", "staly", "Bedroom doors", "bedroom-doors", "Interior bedroom door"),
    partner("doors", "staly", "Luxury and semi-luxury doors", "luxury-and-semi-luxury-doors", "Decorative front door"),
    partner("doors", "staly", "Security doors", "security-doors", "Reinforced security door"),
    partner("doors", "leoplast", "UPVC windows", "upvc-windows", "White UPVC window"),
    partner("doors", "leoplast", "UPVC doors", "upvc-doors", "White UPVC door"),
    generic("doors", "door-frames", "Door frames", "Door frame in a wall"),
    generic("doors", "door-and-window-hardware", "Door and window hardware", "Door handle and lock hardware"),
    generic("doors", "mosquito-mesh", "Mosquito mesh", "Window with an insect screen"),
  ],
  sealants: [
    generic("sealants", "silicone-sealants", "Silicone sealants", "Silicone sealant applied along a joint"),
    generic("sealants", "polyurethane-sealants", "Polyurethane (PU) sealants", "Polyurethane sealant cartridge"),
    generic("sealants", "acrylic-sealants", "Acrylic sealants", "Acrylic sealant applied to a gap"),
    generic("sealants", "expanding-pu-foam", "Expanding PU foam", "Expanding foam can"),
    generic("sealants", "construction-adhesives", "Construction adhesives", "Construction adhesive cartridge"),
    generic("sealants", "waterproofing-compounds", "Waterproofing compounds", "Waterproofing compound being applied"),
    generic("sealants", "backer-rods", "Backer rods", "Foam backer rod used in joints"),
    generic("sealants", "masking-and-sealing-tapes", "Masking and sealing tapes", "Rolls of masking and sealing tape"),
    generic("sealants", "caulking-guns", "Caulking guns", "Caulking gun loaded with a cartridge"),
    generic("sealants", "anchors-screws-and-fasteners", "Anchors, screws and fasteners", "Assorted anchors, screws and fasteners"),
  ],
};

// Route id, category copy and hero photo for each page. The route id doubles as the category id in site-data.ts.
export const categoryPages = (["roofing", "doors", "sealants"] as const).map(id => {
  const category = categories.find(c => c.id === id)!;
  const hero = products.find(p => p.id === id)!;
  return { id, path: `/${id}`, category, hero, list: categoryProducts[id] };
});
export type CategoryPageData = (typeof categoryPages)[number];

// Brands whose pages are linked from each category page.
export const categoryBrands: Record<CategoryId, string[]> = { roofing: ["atlantique"], doors: ["staly", "leoplast"], sealants: [] };

// The homepage shows this many cards per category; "Show more" appears only when a category has more.
export const HOME_PRODUCT_LIMIT = 8;
