"use client";

import Link from "next/link";
import { Fragment, useEffect, useMemo, useState } from "react";
import {
  CATEGORIES,
  COLLECTIONS,
  FINISHES,
  PRODUCTS,
  SHADE_FAMILIES,
  money,
  type Category,
  type Collection,
  type Finish,
  type Shade,
} from "@/lib/products";
import ProductCard from "./product-card";

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "best", label: "Best selling" },
  { value: "new", label: "Newest" },
  { value: "rating", label: "Top rated" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
] as const;

type Sort = (typeof SORTS)[number]["value"];

const PAGE_SIZE = 8;

function toggle<T>(set: T[], value: T): T[] {
  return set.includes(value) ? set.filter((v) => v !== value) : [...set, value];
}

export default function ShopClient({
  initialCategory,
  initialCollection,
  initialSort,
}: {
  initialCategory?: Category;
  initialCollection?: Collection;
  initialSort?: Sort;
}) {
  const [categories, setCategories] = useState<Category[]>(
    initialCategory ? [initialCategory] : [],
  );
  const [collections, setCollections] = useState<Collection[]>(
    initialCollection ? [initialCollection] : [],
  );
  const [finishes, setFinishes] = useState<Finish[]>([]);
  const [families, setFamilies] = useState<Shade["family"][]>([]);
  const [maxPrice, setMaxPrice] = useState(160);
  const [sort, setSort] = useState<Sort>(initialSort ?? "featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);

  // Any filter change restarts paging so the user isn't stranded mid-list.
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [categories, collections, finishes, families, maxPrice, sort]);

  const results = useMemo(() => {
    const filtered = PRODUCTS.filter((p) => {
      if (categories.length && !categories.includes(p.category)) return false;
      if (collections.length && !collections.includes(p.collection)) return false;
      if (finishes.length && !finishes.includes(p.finish)) return false;
      if (
        families.length &&
        !p.shades.some((s) => families.includes(s.family))
      )
        return false;
      if (p.price > maxPrice) return false;
      return true;
    });

    const sorted = [...filtered];
    switch (sort) {
      case "best":
        sorted.sort((a, b) => b.sold - a.sold);
        break;
      case "new":
        sorted.sort((a, b) => Number(b.isNew ?? false) - Number(a.isNew ?? false));
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
        break;
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      default:
        // "Featured" pushes badged pieces to the front, then best sellers.
        sorted.sort(
          (a, b) =>
            Number(Boolean(b.badge)) - Number(Boolean(a.badge)) ||
            b.sold - a.sold,
        );
    }
    return sorted;
  }, [categories, collections, finishes, families, maxPrice, sort]);

  const activeCount =
    categories.length +
    collections.length +
    finishes.length +
    families.length +
    (maxPrice < 160 ? 1 : 0);

  const clearAll = () => {
    setCategories([]);
    setCollections([]);
    setFinishes([]);
    setFamilies([]);
    setMaxPrice(160);
  };

  const heading =
    categories.length === 1
      ? `${categories[0]} Makeup`
      : collections.length === 1
        ? `${collections[0]} Collection`
        : "All Products";

  const filterPanel = (
    <div className="space-y-7">
      <FilterGroup title="Category">
        {CATEGORIES.map((c) => (
          <CheckRow
            key={c.name}
            label={c.name}
            count={PRODUCTS.filter((p) => p.category === c.name).length}
            checked={categories.includes(c.name)}
            onChange={() => setCategories((s) => toggle(s, c.name))}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Collection">
        {COLLECTIONS.map((c) => (
          <CheckRow
            key={c}
            label={c}
            count={PRODUCTS.filter((p) => p.collection === c).length}
            checked={collections.includes(c)}
            onChange={() => setCollections((s) => toggle(s, c))}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Finish">
        {FINISHES.map((f) => (
          <CheckRow
            key={f}
            label={f}
            count={PRODUCTS.filter((p) => p.finish === f).length}
            checked={finishes.includes(f)}
            onChange={() => setFinishes((s) => toggle(s, f))}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Shade family">
        <div className="flex flex-wrap gap-2 pt-1">
          {SHADE_FAMILIES.map((f) => {
            const on = families.includes(f.name);
            return (
              <button
                key={f.name}
                onClick={() => setFamilies((s) => toggle(s, f.name))}
                aria-pressed={on}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  on
                    ? "border-ink bg-ink text-cream"
                    : "border-line hover:border-ink"
                }`}
              >
                <span
                  className="size-3.5 rounded-full ring-1 ring-black/10"
                  style={{ background: f.hex }}
                />
                {f.name}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title="Price">
        <div className="pt-2">
          <input
            type="range"
            min={19}
            max={160}
            step={1}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-raspberry"
            aria-label="Maximum price"
          />
          <div className="mt-1 flex justify-between text-xs text-ink-soft">
            <span>{money(19)}</span>
            <span className="font-semibold text-ink">Up to {money(maxPrice)}</span>
          </div>
        </div>
      </FilterGroup>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 py-5 text-xs text-ink-soft">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-ink">
          Shop
        </Link>
        {categories.length === 1 && (
          <>
            <span>/</span>
            <span className="text-ink">{categories[0]}</span>
          </>
        )}
      </nav>

      {/* Page header */}
      <header className="max-w-3xl pb-8">
        <h1 className="display text-5xl sm:text-6xl lg:text-7xl">{heading}</h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft sm:text-base">
          Every formula is milled in small batches, pressed into a refillable
          case and shade-matched against 40 skin tones before it ships. Filter by
          finish, flavour or family — or let the Shade Studio build one for you.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-ink-soft">
          <span className="flex items-center gap-1.5">
            <Dot className="bg-pistachio" /> Talc-free & vegan
          </span>
          <span className="flex items-center gap-1.5">
            <Dot className="bg-lavender" /> Refillable cases
          </span>
          <span className="flex items-center gap-1.5">
            <Dot className="bg-raspberry" /> 30-day shade guarantee
          </span>
        </div>
      </header>

      {/* Category chip rail */}
      <div className="flex gap-2 overflow-x-auto pb-6 no-scrollbar">
        <button
          onClick={() => setCategories([])}
          className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
            categories.length === 0
              ? "border-ink bg-ink text-cream"
              : "border-line hover:border-ink"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.name}
            onClick={() =>
              setCategories(categories[0] === c.name && categories.length === 1 ? [] : [c.name])
            }
            className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
              categories.includes(c.name)
                ? "border-ink bg-ink text-cream"
                : "border-line hover:border-ink"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Sticky toolbar */}
      <div className="sticky top-16 z-30 -mx-4 border-y border-line bg-cream/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:top-[72px]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full border border-ink px-4 py-2 text-xs font-bold transition hover:bg-ink hover:text-cream lg:hidden"
          >
            <FilterIcon />
            Filter
            {activeCount > 0 && (
              <span className="grid size-5 place-items-center rounded-full bg-raspberry text-[10px] text-white">
                {activeCount}
              </span>
            )}
          </button>

          <p className="hidden text-xs font-semibold text-ink-soft lg:block">
            {results.length} {results.length === 1 ? "product" : "products"}
          </p>

          {/* Active filter pills */}
          <div className="flex flex-1 gap-2 overflow-x-auto no-scrollbar">
            {[
              ...categories.map((v) => ({
                v: v as string,
                clear: () => setCategories((s) => toggle(s, v)),
              })),
              ...collections.map((v) => ({
                v: v as string,
                clear: () => setCollections((s) => toggle(s, v)),
              })),
              ...finishes.map((v) => ({
                v: v as string,
                clear: () => setFinishes((s) => toggle(s, v)),
              })),
              ...families.map((v) => ({
                v: v as string,
                clear: () => setFamilies((s) => toggle(s, v)),
              })),
            ].map((pill) => (
              <button
                key={pill.v}
                onClick={pill.clear}
                className="flex shrink-0 items-center gap-1.5 rounded-full bg-shell px-3 py-1.5 text-[11px] font-semibold transition hover:bg-line"
              >
                {pill.v}
                <span className="text-ink-soft">✕</span>
              </button>
            ))}
            {activeCount > 0 && (
              <button
                onClick={clearAll}
                className="shrink-0 text-[11px] font-semibold text-raspberry underline underline-offset-2"
              >
                Clear all
              </button>
            )}
          </div>

          <label className="ml-auto flex shrink-0 items-center gap-2 text-xs">
            <span className="hidden text-ink-soft sm:inline">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-full border border-line bg-cream px-3 py-2 text-xs font-semibold outline-none focus:border-ink"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Mobile filter sheet */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/40"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] animate-rise overflow-y-auto rounded-t-3xl bg-cream p-6">
            <div className="flex items-center justify-between pb-4">
              <h2 className="display text-2xl">Filters</h2>
              <button
                onClick={() => setFiltersOpen(false)}
                className="grid size-9 place-items-center rounded-full hover:bg-shell"
                aria-label="Close filters"
              >
                ✕
              </button>
            </div>
            {filterPanel}
            <div className="sticky bottom-0 -mx-6 mt-6 flex gap-3 border-t border-line bg-cream px-6 pt-4">
              <button
                onClick={clearAll}
                className="flex-1 rounded-full border border-ink py-3 text-sm font-bold"
              >
                Clear
              </button>
              <button
                onClick={() => setFiltersOpen(false)}
                className="flex-[2] rounded-full bg-ink py-3 text-sm font-bold text-cream"
              >
                Show {results.length} products
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar + grid */}
      <div className="grid gap-10 py-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-40">
            <div className="flex items-center justify-between pb-4">
              <h2 className="eyebrow text-[11px]">Filter</h2>
              {activeCount > 0 && (
                <button
                  onClick={clearAll}
                  className="text-[11px] font-semibold text-raspberry underline underline-offset-2"
                >
                  Clear all
                </button>
              )}
            </div>
            {filterPanel}
          </div>
        </aside>

        <div>
          {results.length === 0 ? (
            <div className="grid place-items-center rounded-3xl bg-shell py-24 text-center">
              <div>
                <p className="display text-3xl">No matches — yet</p>
                <p className="mt-2 max-w-sm text-sm text-ink-soft">
                  Nothing in the case fits every filter at once. Try loosening the
                  finish or price.
                </p>
                <button
                  onClick={clearAll}
                  className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-bold text-cream"
                >
                  Reset filters
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
                {results.slice(0, visible).map((p, i) => (
                  <Fragment key={p.slug}>
                    <ProductCard product={p} />
                    {/* Promo tiles break up the grid, drop-store style */}
                    {i === 5 && results.length > 6 && (
                      <PromoTile
                        eyebrow="Shade Studio"
                        title="Make it yours"
                        body="Pick a flavour, a finish and press your name into the case."
                        href="/studio"
                        cta="Start building"
                        from="var(--color-lavender)"
                        to="var(--color-rose)"
                      />
                    )}
                  </Fragment>
                ))}
              </div>

              {visible < results.length && (
                <div className="mt-14 flex flex-col items-center gap-4">
                  <p className="text-xs text-ink-soft">
                    Showing {Math.min(visible, results.length)} of {results.length}
                  </p>
                  <div className="h-1 w-48 overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full bg-ink transition-all duration-500"
                      style={{
                        width: `${(Math.min(visible, results.length) / results.length) * 100}%`,
                      }}
                    />
                  </div>
                  <button
                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                    className="rounded-full border border-ink px-8 py-3.5 text-sm font-bold transition hover:bg-ink hover:text-cream"
                  >
                    Load more
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* SEO / FAQ block, the way a big PLP closes out */}
      <section className="mt-16 grid gap-10 border-t border-line py-14 lg:grid-cols-2">
        <div>
          <h2 className="display text-3xl">
            How to choose your Macaron shade
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            Start with undertone, not depth. If the veins on your wrist read
            green, warm flavours — Caramel, Praline, Passionfruit — will sit
            naturally against your skin. If they read blue, the cool side of the
            case is yours: Blackcurrant, Rose Lychee, Lavender Honey. Neutral
            undertones can wear the whole box.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Then pick a finish for the occasion. Matte holds through a full
            workday without touch-ups. Satin flatters dry or textured lips.
            Glossy reads youngest under daylight, and shimmer is best kept to the
            centre of the lip or the high points of the face.
          </p>
          <Link
            href="/studio"
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold underline underline-offset-4 hover:text-raspberry"
          >
            Take the 60-second shade quiz →
          </Link>
        </div>
        <div className="space-y-2">
          {[
            {
              q: "Are the cases really refillable?",
              a: "Every bullet, palette pan and cushion pod pops out and swaps in. Refills run 40% below the price of a new case, and we take the empties back for recycling at any counter.",
            },
            {
              q: "How long does shipping take?",
              a: "Standard is 3–5 business days and free over $75. Express is next-day if you order before 2pm. Limited drops ship within 48 hours of the release.",
            },
            {
              q: "What if the shade is wrong?",
              a: "Wear it, swatch it, take it out to dinner. If it isn't right within 30 days we'll exchange it for another shade or refund you in full — used product included.",
            },
            {
              q: "Is everything vegan and cruelty-free?",
              a: "Yes. No animal-derived ingredients, no animal testing anywhere in our supply chain, and every formula is talc-free and fragrance-optional.",
            },
          ].map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-line px-5 py-4 transition open:bg-shell"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold">
                {f.q}
                <span className="text-lg transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details open className="group border-b border-line pb-5">
      <summary className="flex cursor-pointer list-none items-center justify-between pb-3">
        <span className="eyebrow text-[11px]">{title}</span>
        <span className="text-sm text-ink-soft transition group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="space-y-1.5">{children}</div>
    </details>
  );
}

function CheckRow({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-4 accent-ink"
      />
      <span className={checked ? "font-semibold" : ""}>{label}</span>
      <span className="ml-auto text-xs text-ink-soft">{count}</span>
    </label>
  );
}

function PromoTile({
  eyebrow,
  title,
  body,
  href,
  cta,
  from,
  to,
}: {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  from: string;
  to: string;
}) {
  return (
    <Link
      href={href}
      className="group relative col-span-2 flex flex-col justify-between overflow-hidden rounded-3xl p-6 text-ink lg:col-span-1"
      style={{ background: `linear-gradient(140deg, ${from}, ${to})` }}
    >
      <div>
        <p className="eyebrow text-[10px] opacity-70">{eyebrow}</p>
        <h3 className="display mt-2 text-3xl">{title}</h3>
        <p className="mt-2 max-w-[22ch] text-sm opacity-80">{body}</p>
      </div>
      <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-xs font-bold text-cream transition group-hover:gap-3">
        {cta} →
      </span>
    </Link>
  );
}

function Dot({ className }: { className: string }) {
  return <span className={`inline-block size-2 rounded-full ${className}`} />;
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18M6 12h12M10 18h4" strokeLinecap="round" />
    </svg>
  );
}
