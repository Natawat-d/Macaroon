"use client";

import Link from "next/link";
import { FREE_SHIPPING_THRESHOLD, linePrice, useCart } from "@/lib/cart";
import { PRODUCTS, money } from "@/lib/products";
import ProductArt from "./product-art";

export default function CartDrawer() {
  const { lines, subtotal, count, isOpen, close, setQty, remove, add } = useCart();
  if (!isOpen) return null;

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const upsell = PRODUCTS.filter(
    (p) => !lines.some((l) => l.slug === p.slug) && p.price <= 30,
  ).slice(0, 3);

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]" onClick={close} />
      <aside className="absolute inset-y-0 right-0 flex w-[min(440px,100vw)] animate-rise flex-col bg-cream shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="display text-xl">
            Your bag{" "}
            <span className="text-ink-soft">({count})</span>
          </h2>
          <button
            onClick={close}
            aria-label="Close bag"
            className="grid size-9 place-items-center rounded-full hover:bg-shell"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="border-b border-line bg-shell px-5 py-3">
          <p className="text-xs font-medium">
            {remaining > 0 ? (
              <>
                You&rsquo;re <strong>{money(remaining)}</strong> away from free
                shipping
              </>
            ) : (
              <>🎉 Free shipping unlocked</>
            )}
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-raspberry transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5">
          {lines.length === 0 ? (
            <div className="grid h-full place-items-center py-16 text-center">
              <div>
                <p className="display text-2xl">Your bag is empty</p>
                <p className="mt-2 text-sm text-ink-soft">
                  Pick a flavour and we&rsquo;ll box it up.
                </p>
                <Link
                  href="/shop"
                  onClick={close}
                  className="mt-6 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-bold text-cream"
                >
                  Shop all products
                </Link>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {lines.map((l) => {
                const s = l.product.shades[l.shadeIndex] ?? l.product.shades[0];
                return (
                  <li key={l.key} className="flex gap-4 py-4">
                    <Link href={`/product/${l.slug}`} onClick={close}>
                      <ProductArt
                        product={l.product}
                        shadeIndex={l.shadeIndex}
                        className="size-20 shrink-0 rounded-xl"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link
                            href={`/product/${l.slug}`}
                            onClick={close}
                            className="block truncate text-sm font-semibold hover:text-raspberry"
                          >
                            {l.product.name}
                          </Link>
                          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-soft">
                            <span
                              className="inline-block size-3 rounded-full ring-1 ring-black/10"
                              style={{ background: s.hex }}
                            />
                            {s.name}
                          </p>
                          {l.engraving && (
                            <p className="mt-1 inline-flex rounded-full bg-shell px-2 py-0.5 text-[10px] font-semibold">
                              Engraved “{l.engraving}”
                            </p>
                          )}
                        </div>
                        <span className="text-sm font-semibold">
                          {money(linePrice(l, l.product) * l.qty)}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex items-center rounded-full border border-line">
                          <button
                            onClick={() => setQty(l.key, l.qty - 1)}
                            className="grid size-7 place-items-center rounded-full hover:bg-shell"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-xs font-semibold">
                            {l.qty}
                          </span>
                          <button
                            onClick={() => setQty(l.key, l.qty + 1)}
                            className="grid size-7 place-items-center rounded-full hover:bg-shell"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => remove(l.key)}
                          className="text-xs text-ink-soft underline underline-offset-2 hover:text-ink"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {lines.length > 0 && upsell.length > 0 && (
            <div className="border-t border-line py-5">
              <p className="eyebrow text-[10px] text-ink-soft">Add a little extra</p>
              <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar">
                {upsell.map((p) => (
                  <div key={p.slug} className="w-32 shrink-0">
                    <ProductArt product={p} className="aspect-square w-full rounded-xl" />
                    <p className="mt-2 truncate text-xs font-semibold">{p.name}</p>
                    <button
                      onClick={() => add(p.slug, 0)}
                      className="mt-1 w-full rounded-full border border-ink py-1.5 text-[11px] font-bold transition hover:bg-ink hover:text-cream"
                    >
                      Add {money(p.price)}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-line px-5 py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-soft">Subtotal</span>
              <span className="display text-xl">{money(subtotal)}</span>
            </div>
            <p className="mt-1 text-[11px] text-ink-soft">
              Taxes and shipping calculated at checkout.
            </p>
            <button className="mt-4 w-full rounded-full bg-ink py-4 text-sm font-bold text-cream transition hover:bg-raspberry">
              Checkout · {money(subtotal)}
            </button>
            <button
              onClick={close}
              className="mt-2 w-full py-2 text-xs font-semibold text-ink-soft hover:text-ink"
            >
              Continue shopping
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
