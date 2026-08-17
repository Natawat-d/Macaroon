"use client";

import Link from "next/link";
import { useState } from "react";
import { money, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart";
import ProductArt from "./product-art";

export default function ProductDetail({ product }: { product: Product }) {
  const { add } = useCart();
  const [shadeIndex, setShadeIndex] = useState(0);
  const [view, setView] = useState<"front" | "alt">("front");
  const [qty, setQty] = useState(1);
  const [saved, setSaved] = useState(false);

  const shade = product.shades[shadeIndex];
  const discounted = product.compareAt && product.compareAt > product.price;

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
      <nav className="flex flex-wrap items-center gap-2 py-5 text-xs text-ink-soft">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-ink">Shop</Link>
        <span>/</span>
        <Link href={`/shop?category=${product.category}`} className="hover:text-ink">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-10 pb-14 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="overflow-hidden rounded-[2rem] bg-shell">
            <ProductArt
              product={product}
              shadeIndex={shadeIndex}
              variant={view}
              className="aspect-square w-full animate-pop"
              key={`${shadeIndex}-${view}`}
            />
          </div>
          <div className="mt-4 flex gap-3">
            {(["front", "alt"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`overflow-hidden rounded-2xl border-2 transition ${
                  view === v ? "border-ink" : "border-transparent opacity-60 hover:opacity-100"
                }`}
                aria-label={v === "front" ? "Product view" : "Swatch view"}
              >
                <ProductArt
                  product={product}
                  shadeIndex={shadeIndex}
                  variant={v}
                  className="size-20 bg-shell"
                />
              </button>
            ))}
            {product.shades.slice(0, 3).map((s, i) =>
              i === shadeIndex ? null : (
                <button
                  key={s.name}
                  onClick={() => setShadeIndex(i)}
                  className="overflow-hidden rounded-2xl border-2 border-transparent opacity-60 transition hover:opacity-100"
                  aria-label={`View ${s.name}`}
                >
                  <ProductArt product={product} shadeIndex={i} className="size-20 bg-shell" />
                </button>
              ),
            )}
          </div>
        </div>

        {/* Buy box */}
        <div>
          <div className="flex items-center gap-3">
            <span className="eyebrow rounded-full bg-shell px-3 py-1.5 text-[10px]">
              {product.collection}
            </span>
            {product.badge && (
              <span className="eyebrow rounded-full bg-raspberry px-3 py-1.5 text-[10px] text-white">
                {product.badge}
              </span>
            )}
          </div>

          <h1 className="display mt-4 text-4xl sm:text-5xl">{product.name}</h1>
          <p className="mt-2 text-base text-ink-soft">{product.subtitle}</p>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 text-sm">
              <span className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    viewBox="0 0 24 24"
                    className={`size-4 ${i < Math.round(product.rating) ? "fill-lemon" : "fill-line"}`}
                  >
                    <path d="m12 2 3 6.5 7 .9-5 4.9 1.2 7L12 18l-6.2 3.3L7 14.3l-5-4.9 7-.9z" />
                  </svg>
                ))}
              </span>
              <span className="font-semibold">{product.rating}</span>
              <span className="text-ink-soft">
                ({product.reviews.toLocaleString()} reviews)
              </span>
            </span>
            <span className="text-xs text-ink-soft">
              {product.sold.toLocaleString()}+ sold
            </span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="display text-3xl">{money(product.price)}</span>
            {discounted && (
              <>
                <span className="text-lg text-ink-soft line-through">
                  {money(product.compareAt!)}
                </span>
                <span className="rounded-full bg-lemon px-2.5 py-1 text-[11px] font-bold">
                  Save {money(product.compareAt! - product.price)}
                </span>
              </>
            )}
          </div>

          <p className="mt-6 text-sm leading-relaxed text-ink-soft">
            {product.description}
          </p>

          {/* Shade selector */}
          <div className="mt-8">
            <div className="flex items-baseline justify-between">
              <p className="eyebrow text-[11px]">
                Shade — <span className="text-raspberry">{shade.name}</span>
              </p>
              <span className="text-xs text-ink-soft">
                {product.shades.length} available
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              {product.shades.map((s, i) => (
                <button
                  key={s.name}
                  onClick={() => setShadeIndex(i)}
                  title={s.name}
                  aria-label={s.name}
                  aria-pressed={i === shadeIndex}
                  className={`size-10 rounded-full transition ${
                    i === shadeIndex
                      ? "ring-2 ring-ink ring-offset-4 ring-offset-cream"
                      : "ring-1 ring-black/10 hover:scale-110"
                  }`}
                  style={{ background: s.hex }}
                />
              ))}
            </div>
          </div>

          {/* Quantity + add */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-line">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid size-12 place-items-center rounded-full text-lg hover:bg-shell"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-8 text-center text-sm font-bold">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(10, q + 1))}
                className="grid size-12 place-items-center rounded-full text-lg hover:bg-shell"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button
              onClick={() => add(product.slug, shadeIndex, qty)}
              className="flex-1 rounded-full bg-ink px-8 py-4 text-sm font-bold text-cream transition hover:bg-raspberry"
            >
              Add to bag · {money(product.price * qty)}
            </button>
            <button
              onClick={() => setSaved((v) => !v)}
              aria-pressed={saved}
              aria-label="Save to wishlist"
              className="grid size-12 place-items-center rounded-full border border-line transition hover:border-ink"
            >
              <svg
                viewBox="0 0 24 24"
                className={`size-5 ${saved ? "fill-raspberry stroke-raspberry" : "fill-none stroke-ink"}`}
                strokeWidth="2"
              >
                <path d="M12 20s-7-4.6-7-9.4A4.2 4.2 0 0 1 12 8a4.2 4.2 0 0 1 7 2.6C19 15.4 12 20 12 20Z" />
              </svg>
            </button>
          </div>

          {product.personalizable && (
            <Link
              href="/studio"
              className="mt-3 flex items-center justify-between rounded-2xl border border-dashed border-ink/30 px-5 py-4 transition hover:border-ink hover:bg-shell"
            >
              <span>
                <span className="text-sm font-bold">Press your name into it</span>
                <span className="block text-xs text-ink-soft">
                  Free foil stamping, up to 12 characters
                </span>
              </span>
              <span className="text-lg">→</span>
            </Link>
          )}

          <ul className="mt-6 grid gap-2 text-xs text-ink-soft sm:grid-cols-2">
            {[
              "Free shipping over $75",
              "Ships in 24 hours",
              "30-day shade guarantee",
              "Refill pod available",
            ].map((v) => (
              <li key={v} className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="size-4 stroke-pistachio" fill="none" strokeWidth="2.5">
                  <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {v}
              </li>
            ))}
          </ul>

          {/* Accordions */}
          <div className="mt-8 space-y-2">
            {[
              { q: "What's inside", a: null, list: product.details },
              { q: "Full ingredients", a: product.ingredients, list: null },
              {
                q: "How to apply",
                a: `Start from the centre and work outward. For ${product.finish.toLowerCase()} finishes, build in thin layers rather than one heavy pass — the colour stays truer and wears longer. Blot, then reapply once for full opacity.`,
                list: null,
              },
              {
                q: "Shipping & returns",
                a: "Standard shipping is 3–5 business days and free over $75. Express arrives next day when ordered before 2pm. Returns are free within 30 days, opened or not.",
                list: null,
              },
            ].map((row) => (
              <details
                key={row.q}
                className="group rounded-2xl border border-line px-5 py-4 open:bg-shell"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold">
                  {row.q}
                  <span className="text-lg transition group-open:rotate-45">+</span>
                </summary>
                {row.list ? (
                  <ul className="mt-3 space-y-1.5">
                    {row.list.map((d) => (
                      <li key={d} className="flex gap-2 text-sm text-ink-soft">
                        <span className="text-raspberry">•</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{row.a}</p>
                )}
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky mobile buy bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-line bg-cream/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="min-w-0">
          <p className="truncate text-xs font-bold">{product.name}</p>
          <p className="truncate text-[11px] text-ink-soft">{shade.name}</p>
        </div>
        <button
          onClick={() => add(product.slug, shadeIndex, qty)}
          className="ml-auto shrink-0 rounded-full bg-ink px-6 py-3 text-xs font-bold text-cream"
        >
          Add · {money(product.price * qty)}
        </button>
      </div>
    </div>
  );
}
