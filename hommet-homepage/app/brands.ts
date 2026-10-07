// Partner brands shown on /brands/[slug]. Logos, photos and product ranges are placeholders until Hommet supplies final assets.
export type Brand = {
  slug: string;
  name: string;
  wordmark: string; // Class from globals.css used to style the text wordmark until a real logo is supplied.
  category: string;
  tagline: string;
  intro: string;
  accent: string;
  image: string;
  focus?: string;
  imageAlt: string;
  quoteSubject: string;
  website: string;
  products: { name: string; detail: string }[];
  note?: string;
};

export const brands: Brand[] = [
  {
    slug: "atlantique",
    name: "Atlantique",
    wordmark: "atlantique-word",
    category: "Roofing",
    tagline: "A home begins with a vision. A roof completes it.",
    intro: "Roofing leads our range of building and living solutions. Discover roofing with Atlantique, brought to you by Hommet.",
    accent: "var(--olive-deep)",
    image: "/images/brands/atlantique.jpg",
    focus: "center 55%",
    imageAlt: "Dark grey profiled roof tiles in bright light",
    quoteSubject: "Atlantique roofing",
    website: "https://atlantiqueroof.com/",
    products: [
      {
        "name": "Ceramic roof tiles",
        "detail": "Clay-style tiles for durable roofs with a traditional look."
      },
      {
        "name": "Stone-coated roofing sheets",
        "detail": "Coated metal sheets built for weather resistance."
      },
      {
        "name": "Roofing shingles",
        "detail": "Design-led shingle roofing for residential buildings."
      }
    ],
  },
  {
    slug: "armstrong",
    name: "Armstrong",
    wordmark: "armstrong-word",
    category: "Fluid Technology",
    tagline: "The systems behind your space.",
    intro: "Hommet is the authorised representative of Armstrong Fluid Technology in Kerala, covering energy optimization and pumping solutions.",
    accent: "#233B50",
    image: "/images/brands/armstrong.jpg",
    focus: "center 45%",
    imageAlt: "Teal pumps with blue pipework and a pressure gauge in a plant room",
    quoteSubject: "Armstrong fluid technology",
    website: "https://armstrongfluidtechnology.com/",
    products: [
      {
        "name": "Pumps",
        "detail": "Circulation pumps for building services."
      },
      {
        "name": "Circulators",
        "detail": "Compact circulating units for heating and cooling loops."
      },
      {
        "name": "Heat exchangers",
        "detail": "Equipment for thermal transfer between fluid loops."
      },
      {
        "name": "Booster packages",
        "detail": "Packaged pressure-boosting systems."
      },
      {
        "name": "Packaged systems",
        "detail": "Pre-configured HVAC equipment packages."
      },
      {
        "name": "Fire safety products",
        "detail": "Fire pumps and related protection equipment."
      }
    ],
    note: "Technical enquiries go to Nirmal Kiran, nirmal.kiran@hommet.in, +91 90721 21337.",
  },
  {
    slug: "staly",
    name: "STALY",
    wordmark: "staly-word",
    category: "Steel doors",
    tagline: "A welcome to your world.",
    intro: "Explore STALY steel doors with Hommet. Speak to us about your space and requirements.",
    accent: "var(--forest)",
    image: "/images/brands/staly.jpg",
    focus: "30% center",
    imageAlt: "Brushed steel door set in a red brick wall",
    quoteSubject: "STALY steel doors",
    website: "",
    products: [
      {
        "name": "Main entrance doors",
        "detail": "Steel doors for house entrances."
      },
      {
        "name": "Bedroom doors",
        "detail": "Interior steel doors for rooms."
      },
      {
        "name": "Luxury and semi-luxury doors",
        "detail": "Decorative steel doors in classic and semi-luxury finishes."
      },
      {
        "name": "Security doors",
        "detail": "Security-oriented steel doors."
      }
    ],
  },
  {
    slug: "leoplast",
    name: "Leoplast",
    wordmark: "leoplast-word",
    category: "UPVC",
    tagline: "Light, air and lasting frames.",
    intro: "Explore Leoplast UPVC doors and windows with Hommet. Tell us about your project and we will help with the options.",
    accent: "var(--olive-deep)",
    image: "/images/brands/leoplast.jpg",
    focus: "center 40%",
    imageAlt: "Two white-framed windows on a yellow wall",
    quoteSubject: "Leoplast UPVC",
    website: "",
    products: [
      {
        "name": "UPVC windows",
        "detail": "Ask our team for the available window options."
      },
      {
        "name": "UPVC doors",
        "detail": "Ask our team for the available door options."
      }
    ],
  },
];

export const brandBySlug = (slug: string) => brands.find(b => b.slug === slug);
