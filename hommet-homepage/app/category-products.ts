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
// `noPhoto` marks a product with no suitable stock photo: it shows the category photo instead of a mismatched one.
const generic = (id: CategoryId, slug: string, name: string, imageAlt: string, noPhoto = false): CategoryProduct => {
  const hero = products.find(p => p.id === id)!;
  return { slug, name, detail: GENERIC_DETAIL, image: noPhoto ? hero.photo : photo(id, slug), imageAlt: noPhoto ? hero.photoAlt : imageAlt };
};

export const categoryProducts: Record<CategoryId, CategoryProduct[]> = {
  roofing: [
    partner("roofing", "atlantique", "Ceramic roof tiles", "ceramic-roof-tiles", "Terracotta ceramic roof tiles in close-up"),
    partner("roofing", "atlantique", "Stone-coated roofing sheets", "stone-coated-roofing-sheets", "Dark tile-profile metal roofing sheets"),
    partner("roofing", "atlantique", "Roofing shingles", "roofing-shingles", "Close-up of grey granule-surfaced asphalt roofing shingles"),
    generic("roofing", "ridge-and-hip-caps", "Ridge and hip caps", "Ridge and hip cap tiles on a terracotta tiled roof against a blue sky"),
    generic("roofing", "roof-underlay", "Roof underlay", "Roof underlay laid over rafters with timber battens fixed on top"),
    generic("roofing", "waterproofing-membranes", "Waterproofing membranes", "", true),
    generic("roofing", "roof-insulation", "Roof insulation", "Pink glass-wool insulation batts between timber framing"),
    generic("roofing", "gutters-and-downpipes", "Gutters and downpipes", "Red eaves gutter and white downpipe on a building against a blue sky"),
    generic("roofing", "roof-fasteners-and-fixings", "Roof fasteners and fixings", "Hex-head self-tapping screws with washers, close-up"),
    generic("roofing", "skylights", "Skylights", "Two red-framed roof windows on a dark clad roof"),
  ],
  doors: [
    partner("doors", "staly", "Main entrance doors", "main-entrance-doors", "Black front door with a small glazed panel on a white house porch"),
    partner("doors", "staly", "Bedroom doors", "bedroom-doors", "White two-panel interior door with a black lever handle and hinges"),
    partner("doors", "staly", "Luxury and semi-luxury doors", "luxury-and-semi-luxury-doors", "Carved wooden double door with brass fittings in a marble frame"),
    partner("doors", "staly", "Security doors", "security-doors", "Two reinforced grey steel doors on a white brick wall"),
    partner("doors", "leoplast", "UPVC windows", "upvc-windows", "White double-casement window with tilt handles and curtains"),
    partner("doors", "leoplast", "UPVC doors", "upvc-doors", "White double-leaf glazed balcony door in a modern kitchen"),
    generic("doors", "door-frames", "Door frames", "Tall painted wooden door in a full frame with a glazed transom"),
    generic("doors", "door-and-window-hardware", "Door and window hardware", "Steel lever door handle and lock on a white panelled door, black and white"),
    generic("doors", "mosquito-mesh", "Mosquito mesh", "White-framed window fitted with an insect screen mesh"),
  ],
  sealants: [
    generic("sealants", "silicone-sealants", "Silicone sealants", "Sealant nozzle laying a bead along a window sill"),
    generic("sealants", "polyurethane-sealants", "Polyurethane (PU) sealants", "", true),
    generic("sealants", "acrylic-sealants", "Acrylic sealants", "Three sealant cartridges with nozzles against a white wall"),
    generic("sealants", "expanding-pu-foam", "Expanding PU foam", "Cured orange expanding foam filling a gap beside a wall"),
    generic("sealants", "construction-adhesives", "Construction adhesives", "Beads of adhesive laid along plywood panels"),
    generic("sealants", "waterproofing-compounds", "Waterproofing compounds", "Gloved hand rolling black waterproofing coating onto a roof surface"),
    generic("sealants", "backer-rods", "Backer rods", "", true),
    generic("sealants", "masking-and-sealing-tapes", "Masking and sealing tapes", "Rolls of masking tape and fibreglass mesh tape stacked together"),
    generic("sealants", "caulking-guns", "Caulking guns", "Gloved hand holding a caulking gun loaded with a cartridge"),
    generic("sealants", "anchors-screws-and-fasteners", "Anchors, screws and fasteners", "Pile of screws and plastic wall anchors on a red background"),
  ],
};

// The doors showcase photo is a tall close-up of a window pane, too weak for a wide page hero, so that page uses the STALY photo.
const heroOverride: Partial<Record<CategoryId, { photo: string; photoAlt: string; focus?: string }>> = {
  doors: { photo: "/images/brands/staly.jpg", photoAlt: "Brushed steel door set in a red brick wall", focus: "30% center" },
};

// Route id, category copy and hero photo for each page. The route id doubles as the category id in site-data.ts.
export const categoryPages = (["roofing", "doors", "sealants"] as const).map(id => {
  const category = categories.find(c => c.id === id)!;
  const showcase = products.find(p => p.id === id)!;
  const hero = heroOverride[id] ?? { photo: showcase.photo, photoAlt: showcase.photoAlt, focus: category.focus };
  return { id, path: `/${id}`, category, hero, list: categoryProducts[id] };
});
export type CategoryPageData = (typeof categoryPages)[number];

// Brands whose pages are linked from each category page.
export const categoryBrands: Record<CategoryId, string[]> = { roofing: ["atlantique"], doors: ["staly", "leoplast"], sealants: [] };

// The homepage shows this many cards per category; "Show more" appears only when a category has more.
export const HOME_PRODUCT_LIMIT = 4;
