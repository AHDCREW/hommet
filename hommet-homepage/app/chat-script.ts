import { categories, offices, enquiry, quotation } from "./site-data";
import { brandBySlug } from "./brands";

// Homi is a scripted guide: visitors pick from suggested topics, and every answer below is predefined.
// The avatar differs per palette, so it lives in app/themes.ts.
export const bot = { name: "Homi", role: "Hommet guide · Automated replies" };

export type ChatOption = { label: string; topic: string };
export type ChatReply = {
  text: string[];
  card?: (typeof categories)[number];
  list?: { title: string; detail: string; href?: string }[];
  links?: { label: string; href: string }[];
  options: ChatOption[];
};

const menu: ChatOption[] = [
  {label:"Get a quote",topic:"quote"},
  {label:"Explore our solutions",topic:"solutions"},
  {label:"Roofing with Atlantique",topic:"roofing"},
  {label:"Our partner brands",topic:"partners"},
  {label:"Technical consultation",topic:"technical"},
  {label:"Visit our offices",topic:"offices"},
  {label:"Become a dealer / partner",topic:"dealer"},
  {label:"Talk to our team",topic:"team"},
];
const back: ChatOption = {label:"Main menu",topic:"menu"};
const team: ChatOption = {label:"Talk to our team",topic:"team"};

export const greeting: ChatReply = {text:[`Hello, I’m ${bot.name}, Hommet’s guide.`,"I can point you to the right solution, partner brand or person on our team. What can I help you with?"],options:menu};

// Short messages Homi shows in the pop-up beside the launcher before the chat is opened.
export function teaserFor(slug?: string): string[] {
  const brand = slug ? brandBySlug(slug) : undefined;
  return brand ? [`Hi, I’m ${bot.name}, Hommet’s guide.`, `Want a quote for ${brand.name}? I’ll set it up for you.`] : [`Hi, I’m ${bot.name}, Hommet’s guide.`, "Planning a build? I can prepare a quote in a tap."];
}

// On a brand page Homi opens with that brand's own options instead of the general menu.
export function greetingFor(slug?: string): ChatReply {
  const brand = slug ? brandBySlug(slug) : undefined;
  if (!brand) return greeting;
  return {
    text: [`Hello, I’m ${bot.name}. You’re looking at ${brand.name}, ${brand.category.toLowerCase()} brought to you by Hommet.`, "I can prepare a quote request or point you to the right person on our team."],
    links: [{label:`Get a quote for ${brand.name}`,href:quotation(brand.quoteSubject)}],
    options: [...(brand.slug === "armstrong" ? [{label:"Technical consultation",topic:"technical"}] : []),{label:"Our partner brands",topic:"partners"},team,back],
  };
}

export function reply(topic: string): ChatReply {
  const category = categories.find(c => `cat:${c.id}` === topic);
  if (category) return {card:category,text:[category.description],links:[{label:"Get a quote",href:quotation(category.name)}],options:[{label:"See another solution",topic:"solutions"},team,back]};
  switch (topic) {
    case "menu": return {text:["What would you like to look at next?"],options:menu};
    case "quote": return {text:["Which product would you like a quote for? Choose one and I’ll prepare the request for you to send on WhatsApp."],options:[...categories.map(c => ({label:c.name,topic:`cat:${c.id}`})),{label:"Something else / whole project",topic:"quote:project"},back]};
    case "quote:project": return {text:["Tell our team what you’re planning and they’ll help with options and pricing."],links:[{label:"Get a quote",href:quotation("my project")}],options:[team,back]};
    case "solutions": return {text:["From foundation to finishing touches, this is what we bring together. Choose one to learn more."],options:[...categories.map(c => ({label:c.name,topic:`cat:${c.id}`})),back]};
    case "roofing": return {text:["Roofing leads our range of building and living solutions. A home begins with a vision. A roof completes it.","Discover roofing with Atlantique, brought to you by Hommet."],links:[{label:"Get a quote for Atlantique roofing",href:quotation("Atlantique roofing")},{label:"See the roofing section",href:"/#roofing"}],options:[{label:"Our partner brands",topic:"partners"},team,back]};
    case "partners": return {text:["Specialist expertise across your home, with Hommet as your single point of contact."],list:[{title:"Atlantique",detail:"Roofing"},{title:"Armstrong Fluid Technology",detail:"Authorised representative, Kerala. Energy optimization & pumping solutions."},{title:"STALY",detail:"Steel doors"},{title:"Leoplast",detail:"UPVC"}],options:[{label:"Roofing with Atlantique",topic:"roofing"},{label:"Doors & Windows",topic:"cat:doors"},{label:"Technical consultation",topic:"technical"},back]};
    case "technical": return {text:["For consultants, HVAC contractors and project teams, Hommet is the authorised representative of Armstrong Fluid Technology in Kerala.","Armstrong enquiries go to Nirmal Kiran, Asst. Engineer, Energy Optimization & Pumping Solutions."],links:[{label:"Email nirmal.kiran@hommet.in",href:"mailto:nirmal.kiran@hommet.in?subject=Armstrong%20technical%20consultation"},{label:"Call +91 90721 21337",href:"tel:+919072121337"}],options:[{label:"Pumps & Fluid Systems",topic:"cat:pumps"},{label:"HVAC Solutions",topic:"cat:hvac"},back]};
    case "offices": return {text:["You’ll find Hommet in three locations."],list:offices.map(o => ({title:o.city,detail:o.address,href:`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.address)}`})),options:[team,back]};
    case "dealer": return {text:["We welcome dealer and partner enquiries.","Share a few details about your business and the region you cover, and our team will take it from there."],links:[{label:"Enquire on WhatsApp",href:enquiry("becoming a dealer / partner")}],options:[team,back]};
    case "team": return {text:["You can reach the Hommet team directly."],links:[{label:"WhatsApp +91 7306982905",href:enquiry()},{label:"Call +91 7306982905",href:"tel:+917306982905"},{label:"Email support@hommet.in",href:"mailto:support@hommet.in"}],options:[back]};
    default: return {text:["What would you like to look at next?"],options:menu};
  }
}
