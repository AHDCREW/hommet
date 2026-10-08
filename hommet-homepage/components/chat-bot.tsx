"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, RotateCcw, X } from "lucide-react";
import { bot, greetingFor, reply, teaserFor, type ChatReply } from "@/app/chat-script";
import { themeHref } from "@/app/themes";
import { useTheme } from "@/components/theme-context";

type Message = { id: number; from: "bot"; reply: ChatReply } | { id: number; from: "user"; text: string };
const start = (brand?: string): Message[] => [{ id: 0, from: "bot", reply: greetingFor(brand) }];
const SEEN = "homi-teaser-seen";
const REMIND = 8000; // ms before the pop-up comes back after it is closed with the X
const external = (href: string) => href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {};

// True while the launcher sits over a hero image (home slider or brand page). The launcher and its bubble are glass
// there and go back to solid white/dark below it (see chat-glass.css in app/home1 and app/home2). Without a hero it stays false.
function useOverHero(launcher: React.RefObject<HTMLButtonElement | null>) {
  const [over, setOver] = useState(false);
  useEffect(() => {
    const hero = document.querySelector(".shop-hero, .brand-hero");
    if (!hero) return;
    let frame = 0;
    const check = () => {
      frame = 0;
      const button = launcher.current?.getBoundingClientRect();
      if (!button) return;
      const y = button.top + button.height / 2, box = hero.getBoundingClientRect();
      setOver(box.top < y && box.bottom > y);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(check); };
    schedule();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    return () => { cancelAnimationFrame(frame); removeEventListener("scroll", schedule); removeEventListener("resize", schedule); };
  }, [launcher]);
  return over;
}

function BotMessage({ id, reply, onNavigate }: { id: number; reply: ChatReply; onNavigate: () => void }) {
  const { card, text, list, links } = reply;
  const theme = useTheme();
  return <div className="chat-row" data-msg={id}>
    <img src={theme.avatar} alt="" width="30" height="30" />
    <div className="chat-stack">
      {card && <figure className={`chat-card${card.contain ? " contain" : ""}`}><img src={`/images/hero/${card.image}`} alt={card.alt} loading="lazy" /><figcaption><strong>{card.name}</strong><span>{card.label}</span></figcaption></figure>}
      {text.map(t => <p key={t} className="chat-msg">{t}</p>)}
      {list && <ul className="chat-list">{list.map(item => <li key={item.title}><strong>{item.title}</strong><span>{item.detail}</span>{item.href && <a href={item.href} target="_blank" rel="noreferrer">Get directions <ArrowUpRight size={13} /></a>}</li>)}</ul>}
      {links && <div className="chat-links">{links.map(link => { const href = themeHref(theme, link.href); return <a key={link.href} href={href} {...external(href)} onClick={link.href.startsWith("#") || link.href.startsWith("/#") ? onNavigate : undefined}>{link.label}<ArrowUpRight size={15} /></a>; })}</div>}
    </div>
  </div>;
}

export function ChatBot({ brand }: { brand?: string }) {
  const { avatar } = useTheme();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => start(brand));
  const [typing, setTyping] = useState(false);
  const ids = useRef(1);
  const timer = useRef(0);
  const opened = useRef(false);
  const scroller = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const overHero = useOverHero(launcher);
  const last = messages[messages.length - 1];
  // Pop-up beside the launcher: -1 shows typing dots, 0 and up are message indexes, null is hidden.
  const [teaser, setTeaser] = useState<number | null>(null);
  const lines = teaserFor(brand);
  const seen = useRef(false);
  const remind = useRef(0);
  // Opening the chat retires the pop-up for the visit; closing it with the X only hides it until the next reminder.
  const dismissTeaser = () => { seen.current = true; window.clearTimeout(remind.current); setTeaser(null); try { sessionStorage.setItem(SEEN, "1"); } catch { } };
  const closeTeaser = () => { seen.current = true; setTeaser(null); window.clearTimeout(remind.current); remind.current = window.setTimeout(() => setTeaser(0), REMIND); };

  // Greet once per visit: typing dots, a hello, then the quote nudge, then it tucks itself away.
  useEffect(() => {
    try { if (sessionStorage.getItem(SEEN)) return; } catch { }
    const steps: [number, number | null][] = [[3000, -1], [4200, 0], [10500, 1], [18000, null]];
    const timers = steps.map(([ms, value]) => window.setTimeout(() => { if (seen.current) return; setTeaser(value); if (value === null) { seen.current = true; try { sessionStorage.setItem(SEEN, "1"); } catch { } } }, ms));
    return () => timers.forEach(window.clearTimeout);
  }, []);

  useEffect(() => () => { window.clearTimeout(timer.current); window.clearTimeout(remind.current); }, []);
  useEffect(() => {
    if (open) { opened.current = true; panel.current?.focus(); }
    else if (opened.current) launcher.current?.focus();
  }, [open]);
  // Show each new reply together with the question that prompted it, even when the reply is taller than the panel.
  useEffect(() => {
    const el = scroller.current;
    if (!el || !open) return;
    const latest = !typing && last.from === "bot" ? el.querySelector<HTMLElement>(`[data-msg="${last.id}"]`) : null;
    const anchor = (latest?.previousElementSibling ?? latest) as HTMLElement | null;
    el.scrollTo({ top: anchor ? anchor.offsetTop - 16 : el.scrollHeight, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [last, typing, open]);

  const ask = (text: string, topic: string) => {
    if (typing) return;
    const id = ids.current;
    ids.current += 2;
    setMessages(m => [...m, { id, from: "user", text }]);
    setTyping(true);
    timer.current = window.setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, { id: id + 1, from: "bot", reply: reply(topic) }]);
    }, 700);
  };
  const restart = () => { window.clearTimeout(timer.current); setTyping(false); setMessages(start(brand)); };

  return <div className={`chatbot${overHero ? " on-hero" : ""}`}>
    <div className="chat-panel" id="chat-panel" ref={panel} role="dialog" aria-label={`Chat with ${bot.name}`} tabIndex={-1} hidden={!open} onKeyDown={e => { if (e.key === "Escape") setOpen(false); }}>
      <div className="chat-head">
        <img src={avatar} alt="" width="42" height="42" />
        <div><strong>{bot.name}</strong><span>{bot.role}</span></div>
        <button onClick={restart} aria-label="Start over"><RotateCcw size={17} /></button>
        <button onClick={() => setOpen(false)} aria-label="Close chat"><X size={20} /></button>
      </div>
      <div className="chat-scroll" ref={scroller}>
        <div className="chat-log" role="log" aria-live="polite">
          {messages.map(m => m.from === "user" ? <p key={m.id} className="chat-msg chat-user">{m.text}</p> : <BotMessage key={m.id} id={m.id} reply={m.reply} onNavigate={() => setOpen(false)} />)}
          {typing && <div className="chat-typing" aria-hidden="true"><span /><span /><span /></div>}
        </div>
        {!typing && last.from === "bot" && <div className="chat-options" role="group" aria-label="Suggested replies">{last.reply.options.map(o => <button key={o.topic} onClick={() => ask(o.label, o.topic)}>{o.label}</button>)}</div>}
      </div>
    </div>
    {teaser !== null && !open && <div className="chat-teaser" role="status">
      <button className="chat-teaser-open" onClick={() => { dismissTeaser(); setOpen(true); }}>
        {teaser < 0
          ? <span className="chat-teaser-dots" aria-label="Homi is typing"><span /><span /><span /></span>
          : <span key={teaser} className="chat-teaser-text">{lines[teaser]}<small>Tap to chat</small></span>}
      </button>
      <button className="chat-teaser-x" onClick={closeTeaser} aria-label="Dismiss"><X size={12} /></button>
    </div>}
    <button ref={launcher} className={`chat-launcher${open ? " open" : ""}${teaser !== null ? " nudge" : ""}`} onClick={() => { dismissTeaser(); setOpen(o => !o); }} aria-expanded={open} aria-controls="chat-panel">
      {open ? <X size={22} /> : <span className="chat-icon"><img src={avatar} alt="" width="44" height="44" /><i className="chat-online" aria-hidden="true" /></span>}<span>{open ? "Close chat" : `Ask ${bot.name}`}</span>
    </button>
  </div>;
}
