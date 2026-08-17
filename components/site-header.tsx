"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, PRODUCTS, money } from "@/lib/products";
import { useCart } from "@/lib/cart";
import ProductArt from "./product-art";
import { Wordmark } from "./logo";

const NAV = [
  { label: "Shop All", href: "/shop", mega: true },
  { label: "Lips", href: "/shop?category=Lips" },
  { label: "Eyes", href: "/shop?category=Eyes" },
  { label: "Face", href: "/shop?category=Face" },
  { label: "Skin", href: "/shop?category=Skin" },
  { label: "Sets", href: "/shop?category=Sets" },
  { label: "Co-Lab", href: "/shop?collection=Co-Lab", accent: true },
  { label: "Studio", href: "/studio", accent: true },
];

export default function SiteHeader() {
  const { count, open } = useCart();
  const [megaOpen, setMegaOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMenuOpen(false);
        setMegaOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.shades.some((s) => s.name.toLowerCase().includes(q)),
    ).slice(0, 6);
  }, [query]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4 sm:px-6 lg:h-[72px]">
        <button
          onClick={() => setMenuOpen(true)}
          className="-ml-1 grid size-10 place-items-center rounded-full transition hover:bg-shell lg:hidden"
          aria-label="Open menu"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
          </svg>
        </button>

        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Wordmark className="text-[26px]" />
        </Link>

        <nav
          className="ml-6 hidden items-center gap-1 lg:flex"
          onMouseLeave={() => setMegaOpen(false)}
        >
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onMouseEnter={() => setMegaOpen(Boolean(item.mega))}
              className={`rounded-full px-3 py-2 text-[13px] font-semibold transition hover:bg-shell ${
                item.accent ? "text-raspberry" : "text-ink"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => setSearchOpen(true)}
            className="grid size-10 place-items-center rounded-full transition hover:bg-shell"
            aria-label="Search"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
          </button>
          <button
            className="hidden size-10 place-items-center rounded-full transition hover:bg-shell sm:grid"
            aria-label="Account"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" strokeLinecap="round" />
            </svg>
          </button>
          <button
            onClick={open}
            className="relative grid size-10 place-items-center rounded-full transition hover:bg-shell"
            aria-label={`Bag, ${count} items`}
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 8h14l-1.2 12H6.2L5 8Z" strokeLinejoin="round" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 grid size-5 animate-pop place-items-center rounded-full bg-raspberry text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Desktop mega menu */}
      {megaOpen && (
        <div
          onMouseLeave={() => setMegaOpen(false)}
          className="absolute inset-x-0 top-full hidden animate-rise border-b border-line bg-cream shadow-[0_24px_48px_-24px_rgba(22,16,14,.25)] lg:block"
        >
          <div className="mx-auto grid max-w-[1400px] grid-cols-[1.4fr_1fr] gap-10 px-6 py-9">
            <div className="grid grid-cols-5 gap-6">
              {CATEGORIES.map((cat) => {
                const items = PRODUCTS.filter((p) => p.category === cat.name);
                return (
                  <div key={cat.name}>
                    <Link
                      href={`/shop?category=${cat.name}`}
                      onClick={() => setMegaOpen(false)}
                      className="display text-lg hover:text-raspberry"
                    >
                      {cat.name}
                    </Link>
                    <p className="mt-0.5 text-[11px] text-ink-soft">{cat.blurb}</p>
                    <ul className="mt-3 space-y-1.5">
                      {items.slice(0, 4).map((p) => (
                        <li key={p.slug}>
                          <Link
                            href={`/product/${p.slug}`}
                            onClick={() => setMegaOpen(false)}
                            className="text-[13px] text-ink-soft transition hover:text-ink"
                          >
                            {p.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {PRODUCTS.filter((p) => p.badge === "New" || p.badge === "Limited")
                .slice(0, 2)
                .map((p) => (
                  <Link
                    key={p.slug}
                    href={`/product/${p.slug}`}
                    onClick={() => setMegaOpen(false)}
                    className="group overflow-hidden rounded-2xl bg-shell"
                  >
                    <ProductArt
                      product={p}
                      className="aspect-square w-full transition duration-500 group-hover:scale-105"
                    />
                    <div className="p-3">
                      <p className="eyebrow text-[10px] text-raspberry">
                        {p.badge}
                      </p>
                      <p className="text-sm font-semibold">{p.name}</p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          />
          <div className="relative mx-auto mt-24 w-[min(680px,92vw)] animate-rise overflow-hidden rounded-3xl bg-cream shadow-2xl">
            <div className="flex items-center gap-3 border-b border-line px-5 py-4">
              <svg viewBox="0 0 24 24" className="size-5 text-ink-soft" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search shades, products, flavours…"
                className="w-full bg-transparent text-base outline-none placeholder:text-ink-soft/70"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-xs font-semibold text-ink-soft hover:text-ink"
              >
                ESC
              </button>
            </div>
            <div className="max-h-[52vh] overflow-y-auto p-2">
              {query && results.length === 0 && (
                <p className="p-6 text-center text-sm text-ink-soft">
                  Nothing matched “{query}”. Try “raspberry” or “palette”.
                </p>
              )}
              {!query && (
                <div className="p-5">
                  <p className="eyebrow text-[10px] text-ink-soft">Popular</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["Matte lipstick", "Palette", "Blush", "Cushion", "Co-Lab", "Gift set"].map(
                      (t) => (
                        <button
                          key={t}
                          onClick={() => setQuery(t)}
                          className="rounded-full border border-line px-3 py-1.5 text-xs font-medium transition hover:border-ink hover:bg-shell"
                        >
                          {t}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              )}
              {results.map((p) => (
                <Link
                  key={p.slug}
                  href={`/product/${p.slug}`}
                  onClick={() => {
                    setSearchOpen(false);
                    setQuery("");
                  }}
                  className="flex items-center gap-4 rounded-2xl p-3 transition hover:bg-shell"
                >
                  <ProductArt
                    product={p}
                    className="size-14 shrink-0 rounded-xl"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="truncate text-xs text-ink-soft">{p.subtitle}</p>
                  </div>
                  <span className="ml-auto text-sm font-semibold">
                    {money(p.price)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="relative h-full w-[86vw] max-w-sm animate-rise overflow-y-auto bg-cream p-6">
            <div className="flex items-center justify-between">
              <Wordmark className="text-[26px]" />
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="grid size-9 place-items-center rounded-full hover:bg-shell"
              >
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <nav className="mt-8 grid gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`display border-b border-line py-3.5 text-2xl ${
                    item.accent ? "text-raspberry" : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-8 rounded-2xl bg-shell p-5">
              <p className="eyebrow text-[10px] text-raspberry">Shade studio</p>
              <p className="mt-1 text-sm text-ink-soft">
                Build a bullet in your flavour and press your name into the case.
              </p>
              <Link
                href="/studio"
                onClick={() => setMenuOpen(false)}
                className="mt-4 inline-flex rounded-full bg-ink px-5 py-2.5 text-xs font-bold text-cream"
              >
                Start personalising
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
