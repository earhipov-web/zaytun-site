import * as React from "react";
import { findService } from "@/data/site";

/** price — цена к оплате, basePrice — цена без скидки */
export type CartItem = { id: string; title: string; price: number; basePrice?: number; qty: number; note?: string };

type CartCtx = {
  items: CartItem[];
  count: number;
  total: number;
  /** сумма без скидок */
  fullTotal: number;
  discount: number;
  add: (id: string, opts?: { price?: number; basePrice?: number; note?: string }) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  lastAdded: number;
};

const Ctx = React.createContext<CartCtx | null>(null);
const KEY = "zaytun-cart";

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>(load);
  const [lastAdded, setLastAdded] = React.useState(0);

  React.useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* storage недоступен — корзина живёт до перезагрузки */
    }
  }, [items]);

  const add: CartCtx["add"] = (id, opts) => {
    const s = findService(id);
    if (!s) return;
    const key = opts?.note ? `${id}:${opts.note}` : id;
    setItems((prev) => {
      const found = prev.find((i) => i.id === key);
      if (found) return prev.map((i) => (i.id === key ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { id: key, title: s.title, price: opts?.price ?? s.price, basePrice: Math.max(opts?.basePrice ?? s.price, opts?.price ?? s.price), qty: 1, note: opts?.note }];
    });
    setLastAdded(Date.now());
  };
  const setQty = (id: string, qty: number) =>
    setItems((prev) => (qty <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, qty } : i))));
  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clear = () => setItems([]);

  const count = items.reduce((a, i) => a + i.qty, 0);
  const total = items.reduce((a, i) => a + i.qty * i.price, 0);
  const fullTotal = items.reduce((a, i) => a + i.qty * Math.max(i.basePrice ?? i.price, i.price), 0);
  const discount = fullTotal - total;

  return <Ctx.Provider value={{ items, count, total, fullTotal, discount, add, setQty, remove, clear, lastAdded }}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = React.useContext(Ctx);
  if (!c) throw new Error("useCart вне CartProvider");
  return c;
}
