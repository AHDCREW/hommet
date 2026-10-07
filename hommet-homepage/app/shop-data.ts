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

// Cut-out product shots on white don't work full-screen, so those products use their interior photo instead.
export const products = categories.map(c => ({ ...c, ...shop[c.id], category: c.name, photo: c.contain ? `/images/interiors/wide/${c.id}.jpg` : `/images/hero/${c.image}`, photoAlt: c.contain ? c.interiorAlt : c.alt }));
export type Product = (typeof products)[number];

export const formatPrice = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
