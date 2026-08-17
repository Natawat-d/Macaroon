"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { PRODUCTS, type Product } from "@/lib/products";

export type CartLine = {
  slug: string;
  shadeIndex: number;
  qty: number;
  /** Foil-stamped text from the Shade Studio; distinguishes otherwise-identical lines. */
  engraving?: string;
};

export type ResolvedLine = CartLine & { product: Product; key: string };

type CartContext = {
  lines: ResolvedLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (
    slug: string,
    shadeIndex: number,
    qty?: number,
    engraving?: string,
  ) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
};

const Ctx = createContext<CartContext | null>(null);
const STORAGE_KEY = "macaron.cart.v1";
export const FREE_SHIPPING_THRESHOLD = 75;
export const ENGRAVING_PRICE = 6;

const lineKey = (l: CartLine) =>
  `${l.slug}|${l.shadeIndex}|${l.engraving ?? ""}`;

/** Engraved pieces carry a stamping fee on top of the base price. */
export const linePrice = (l: CartLine, p: Product) =>
  p.price + (l.engraving ? ENGRAVING_PRICE : 0);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [raw, setRaw] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setRaw(JSON.parse(stored));
    } catch {
      // A corrupt or unavailable store just means an empty bag.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
    } catch {
      // Private mode / quota — the bag still works for this session.
    }
  }, [raw, hydrated]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const add = useCallback(
    (slug: string, shadeIndex: number, qty = 1, engraving?: string) => {
      const incoming: CartLine = { slug, shadeIndex, qty, engraving };
      setRaw((prev) => {
        const i = prev.findIndex((l) => lineKey(l) === lineKey(incoming));
        if (i === -1) return [...prev, incoming];
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + qty };
        return next;
      });
      setIsOpen(true);
    },
    [],
  );

  const setQty = useCallback((key: string, qty: number) => {
    setRaw((prev) =>
      qty <= 0
        ? prev.filter((l) => lineKey(l) !== key)
        : prev.map((l) => (lineKey(l) === key ? { ...l, qty } : l)),
    );
  }, []);

  const remove = useCallback((key: string) => {
    setRaw((prev) => prev.filter((l) => lineKey(l) !== key));
  }, []);

  const value = useMemo<CartContext>(() => {
    const lines = raw
      .map((l) => {
        const product = PRODUCTS.find((p) => p.slug === l.slug);
        return product ? { ...l, product, key: lineKey(l) } : null;
      })
      .filter((l): l is ResolvedLine => l !== null);

    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce(
        (n, l) => n + l.qty * linePrice(l, l.product),
        0,
      ),
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add,
      setQty,
      remove,
    };
  }, [raw, isOpen, add, setQty, remove]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
