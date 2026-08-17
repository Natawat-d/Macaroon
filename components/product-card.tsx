"use client";

import Link from "next/link";
import { useState } from "react";
import { money, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart";
import ProductArt from "./product-art";

const BADGE_STYLE: Record<string, string> = {
  New: "bg-pistachio text-ink",
  "Best Seller": "bg-ink text-cream",
  Limited: "bg-raspberry text-white",
  Refill: "bg-mint text-ink",
  "Almost Gone": "bg-lemon text-ink",
};

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [shadeIndex, setShadeIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [saved, setSaved] = useState(false);

  const swatches = product.shades.slice(0, 5);
  const extra = product.shades.length - swatches.length;
  const discounted = product.compareAt && product.compareAt > product.price;

  return (
    <article
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden rounded-3xl bg-shell">
        <Link href={`/product/${product.slug}`} aria-label={product.name}>
          {/* Two stacked angles; the second cross-fades in on hover. */}
          <ProductArt
            product={product}
            shadeIndex={shadeIndex}
            className="aspect-square w-full"
          />
          <ProductArt
            product={product}
            shadeIndex={shadeIndex}
            variant="alt"
            className={`absolute inset-0 aspect-square w-full transition-opacity duration-500 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          />
        </Link>

        {product.badge && (
          <span
            className={`eyebrow absolute top-3 left-3 rounded-full px-2.5 py-1 text-[9px] ${
              BADGE_STYLE[product.badge] ?? "bg-ink text-cream"
            }`}
          >
            {product.badge}
          </span>
        )}

        {discounted && (
          <span className="eyebrow absolute top-3 right-3 rounded-full bg-white px-2.5 py-1 text-[9px] text-raspberry">
            Save {money(product.compareAt! - product.price)}
          </span>
        )}

        <button
          onClick={() => setSaved((v) => !v)}
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          aria-pressed={saved}
          className="absolute right-3 bottom-3 grid size-9 place-items-center rounded-full bg-white/90 backdrop-blur transition hover:bg-white"
        >
          <svg
            viewBox="0 0 24 24"
            className={`size-4.5 transition ${saved ? "fill-raspberry stroke-raspberry" : "fill-none stroke-ink"}`}
            strokeWidth="2"
          >
            <path d="M12 20s-7-4.6-7-9.4A4.2 4.2 0 0 1 12 8a4.2 4.2 0 0 1 7 2.6C19 15.4 12 20 12 20Z" />
          </svg>
        </button>

        {/* Quick-add slides up on hover, the way drop-store grids do */}
        <div
          className={`absolute inset-x-3 bottom-3 transition-all duration-300 ${
            hovered
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-3 opacity-0"
          }`}
        >
          <button
            onClick={() => add(product.slug, shadeIndex)}
            className="w-[calc(100%-3rem)] rounded-full bg-ink py-3 text-xs font-bold text-cream transition hover:bg-raspberry"
          >
            Quick add · {money(product.price)}
          </button>
        </div>
      </div>

      <div className="px-1 pt-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/product/${product.slug}`}
              className="block truncate text-sm font-semibold hover:text-raspberry"
            >
              {product.name}
            </Link>
            <p className="truncate text-xs text-ink-soft">{product.subtitle}</p>
          </div>
          <div className="shrink-0 text-right">
            <span className="text-sm font-semibold">{money(product.price)}</span>
            {discounted && (
              <span className="ml-1.5 text-xs text-ink-soft line-through">
                {money(product.compareAt!)}
              </span>
            )}
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            {swatches.map((s, i) => (
              <button
                key={s.name}
                onMouseEnter={() => setShadeIndex(i)}
                onFocus={() => setShadeIndex(i)}
                onClick={() => setShadeIndex(i)}
                title={s.name}
                aria-label={`Preview shade ${s.name}`}
                className={`size-4 rounded-full ring-1 transition ${
                  shadeIndex === i
                    ? "ring-2 ring-ink ring-offset-2 ring-offset-cream"
                    : "ring-black/10 hover:scale-110"
                }`}
                style={{ background: s.hex }}
              />
            ))}
            {extra > 0 && (
              <span className="text-[11px] font-medium text-ink-soft">
                +{extra}
              </span>
            )}
          </div>
          <span className="ml-auto flex items-center gap-1 text-[11px] text-ink-soft">
            <svg viewBox="0 0 24 24" className="size-3 fill-lemon">
              <path d="m12 2 3 6.5 7 .9-5 4.9 1.2 7L12 18l-6.2 3.3L7 14.3l-5-4.9 7-.9z" />
            </svg>
            {product.rating} ({product.reviews.toLocaleString()})
          </span>
        </div>
      </div>
    </article>
  );
}
