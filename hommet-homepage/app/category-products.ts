import { brandBySlug } from "./brands";
import { categories } from "./site-data";
import { products } from "./shop-data";

// Product lists for the category pages (/roofing, /doors, /sealants, /terracotta, /pumps) and the matching homepage tabs.
// Terracotta and pumps list only products found in Hommet's Drive catalogues; the other categories have no page until
// their products are supplied.
// Items with a `brand` come from the partner data in brands.ts. Items without one are GENERIC product types that
// Hommet has not confirmed: they carry no brand, model or performance claim and read "Ask our team...".
// Replace them with confirmed products when the range is final. Partner products use photos from the partner catalogues in
// Hommet's Drive (Brochures & Technical Sheets); generic ones are illustrative stock (see image-credits.html).
export type CategoryProduct = { slug: string; name: string; detail: string; image: string; imageAlt: string; brand?: string };
export type CategoryId = "roofing" | "doors" | "sealants" | "terracotta" | "pumps";

const GENERIC_DETAIL = "Ask our team about the available options.";
const photo = (id: CategoryId, slug: string) => `/images/products/${id}/${slug}.jpg`;

// A partner product keeps the name and description written in brands.ts.
const partner = (id: CategoryId, brandSlug: string, name: string, slug: string, imageAlt: string): CategoryProduct => {
  const brand = brandBySlug(brandSlug);
  const item = brand?.products.find(p => p.name === name);
  if (!brand || !item) throw new Error(`Partner product not found: ${brandSlug} / ${name}`);
  return { slug, name, detail: item.detail, image: photo(id, slug), imageAlt, brand: brand.name };
};
// A product with no suitable stock photo (`noPhoto`) shows a category photo instead of a mismatched one: the roofing
// photo for roofing, and the kitchen interior for sealants (the sealants hero photo is already used by the Anchors card).
const fallbackPhoto = (id: CategoryId) => {
  if (id === "sealants") return { image: "/images/interiors/wide/sealants.jpg", imageAlt: categories.find(c => c.id === id)!.interiorAlt };
  const hero = products.find(p => p.id === id)!;
  return { image: hero.photo, imageAlt: hero.photoAlt };
};
// A product named in a partner catalogue whose brand has no page on the site (brand shown as a label only).
const catalogue = (id: CategoryId, brand: string, slug: string, name: string, detail: string, imageAlt: string): CategoryProduct =>
  ({ slug, name, detail, image: photo(id, slug), imageAlt, brand });
// KTC Product Gallery 2024 (Jallies.pdf). Sizes and weights as printed in the catalogue.
const ktc = (slug: string, name: string, detail: string, imageAlt: string) => catalogue("terracotta", "KTC", slug, name, detail, imageAlt);
const KTC_JALI = "Clay jali block, 205 × 205 × 63 mm, 2.5 kg.";
// Armstrong pump reference sheet and product range table (Armstrong_Products_Dealership.docx).
const armstrong = (slug: string, name: string, detail: string, imageAlt: string) => catalogue("pumps", "Armstrong", slug, name, detail, imageAlt);
const generic = (id: CategoryId, slug: string, name: string, imageAlt: string, noPhoto = false): CategoryProduct =>
  ({ slug, name, detail: GENERIC_DETAIL, ...(noPhoto ? fallbackPhoto(id) : { image: photo(id, slug), imageAlt }) });

export const categoryProducts: Record<CategoryId, CategoryProduct[]> = {
  roofing: [
    partner("roofing", "atlantique", "Ceramic roof tiles", "ceramic-roof-tiles", "Atlantique Elbano clay roof tile in Antique Red"),
    partner("roofing", "atlantique", "Stone-coated roofing sheets", "stone-coated-roofing-sheets", "Red stone-coated roof with a white ridge vent"),
    partner("roofing", "atlantique", "Roofing shingles", "roofing-shingles", "House roofed with grey Atlantique asphalt shingles"),
    partner("roofing", "leoplast", "ASA uPVC roofing sheets", "upvc-roofing-sheets", "Leo Plast ASA uPVC roof sheets fanned out in blue, red, teal and green"),
    generic("roofing", "ridge-and-hip-caps", "Ridge and hip caps", "Ridge and hip cap tiles on a terracotta tiled roof against a blue sky"),
    generic("roofing", "roof-underlay", "Roof underlay", "Roof underlay laid over rafters with timber battens fixed on top"),
    generic("roofing", "waterproofing-membranes", "Waterproofing membranes", "", true),
    generic("roofing", "roof-insulation", "Roof insulation", "Pink glass-wool insulation batts between timber framing"),
    generic("roofing", "gutters-and-downpipes", "Gutters and downpipes", "Red eaves gutter and white downpipe on a building against a blue sky"),
    generic("roofing", "roof-fasteners-and-fixings", "Roof fasteners and fixings", "Hex-head self-tapping screws with washers, close-up"),
    generic("roofing", "skylights", "Skylights", "Two red-framed roof windows on a dark clad roof"),
  ],
  doors: [
    partner("doors", "staly", "Main entrance doors", "main-entrance-doors", "STALY SD 91 steel door in a golden walnut wood finish"),
    partner("doors", "staly", "Bedroom doors", "bedroom-doors", "STALY SD 21 single-leaf steel door in a teak wood finish"),
    partner("doors", "staly", "Luxury and semi-luxury doors", "luxury-and-semi-luxury-doors", "STALY SD 45 double-leaf steel door in an antique rosewood finish with chrome handles"),
    partner("doors", "staly", "Security doors", "security-doors", "STALY SD 90 steel door in matt black"),
    partner("doors", "leoplast", "UPVC windows", "upvc-windows", "White double-casement window with tilt handles and curtains"),
    partner("doors", "leoplast", "UPVC doors", "upvc-doors", "White double-leaf glazed balcony door in a modern kitchen"),
    generic("doors", "door-frames", "Door frames", "Tall painted wooden door in a full frame with a glazed transom"),
    generic("doors", "door-and-window-hardware", "Door and window hardware", "Steel lever door handle and lock on a white panelled door, black and white"),
    generic("doors", "mosquito-mesh", "Mosquito mesh", "White-framed window fitted with an insect screen mesh"),
  ],
  sealants: [
    catalogue("sealants", "Silstone", "silicone-sealants", "Silicone sealants", "S-660 neutral silicone sealant: weather proof, anti-fungal, UV and moisture resistant. Clear or black.", "Silstone S-660 neutral silicone sealant cartridge"),
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
  terracotta: [
    ktc("amber-design-jali", "Amber Design jali", KTC_JALI, "Terracotta jali block with four leaf-shaped cut-outs crossing at a small centre hole"),
    ktc("four-petal-design-jali", "Four Petal Design jali", KTC_JALI, "Terracotta jali block with a flower-shaped cut-out pattern around a small centre hole"),
    ktc("opel-design-jali", "Opel Design jali", KTC_JALI, "Terracotta jali block with a ring at the centre framed by curved cut-outs"),
    ktc("square-design-jali", "Square Design jali", KTC_JALI, "Terracotta jali block with a grid of rectangular cut-outs"),
    ktc("zibra-design-jali", "Zibra Design jali", KTC_JALI, "Terracotta jali block with diagonal stripe cut-outs"),
    ktc("lotus-design-jali", "Lotus Design jali", KTC_JALI, "Terracotta jali block with sweeping curved cut-outs"),
    ktc("jade-design-jali", "Jade Design jali", KTC_JALI, "Terracotta jali block with interlocking circular cut-outs"),
    ktc("lily-design-jali", "Lily Design jali", KTC_JALI, "Terracotta jali block with tall curved cut-outs meeting at the base"),
    ktc("diamond-design-jali", "Diamond Design jali", KTC_JALI, "Open terracotta jali block of interlocking diamond shapes"),
    ktc("cube-design-jali", "Cube Design jali", KTC_JALI, "Terracotta jali block with two square and two round cut-outs"),
    ktc("arrow-design-jali", "Arrow Design jali", KTC_JALI, "Terracotta jali block with fan-shaped cut-outs rising from the base"),
    ktc("pearl-design-jali", "Pearl Design jali", KTC_JALI, "Terracotta jali block with an ornamental cut-out pattern around a central ring"),
    ktc("swastik-design-jali", "Swastik Design jali", KTC_JALI, "Terracotta jali block with interlocking rectangular cut-outs in a pinwheel pattern"),
    ktc("slice-design-jali", "Slice Design jali", KTC_JALI, "Terracotta jali block with one diagonal half open and the other closed"),
    ktc("window-design-jali", "Window Design jali", "Clay jali block, 220 × 220 × 63 mm, 2 kg.", "Open square terracotta jali frame"),
    ktc("camp-design-jali", "Camp Design jali", "Louvred clay jali block, 205 × 205 × 63 mm, 2.5 kg.", "Terracotta jali block with a closed face and an opening along the bottom"),
    ktc("w-design-jali", "W Design jali", "Clay jali block, 317.5 × 205 × 76 mm, 4.2 kg.", "Terracotta jali block shaped like the letter W"),
    ktc("ceiling-tile", "Ceiling tile", "Clay ceiling tile with an embossed pattern, 304 × 204 mm, 1.7 kg.", "Terracotta ceiling tile with an embossed ornamental pattern"),
    ktc("roman-roof-tile", "Roman roof tile", "Clay roof tile, 406 × 256 mm, 2.6 kg.", "Interlocking terracotta Roman roof tile standing upright"),
    ktc("facing-tile", "Facing tile", "Clay facing tile for walls, 229 × 76 × 12 mm, 450 g.", "Slim terracotta facing tile standing upright"),
    ktc("elevation-tile", "Elevation tile", "Clay elevation tile for wall cladding, 229 × 76 × 12 mm, 450 g.", "Slim terracotta elevation tile standing upright"),
  ],
  pumps: [
    armstrong("fire-protection-pumps", "Fire protection pumps", "UL/FM listed fire pumps, electric or diesel driven, supplied as packaged systems.", "Armstrong diesel-driven fire pump package on a red skid frame"),
    armstrong("in-line-pumps", "In-line pumps", "4300 series vertical in-line pumps with variable-speed (VFD) control, built for high efficiency.", "Armstrong vertical in-line pump with a variable-speed drive on top"),
    armstrong("end-suction-pumps", "End suction pumps", "4030 series end suction pumps of robust design for HVAC and general-purpose duty, in a wide range.", "Armstrong end suction pump with an integrated drive"),
    armstrong("sump-sewage-pumps", "Sump and sewage pumps", "Legacy 5200/5240 series submersible and dry-pit pumps with solids handling.", "Red Armstrong pump with a grey variable-speed drive panel"),
    armstrong("booster-pump-systems", "Booster pump systems", "Packaged booster systems for domestic and commercial buildings, designed for easy integration.", "Armstrong booster set of three vertical pumps with a control panel"),
    armstrong("intelligent-fluid-management", "Intelligent Fluid Management (iFMS)", "Pump controllers with BMS integration and remote monitoring.", "Armstrong packaged pumping system of several pumps on shared headers with control panels"),
  ],
};

// Route id, category copy and hero photo (the same showcase photo as the homepage slider) for each page.
// The route id doubles as the category id in site-data.ts.
export const categoryPages = (["roofing", "doors", "sealants", "terracotta", "pumps"] as const).map(id => {
  const category = categories.find(c => c.id === id)!;
  const showcase = products.find(p => p.id === id)!;
  const hero = { photo: showcase.photo, photoAlt: showcase.photoAlt, focus: category.focus };
  return { id, path: `/${id}`, category, hero, list: categoryProducts[id] };
});
export type CategoryPageData = (typeof categoryPages)[number];

// Brands whose pages are linked from each category page.
export const categoryBrands: Record<CategoryId, string[]> = { roofing: ["atlantique", "leoplast"], doors: ["staly", "leoplast"], sealants: [], terracotta: [], pumps: ["armstrong"] };

// The homepage shows this many cards per category; "Show more" appears only when a category has more.
export const HOME_PRODUCT_LIMIT = 4;
