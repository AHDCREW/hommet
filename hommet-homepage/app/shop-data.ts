import { categories } from "./site-data";

// PLACEHOLDER PRICES: sample figures for layout only, shown with a "Sample price" label.
// Replace with confirmed prices before launch. Checkout never sends these to the customer as a quote.
const shop: Record<string, { name: string; brand: string; price: number; unit: string }> = {
  roofing:{name:"Atlantique Roofing",brand:"Atlantique",price:145,unit:"sq. ft"},
  doors:{name:"Steel Doors & UPVC Windows",brand:"STALY · Leoplast",price:18500,unit:"unit"},
  sealants:{name:"Construction Sealants",brand:"Hommet",price:450,unit:"tube"},
  terracotta:{name:"Architectural Terracotta",brand:"Hommet",price:95,unit:"sq. ft"},
  sanitary:{name:"Sanitary Ware",brand:"Hommet",price:6800,unit:"piece"},
  toilets:{name:"Smart Toilets",brand:"Hommet",price:42000,unit:"unit"},
  fitness:{name:"Home Fitness Equipment",brand:"Hommet",price:38000,unit:"unit"},
  hvac:{name:"HVAC Solutions",brand:"Hommet",price:45000,unit:"unit"},
  pumps:{name:"Armstrong Pumps",brand:"Armstrong Fluid Technology",price:24000,unit:"unit"},
  automation:{name:"Building Automation",brand:"Hommet",price:15000,unit:"system"},
};

// Full-screen photos for the hero slider and the /roofing, /doors and /sealants page heroes: public/images/showcase/<id>.jpg,
// landscape, 2400 px wide (roofing is 2000), with the subject near the centre so phone crops still work.
const showcaseAlt: Record<string, string> = {
  roofing:"House with a standing-seam roof",
  doors:"Honey-toned wooden front door flanked by two white-framed windows on a teal porch",
  sealants:"Screws and plastic wall anchors on a red background",
  terracotta:"Curving terracotta-coloured facade with textured clay-toned bands in strong sunlight",
  sanitary:"Bright modern bathroom with a double wooden vanity, marble top, grey taps and two oval mirrors",
  toilets:"Bright beige bathroom with a wall-hung toilet, bidet spray, bathtub and vessel-basin vanity",
  fitness:"Bright home gym with benches, an exercise bike and a dumbbell rack beside a large window onto plants",
  hvac:"White outdoor air-conditioner unit mounted on a white wall against a clear blue sky",
  pumps:"Two industrial centrifugal pumps with electric motors and green pipework",
  automation:"Modern black wall-mounted digital thermostat with a rotary knob on a minimalist interior wall",
};
export const products = categories.map(c => ({ ...c, ...shop[c.id], category: c.name, photo: `/images/showcase/${c.id}.jpg`, photoAlt: showcaseAlt[c.id] }));
export type Product = (typeof products)[number];

export const formatPrice = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
