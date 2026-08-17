import Link from "next/link";
import ProductCard from "@/components/product-card";
import ProductArt from "@/components/product-art";
import { MacaronGlyph } from "@/components/logo";
import { CATEGORIES, PRODUCTS, getProduct, money } from "@/lib/products";

const STATS = [
  { value: "1M+", label: "Shades matched" },
  { value: "40", label: "Base tones" },
  { value: "92%", label: "Refill their case" },
  { value: "4.8★", label: "Average rating" },
];

const REVIEWS = [
  {
    quote:
      "Wore Crème de Macaron through a nine-hour shift and a plate of pasta. Still there at the end of it.",
    name: "Priya S.",
    product: "Crème de Macaron",
    tone: "var(--color-rose)",
  },
  {
    quote:
      "The only cushion I've found with SPF that doesn't turn me grey in photos. Bought the refill twice already.",
    name: "Mariam A.",
    product: "Soft Serve Cushion",
    tone: "var(--color-mint)",
  },
  {
    quote:
      "Patisserie No. 1 is the palette I actually finish. No fallout, and the duo-chromes are genuinely unusual.",
    name: "Jen T.",
    product: "Patisserie No. 1",
    tone: "var(--color-lavender)",
  },
  {
    quote:
      "Ordered the box with my sister's name pressed on the lid. She cried. Worth every baht.",
    name: "Nok P.",
    product: "The Macaron Box",
    tone: "var(--color-lemon)",
  },
];

export default function Home() {
  const hero = getProduct("creme-de-macaron-lipstick")!;
  const drop = getProduct("patisserie-eyeshadow-palette")!;
  const colab = getProduct("co-lab-atelier-rouge")!;
  const bestSellers = [...PRODUCTS].sort((a, b) => b.sold - a.sold).slice(0, 8);
  const newIn = PRODUCTS.filter((p) => p.isNew).slice(0, 4);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose/50 via-cream to-lavender/40">
        <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div className="animate-rise">
            <span className="eyebrow inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-[10px] text-cream">
              <MacaronGlyph className="h-4 w-4" />
              New · Patisserie No. 1 palette
            </span>
            <h1 className="display mt-6 text-[3.25rem] leading-[0.92] sm:text-7xl lg:text-[5.5rem]">
              Colour,
              <br />
              baked in
              <br />
              <span className="text-raspberry">small batches.</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink-soft">
              Refillable bullets, talc-free pans and a base that behaves like
              skincare. Pick your flavour — or press your own name into the case
              at the Shade Studio.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="rounded-full bg-ink px-8 py-4 text-sm font-bold text-cream transition hover:bg-raspberry"
              >
                Shop the line
              </Link>
              <Link
                href="/studio"
                className="rounded-full border border-ink px-8 py-4 text-sm font-bold transition hover:bg-ink hover:text-cream"
              >
                Personalise yours
              </Link>
            </div>
            <dl className="mt-12 grid max-w-lg grid-cols-4 gap-4 border-t border-ink/10 pt-6">
              {STATS.map((s) => (
                <div key={s.label}>
                  <dt className="display text-2xl sm:text-3xl">{s.value}</dt>
                  <dd className="mt-1 text-[11px] leading-tight text-ink-soft">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Product collage */}
          <div className="relative">
            <div className="relative mx-auto aspect-square w-full max-w-lg">
              <ProductArt
                product={hero}
                className="absolute inset-0 size-full rounded-[2.5rem] shadow-[0_40px_80px_-30px_rgba(22,16,14,.4)]"
              />
              <ProductArt
                product={drop}
                shadeIndex={1}
                className="absolute -bottom-6 -left-6 w-2/5 rounded-3xl shadow-[0_24px_48px_-20px_rgba(22,16,14,.45)] sm:-left-10"
              />
              <ProductArt
                product={getProduct("glaze-royale-lip-gloss")!}
                shadeIndex={1}
                className="absolute -top-6 -right-4 w-1/3 rounded-3xl shadow-[0_24px_48px_-20px_rgba(22,16,14,.45)] sm:-right-8"
              />
              <div className="absolute -right-2 bottom-10 rotate-[-8deg] rounded-2xl bg-ink px-4 py-3 text-cream shadow-xl">
                <p className="eyebrow text-[9px] text-lemon">Best seller</p>
                <p className="text-sm font-bold">{hero.name}</p>
                <p className="text-xs text-cream/70">{money(hero.price)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Value strip ──────────────────────────────────────── */}
      <section className="border-y border-line bg-shell">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 divide-x divide-line px-4 sm:px-6 lg:grid-cols-4">
          {[
            { t: "Refill, don't rebuy", d: "Every case takes a pod. Refills are 40% less." },
            { t: "Talc-free & vegan", d: "No animal ingredients. No animal testing. Ever." },
            { t: "30-day shade promise", d: "Wrong tone? Swap it, even if it's been worn." },
            { t: "Free over $75", d: "3–5 day standard. Next-day if you order by 2pm." },
          ].map((v) => (
            <div key={v.t} className="px-4 py-6 sm:px-6">
              <p className="text-sm font-bold">{v.t}</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-soft">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Shop by category ─────────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="display text-4xl sm:text-5xl">Shop by counter</h2>
          <Link
            href="/shop"
            className="shrink-0 text-sm font-bold underline underline-offset-4 hover:text-raspberry"
          >
            View all →
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
          {CATEGORIES.map((cat) => {
            const sample = PRODUCTS.find((p) => p.category === cat.name)!;
            return (
              <Link
                key={cat.name}
                href={`/shop?category=${cat.name}`}
                className="group overflow-hidden rounded-3xl bg-shell transition hover:shadow-[0_24px_48px_-24px_rgba(22,16,14,.35)]"
              >
                <div className="overflow-hidden">
                  <ProductArt
                    product={sample}
                    className="aspect-[4/5] w-full transition duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="flex items-center justify-between gap-2 p-4">
                  <div>
                    <p className="display text-xl">{cat.name}</p>
                    <p className="text-[11px] text-ink-soft">{cat.blurb}</p>
                  </div>
                  <span
                    className="grid size-8 shrink-0 place-items-center rounded-full text-sm transition group-hover:translate-x-0.5"
                    style={{ background: cat.accent }}
                  >
                    →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Feature drop banner ──────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="grid overflow-hidden rounded-[2rem] bg-gradient-to-br from-blackcurrant to-lavender lg:grid-cols-2">
          <div className="flex flex-col justify-center p-8 text-cream sm:p-14">
            <span className="eyebrow w-fit rounded-full bg-cream/20 px-3 py-1.5 text-[10px]">
              The drop · {drop.collection}
            </span>
            <h2 className="display mt-5 text-4xl sm:text-6xl">
              Twelve pans,
              <br />
              one pastry case.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-cream/80">
              {drop.description}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {drop.shades.slice(0, 6).map((s) => (
                <span
                  key={s.name}
                  className="size-7 rounded-full ring-2 ring-white/40"
                  style={{ background: s.hex }}
                  title={s.name}
                />
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={`/product/${drop.slug}`}
                className="rounded-full bg-cream px-8 py-4 text-sm font-bold text-ink transition hover:bg-raspberry hover:text-white"
              >
                Shop {money(drop.price)}
              </Link>
              <span className="text-xs text-cream/70 line-through">
                {money(drop.compareAt!)}
              </span>
            </div>
          </div>
          <ProductArt
            product={drop}
            className="aspect-square w-full lg:aspect-auto lg:h-full"
          />
        </div>
      </section>

      {/* ── Best sellers ─────────────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-[11px] text-raspberry">Loved most</p>
            <h2 className="display mt-2 text-4xl sm:text-5xl">Best sellers</h2>
          </div>
          <Link
            href="/shop?sort=best"
            className="shrink-0 text-sm font-bold underline underline-offset-4 hover:text-raspberry"
          >
            Shop all →
          </Link>
        </div>
        <div className="mt-9 grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-4">
          {bestSellers.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* ── Shade Studio ─────────────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="grid overflow-hidden rounded-[2rem] bg-ink text-cream lg:grid-cols-[1.1fr_1fr]">
          <div className="p-8 sm:p-14">
            <span className="eyebrow w-fit rounded-full bg-raspberry px-3 py-1.5 text-[10px] text-white">
              Shade Studio
            </span>
            <h2 className="display mt-5 text-4xl sm:text-6xl">
              Build a bullet
              <br />
              nobody else has.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-cream/70">
              Choose the flavour, choose the finish, then press up to twelve
              characters into the brass. It ships in five days, in a box that
              looks like it came from a pâtisserie.
            </p>
            <ol className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ["01", "Pick a flavour", "24 shades across every family"],
                ["02", "Pick a finish", "Matte, satin or glaze"],
                ["03", "Press your name", "Foil-stamped, up to 12 characters"],
              ].map(([n, t, d]) => (
                <li key={n}>
                  <p className="display text-3xl text-raspberry">{n}</p>
                  <p className="mt-1 text-sm font-bold">{t}</p>
                  <p className="mt-0.5 text-xs text-cream/60">{d}</p>
                </li>
              ))}
            </ol>
            <Link
              href="/studio"
              className="mt-9 inline-flex rounded-full bg-cream px-8 py-4 text-sm font-bold text-ink transition hover:bg-raspberry hover:text-white"
            >
              Open the Studio
            </Link>
          </div>
          <div className="relative grid place-items-center bg-gradient-to-br from-raspberry/30 to-lavender/30 p-8">
            <div className="grid w-full max-w-sm grid-cols-2 gap-4">
              {["creme-de-macaron-lipstick", "sorbet-tint-stick"].map((slug, i) => (
                <ProductArt
                  key={slug}
                  product={getProduct(slug)!}
                  shadeIndex={i + 1}
                  className={`w-full rounded-3xl shadow-2xl ${i === 1 ? "mt-8" : ""}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── New in rail ──────────────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-[11px] text-pistachio">Fresh from the oven</p>
            <h2 className="display mt-2 text-4xl sm:text-5xl">New in</h2>
          </div>
          <Link
            href="/shop?sort=new"
            className="shrink-0 text-sm font-bold underline underline-offset-4 hover:text-raspberry"
          >
            See everything new →
          </Link>
        </div>
        <div className="mt-9 grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-4">
          {newIn.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* ── Co-Lab ───────────────────────────────────────────── */}
      <section className="bg-shell py-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <ProductArt
              product={colab}
              className="w-full rounded-[2rem] shadow-[0_40px_80px_-40px_rgba(22,16,14,.5)]"
            />
            <div>
              <p className="eyebrow text-[11px] text-raspberry">Co-Lab · 01</p>
              <h2 className="display mt-3 text-4xl sm:text-6xl">
                Three reds from
                <br />
                a Paris archive.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-soft">
                {colab.description}
              </p>
              <div className="mt-6 flex gap-3">
                {colab.shades.map((s) => (
                  <div key={s.name} className="text-center">
                    <span
                      className="block size-12 rounded-full ring-1 ring-black/10"
                      style={{ background: s.hex }}
                    />
                    <span className="mt-2 block text-[10px] text-ink-soft">
                      {s.name}
                    </span>
                  </div>
                ))}
              </div>
              <Link
                href={`/product/${colab.slug}`}
                className="mt-8 inline-flex rounded-full bg-ink px-8 py-4 text-sm font-bold text-cream transition hover:bg-raspberry"
              >
                Shop the Co-Lab
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Reviews ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6">
        <div className="text-center">
          <p className="eyebrow text-[11px] text-ink-soft">4.8 out of 5 · 31,402 reviews</p>
          <h2 className="display mt-3 text-4xl sm:text-5xl">
            What the counter says
          </h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {REVIEWS.map((r) => (
            <figure
              key={r.name}
              className="flex flex-col rounded-3xl p-6"
              style={{ background: r.tone }}
            >
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} viewBox="0 0 24 24" className="size-4 fill-ink">
                    <path d="m12 2 3 6.5 7 .9-5 4.9 1.2 7L12 18l-6.2 3.3L7 14.3l-5-4.9 7-.9z" />
                  </svg>
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed">
                “{r.quote}”
              </blockquote>
              <figcaption className="mt-5 text-xs">
                <span className="font-bold">{r.name}</span>
                <span className="block text-ink/60">on {r.product}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
