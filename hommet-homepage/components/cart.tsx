"use client";

import { useState, useSyncExternalStore } from "react";
import { ArrowLeft, Check, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { products, formatPrice } from "@/app/shop-data";
import { whatsapp } from "@/app/site-data";

type Line = { id: string; qty: number };
type State = { lines: Line[]; open: boolean };

// A tiny shared store, so the header button, the showcase and the drawer stay in sync. Lines persist in localStorage.
const KEY = "hommet-cart";
const empty: State = { lines: [], open: false };
let state: State = empty;
let hydrated = false;
const listeners = new Set<() => void>();
const set = (next: Partial<State>) => {
  state = { ...state, ...next };
  if (next.lines) localStorage.setItem(KEY, JSON.stringify(state.lines));
  listeners.forEach(l => l());
};
const snapshot = () => {
  if (!hydrated) {
    hydrated = true;
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      if (Array.isArray(saved)) state = { ...state, lines: saved.filter((l): l is Line => products.some(p => p.id === l?.id) && Number.isInteger(l?.qty) && l.qty > 0) };
    } catch { /* ignore a corrupted cart */ }
  }
  return state;
};
const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };

export const cart = {
  add: (id: string, qty = 1) => set({ lines: state.lines.some(l => l.id === id) ? state.lines.map(l => l.id === id ? { ...l, qty: Math.min(l.qty + qty, 999) } : l) : [...state.lines, { id, qty }] }),
  setQty: (id: string, qty: number) => set({ lines: qty < 1 ? state.lines.filter(l => l.id !== id) : state.lines.map(l => l.id === id ? { ...l, qty: Math.min(qty, 999) } : l) }),
  clear: () => set({ lines: [] }),
  setOpen: (open: boolean) => set({ open }),
};

export function useCart() {
  const { lines, open } = useSyncExternalStore(subscribe, snapshot, () => empty);
  const items = lines.flatMap(l => { const product = products.find(p => p.id === l.id); return product ? [{ product, qty: l.qty }] : []; });
  return { items, open, count: lines.reduce((n, l) => n + l.qty, 0), total: items.reduce((n, i) => n + i.product.price * i.qty, 0) };
}

export function CartButton() {
  const { count } = useCart();
  return <button className="cart-button" onClick={() => cart.setOpen(true)} aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}>
    <ShoppingBag size={20}/>{count > 0 && <span key={count} className="cart-count">{count > 99 ? "99+" : count}</span>}
  </button>;
}

export function Stepper({ value, onChange, label }: { value: number; onChange: (n: number) => void; label: string }) {
  return <div className="shop-stepper" role="group" aria-label={`Quantity for ${label}`}>
    <button onClick={() => onChange(value - 1)} aria-label="Decrease quantity"><Minus size={15}/></button>
    <span aria-live="polite">{value}</span>
    <button onClick={() => onChange(value + 1)} aria-label="Increase quantity" disabled={value >= 999}><Plus size={15}/></button>
  </div>;
}

export function CartDrawer() {
  const { items, open, count, total } = useCart();
  const [step, setStep] = useState<"cart" | "checkout" | "sent">("cart");
  const [form, setForm] = useState({ name: "", phone: "", city: "", notes: "" });
  const close = (o: boolean) => { cart.setOpen(o); if (!o && step === "sent") setStep("cart"); };
  // Prices are placeholders, so the order lists products and quantities only.
  const order = () => whatsapp([
    ["Hello Hommet, I would like to place an order:", ...items.map((i, n) => `${n + 1}. ${i.product.name} × ${i.qty} (${i.product.unit})`)].join("\n"),
    [`Name: ${form.name}`, `Phone: ${form.phone}`, form.city && `City: ${form.city}`, form.notes && `Notes: ${form.notes}`].filter(Boolean).join("\n"),
    "Please confirm prices and availability.",
  ].join("\n\n"));

  return <Sheet open={open} onOpenChange={close}>
    <SheetContent className="shop-drawer" showCloseButton={false}>
      <div className="shop-drawer-head">
        {step === "checkout" ? <button onClick={() => setStep("cart")} aria-label="Back to cart"><ArrowLeft size={20}/></button> : <span/>}
        <div><SheetTitle>{step === "checkout" ? "Checkout" : step === "sent" ? "Order ready" : "Your cart"}</SheetTitle><SheetDescription>{step === "sent" ? "Finish sending it in WhatsApp" : `${count} item${count === 1 ? "" : "s"}`}</SheetDescription></div>
        <button onClick={() => close(false)} aria-label="Close cart"><X size={20}/></button>
      </div>

      {step === "sent" ? <div className="shop-drawer-done">
        <span className="shop-done-icon"><Check size={28}/></span>
        <h3>Your order is in WhatsApp</h3>
        <p>Send the message to the Hommet team. They will confirm prices, availability and delivery with you.</p>
        <button className="shop-btn dark" onClick={() => { cart.clear(); setStep("cart"); cart.setOpen(false); }}>Done, clear my cart</button>
        <a className="shop-btn ghost" href={order()} target="_blank" rel="noreferrer">Open WhatsApp again</a>
      </div> : items.length === 0 ? <div className="shop-drawer-empty">
        <ShoppingBag size={34} strokeWidth={1.4}/>
        <h3>Your cart is empty</h3>
        <p>Browse the showcase and add products to start an order.</p>
        <button className="shop-btn dark" onClick={() => close(false)}>Continue browsing</button>
      </div> : step === "cart" ? <>
        <ul className="shop-lines">{items.map(({ product, qty }) => <li key={product.id}>
          <img className={product.contain ? "contain" : ""} src={product.photo} alt="" width="72" height="72"/>
          <div className="shop-line-info"><strong>{product.name}</strong><span>{formatPrice(product.price)} / {product.unit}</span><Stepper value={qty} onChange={n => cart.setQty(product.id, n)} label={product.name}/></div>
          <div className="shop-line-end"><strong>{formatPrice(product.price * qty)}</strong><button onClick={() => cart.setQty(product.id, 0)} aria-label={`Remove ${product.name}`}><Trash2 size={16}/></button></div>
        </li>)}</ul>
        <div className="shop-drawer-foot">
          <div className="shop-total"><span>Estimated total</span><strong>{formatPrice(total)}</strong></div>
          <p className="shop-fine">Sample prices for preview. Hommet confirms the final quote before you pay.</p>
          <button className="shop-btn accent" onClick={() => setStep("checkout")}>Checkout</button>
        </div>
      </> : <form className="shop-checkout" onSubmit={e => { e.preventDefault(); window.open(order(), "_blank", "noreferrer"); setStep("sent"); }}>
        <label>Full name<input required autoComplete="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}/></label>
        <label>Phone<input required type="tel" autoComplete="tel" inputMode="tel" pattern="[0-9+ \(\)\-]{10,}" title="Enter a phone number with at least 10 digits" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}/></label>
        <label>City<input autoComplete="address-level2" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}/></label>
        <label>Notes<textarea rows={3} placeholder="Site details, sizes, preferred delivery date…" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}/></label>
        <div className="shop-summary">{items.map(({ product, qty }) => <div key={product.id}><span>{product.name} × {qty}</span><span>{formatPrice(product.price * qty)}</span></div>)}<div className="shop-total"><span>Estimated total</span><strong>{formatPrice(total)}</strong></div></div>
        <button className="shop-btn accent" type="submit">Place order on WhatsApp</button>
        <p className="shop-fine">Your order opens in WhatsApp, addressed to Hommet. Nothing is charged online.</p>
      </form>}
    </SheetContent>
  </Sheet>;
}
