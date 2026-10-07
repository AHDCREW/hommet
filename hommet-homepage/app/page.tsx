"use client";

import { useState } from "react";
import { MessageCircle, Layers3, Handshake, House, Phone, Mail } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ProductShowcase } from "@/components/product-showcase";
import { ChatBot } from "@/components/chat-bot";
import { BrandTiles } from "@/components/brand-tiles";
import { CategoryShowcase } from "@/components/category-showcase";
import { CategoryProducts } from "@/components/category-products";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Headline, Intro, Pull, Reveal } from "@/components/reveal";
import SpotlightCard from "@/components/SpotlightCard";
import { categories, quotation } from "./site-data";

export default function Home() {
  const [selected, setSelected] = useState<(typeof categories)[number] | null>(null);
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <SiteHeader home/>
    <main id="main">
      <ProductShowcase/>
      <section className="solutions section" id="solutions"><div className="section-heading"><div><p className="eyebrow">01 / OUR SOLUTIONS</p><Headline lines={[{text:"A whole home."},{text:"A considered collection.",em:true}]}/></div><Intro>Building, finishing, living. Explore the full range of solutions, brought together by Hommet.</Intro></div><CategoryShowcase onSelect={setSelected}/><p className="image-note">Interior photography is illustrative, pending Hommet project photography. See image credits.</p></section>
      <CategoryProducts/>
      <section className="why section" id="why-hommet"><div className="section-heading"><div><p className="eyebrow">03 / THE HOMMET APPROACH</p><Headline lines={[{text:"Many possibilities."},{text:"One partner.",em:true}]}/></div><Intro>From the first material decision to the final detail, your home deserves a joined-up approach.</Intro></div><div className="principles">{[{icon:Layers3,title:"Built around the whole home",text:"Integrated building and living solutions, brought together under one roof."},{icon:Handshake,title:"Backed by trusted brands",text:"Internationally trusted partners, with Hommet as your point of contact."},{icon:House,title:"Rooted in understanding",text:"Rooted in Kerala. Earning trust across India. A building partner for your next chapter."}].map(({icon:Icon,title,text},i)=><Reveal key={title} className="principle-slot" delay={i*0.12}><SpotlightCard as="article" spotlightColor="rgba(38, 58, 27, 0.07)"><div className="principle-top"><Icon size={28} strokeWidth={1.25}/><span>0{i+1}</span></div><h3>{title}</h3><p>{text}</p></SpotlightCard></Reveal>)}</div></section>
      {/* Reveal here is fade and scale only: a vertical offset would shift the #roofing anchor while it animates in. */}
      <Reveal distance={0} scale={0.97} duration={1.1}><section className="roofing" id="roofing"><div className="roofing-image"><img src="/images/roofing-detail.jpg" alt="Detail of a dark metal roofing system; Roofit.Solar reference image" loading="lazy" width="1920" height="1080"/><span>ROOFING / OUR FLAGSHIP</span></div><div className="roofing-copy"><p className="eyebrow">04 / ABOVE IT ALL</p><Headline lines={[{text:"A home begins"},{text:"with a vision."},{text:"A roof completes it.",em:true}]}/><p>Roofing leads our range of building and living solutions. Discover roofing with Atlantique, brought to you by Hommet.</p><a className="button light" href={quotation("Atlantique roofing")} target="_blank" rel="noreferrer"><MessageCircle size={18}/>Get a quote</a><span className="roofing-brand">ATLANTIQUE <small>ROOFING BY HOMMET</small></span></div></section></Reveal>
      <section className="partners section" id="partners"><div className="section-heading"><div><p className="eyebrow">05 / OUR PARTNER BRANDS</p><Headline lines={[{text:"Trusted names."},{text:"One shared commitment.",em:true}]}/></div><Intro>Specialist expertise across your home. One customer-facing partner in Hommet.</Intro></div><BrandTiles/><div className="technical" id="armstrong"><div><p className="eyebrow">FOR CONSULTANTS & PROJECT TEAMS</p><h3>Armstrong Fluid Technology</h3><p>Authorised representative, Kerala. Energy optimization & pumping solutions.</p></div><a className="button technical-button" href="mailto:nirmal.kiran@hommet.in?subject=Armstrong%20technical%20consultation">Request technical consultation</a></div></section>
      <Reveal distance={0} scale={0.97} duration={1.1}><section className="contact section" id="contact"><div><p className="eyebrow">LET’S BUILD SOMETHING LASTING</p><Headline lines={[{text:"Your next chapter."},{text:"Let’s build it together.",em:true}]}/><p>Tell us what you’re planning. We’ll help you find where to begin.</p></div><div className="contact-actions"><Pull><a className="button" href={quotation("my project")} target="_blank" rel="noreferrer"><MessageCircle size={18}/>Get a quote</a></Pull><a href="tel:+917306982905"><Phone size={17}/> +91 7306982905</a><a href="mailto:support@hommet.in"><Mail size={17}/> support@hommet.in</a></div></section></Reveal>
    </main>
    <SiteFooter home/>
    <Dialog open={!!selected} onOpenChange={open=>{if(!open)setSelected(null)}}><DialogContent className="product-dialog">{selected&&<><img src={`/images/interiors/${selected.id}.jpg`} alt={selected.interiorAlt} width="960" height="1200"/><div className="product-dialog-copy"><p className="eyebrow">HOMMET SOLUTIONS</p><DialogTitle>{selected.name}</DialogTitle><DialogDescription>{selected.description}</DialogDescription><a className="button" href={quotation(selected.name)} target="_blank" rel="noreferrer"><MessageCircle size={18}/>Get a quote</a><p className="image-note">Illustrative category image. Ask us about the available range.</p></div></>}</DialogContent></Dialog>
    <ChatBot/>
  </>;
}
