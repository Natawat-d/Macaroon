"use client";

import { useMemo, useState } from "react";
import { ENGRAVING_PRICE, useCart } from "@/lib/cart";
import { getProduct, money } from "@/lib/products";

const BASES = [
  { key: "creme-de-macaron-lipstick", label: "Bullet", note: "Matte lipstick", shape: "barrel" },
  { key: "sorbet-tint-stick", label: "Stick", note: "Lip & cheek tint", shape: "barrel" },
  { key: "glaze-royale-lip-gloss", label: "Glaze", note: "Mirror gloss", shape: "barrel" },
  { key: "petal-press-blush", label: "Compact", note: "Cream blush", shape: "disc" },
] as const;

const CASES = [
  { name: "Ink", body: "#16100e", text: "#fff9f4", trim: "#3a2f2a" },
  { name: "Brass", body: "#d3a24a", text: "#3a2a10", trim: "#b0812f" },
  { name: "Cream", body: "#f2e3d3", text: "#4a3a2e", trim: "#dcc7b2" },
  { name: "Rose", body: "#e79fb4", text: "#4d1f2e", trim: "#d1859c" },
] as const;

const FINISHES = [
  { name: "Matte", note: "Velvet, no shine" },
  { name: "Satin", note: "Soft glow" },
  { name: "Glaze", note: "Wet mirror" },
] as const;

const TYPEFACES = [
  { name: "Serif", family: "Georgia, 'Times New Roman', serif", spacing: 2 },
  { name: "Grotesk", family: "var(--font-outfit), sans-serif", spacing: 3 },
  { name: "Mono", family: "ui-monospace, 'SF Mono', monospace", spacing: 4 },
] as const;

export default function Studio() {
  const { add } = useCart();
  const [baseIndex, setBaseIndex] = useState(0);
  const [shadeIndex, setShadeIndex] = useState(0);
  const [caseIndex, setCaseIndex] = useState(0);
  const [finishIndex, setFinishIndex] = useState(0);
  const [typeIndex, setTypeIndex] = useState(1);
  const [engraving, setEngraving] = useState("ISABELLE");

  const base = BASES[baseIndex];
  const product = getProduct(base.key)!;
  const shade = product.shades[Math.min(shadeIndex, product.shades.length - 1)];
  const casing = CASES[caseIndex];
  const face = TYPEFACES[typeIndex];
  const trimmed = engraving.trim();

  const total = useMemo(
    () => product.price + (trimmed ? ENGRAVING_PRICE : 0),
    [product.price, trimmed],
  );

  const pickBase = (i: number) => {
    setBaseIndex(i);
    setShadeIndex(0);
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
      <header className="max-w-3xl py-10">
        <span className="eyebrow rounded-full bg-raspberry px-3 py-1.5 text-[10px] text-white">
          Shade Studio
        </span>
        <h1 className="display mt-5 text-5xl sm:text-7xl">
          Build a bullet
          <br />
          nobody else has.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft sm:text-base">
          Four bases, every flavour in the case, and up to twelve characters
          pressed into the metal. Made to order and shipped inside five days.
        </p>
      </header>

      <div className="grid gap-10 pb-16 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        {/* Live preview */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div
            className="relative overflow-hidden rounded-[2rem] p-8"
            style={{
              background: `linear-gradient(150deg, ${shade.hex}22, ${shade.hex}55)`,
            }}
          >
            <Preview
              shape={base.shape}
              shade={shade.hex}
              casing={casing}
              finish={FINISHES[finishIndex].name}
              engraving={trimmed}
              face={face}
            />
            <div className="absolute top-5 left-5 rounded-full bg-cream/85 px-3 py-1.5 text-[10px] font-bold backdrop-blur">
              Made to order · ships in 5 days
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center text-[11px] text-ink-soft">
            <div className="rounded-2xl bg-shell py-3">
              <p className="font-bold text-ink">{base.label}</p>
              {base.note}
            </div>
            <div className="rounded-2xl bg-shell py-3">
              <p className="font-bold text-ink">{shade.name}</p>
              {FINISHES[finishIndex].name}
            </div>
            <div className="rounded-2xl bg-shell py-3">
              <p className="font-bold text-ink">{casing.name} case</p>
              {trimmed ? `“${trimmed}”` : "No engraving"}
            </div>
          </div>
        </div>

        {/* Builder */}
        <div className="space-y-9">
          <Step n="01" title="Choose your base">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {BASES.map((b, i) => {
                const p = getProduct(b.key)!;
                return (
                  <button
                    key={b.key}
                    onClick={() => pickBase(i)}
                    aria-pressed={i === baseIndex}
                    className={`rounded-2xl border p-4 text-left transition ${
                      i === baseIndex
                        ? "border-ink bg-shell"
                        : "border-line hover:border-ink"
                    }`}
                  >
                    <p className="text-sm font-bold">{b.label}</p>
                    <p className="mt-0.5 text-[11px] text-ink-soft">{b.note}</p>
                    <p className="mt-2 text-xs font-semibold">{money(p.price)}</p>
                  </button>
                );
              })}
            </div>
          </Step>

          <Step n="02" title="Pick a flavour" hint={shade.name}>
            <div className="flex flex-wrap gap-3">
              {product.shades.map((s, i) => (
                <button
                  key={s.name}
                  onClick={() => setShadeIndex(i)}
                  title={s.name}
                  aria-label={s.name}
                  aria-pressed={i === shadeIndex}
                  className={`size-12 rounded-full transition ${
                    i === shadeIndex
                      ? "ring-2 ring-ink ring-offset-4 ring-offset-cream"
                      : "ring-1 ring-black/10 hover:scale-110"
                  }`}
                  style={{ background: s.hex }}
                />
              ))}
            </div>
          </Step>

          <Step n="03" title="Choose a finish">
            <div className="grid grid-cols-3 gap-3">
              {FINISHES.map((f, i) => (
                <button
                  key={f.name}
                  onClick={() => setFinishIndex(i)}
                  aria-pressed={i === finishIndex}
                  className={`rounded-2xl border py-4 transition ${
                    i === finishIndex
                      ? "border-ink bg-shell"
                      : "border-line hover:border-ink"
                  }`}
                >
                  <p className="text-sm font-bold">{f.name}</p>
                  <p className="mt-0.5 text-[11px] text-ink-soft">{f.note}</p>
                </button>
              ))}
            </div>
          </Step>

          <Step n="04" title="Choose a case">
            <div className="flex flex-wrap gap-3">
              {CASES.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => setCaseIndex(i)}
                  aria-pressed={i === caseIndex}
                  className={`flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-xs font-semibold transition ${
                    i === caseIndex
                      ? "border-ink bg-ink text-cream"
                      : "border-line hover:border-ink"
                  }`}
                >
                  <span
                    className="size-4 rounded-full ring-1 ring-black/15"
                    style={{ background: c.body }}
                  />
                  {c.name}
                </button>
              ))}
            </div>
          </Step>

          <Step
            n="05"
            title="Press your name"
            hint={`${trimmed.length}/12 characters`}
          >
            <input
              value={engraving}
              maxLength={12}
              onChange={(e) =>
                setEngraving(e.target.value.replace(/[^a-zA-Z0-9 .&'-]/g, ""))
              }
              placeholder="Up to 12 characters"
              className="w-full rounded-2xl border border-line bg-transparent px-5 py-4 text-sm outline-none transition focus:border-ink"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {TYPEFACES.map((t, i) => (
                <button
                  key={t.name}
                  onClick={() => setTypeIndex(i)}
                  aria-pressed={i === typeIndex}
                  className={`rounded-full border px-4 py-2 text-xs transition ${
                    i === typeIndex
                      ? "border-ink bg-ink text-cream"
                      : "border-line hover:border-ink"
                  }`}
                  style={{ fontFamily: t.family }}
                >
                  {t.name}
                </button>
              ))}
              {trimmed && (
                <button
                  onClick={() => setEngraving("")}
                  className="ml-auto text-xs font-semibold text-raspberry underline underline-offset-2"
                >
                  Remove engraving
                </button>
              )}
            </div>
            <p className="mt-3 text-[11px] text-ink-soft">
              Foil stamping adds {money(ENGRAVING_PRICE)}. Personalised pieces are
              made to order and can&rsquo;t be returned — but the shade guarantee
              still applies if the colour is wrong.
            </p>
          </Step>

          {/* Summary */}
          <div className="rounded-3xl bg-ink p-6 text-cream">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-cream/70">
                {product.name} · {shade.name}
              </span>
              <span className="text-sm">{money(product.price)}</span>
            </div>
            {trimmed && (
              <div className="mt-2 flex items-baseline justify-between border-t border-white/10 pt-2">
                <span className="text-sm text-cream/70">
                  Engraving “{trimmed}”
                </span>
                <span className="text-sm">{money(ENGRAVING_PRICE)}</span>
              </div>
            )}
            <div className="mt-4 flex items-baseline justify-between border-t border-white/10 pt-4">
              <span className="text-sm font-bold">Total</span>
              <span className="display text-2xl">{money(total)}</span>
            </div>
            <button
              onClick={() => add(product.slug, shadeIndex, 1, trimmed || undefined)}
              className="mt-5 w-full rounded-full bg-cream py-4 text-sm font-bold text-ink transition hover:bg-raspberry hover:text-white"
            >
              Add to bag · {money(total)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({
  n,
  title,
  hint,
  children,
}: {
  n: string;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-baseline gap-3 pb-4">
        <span className="display text-lg text-raspberry">{n}</span>
        <h2 className="display text-2xl">{title}</h2>
        {hint && (
          <span className="ml-auto text-xs text-ink-soft">{hint}</span>
        )}
      </div>
      {children}
    </section>
  );
}

function Preview({
  shape,
  shade,
  casing,
  finish,
  engraving,
  face,
}: {
  shape: "barrel" | "disc";
  shade: string;
  casing: (typeof CASES)[number];
  finish: string;
  engraving: string;
  face: (typeof TYPEFACES)[number];
}) {
  const sheen = finish === "Glaze" ? 0.55 : finish === "Satin" ? 0.3 : 0.12;

  return (
    <svg viewBox="0 0 400 460" className="mx-auto w-full max-w-md">
      <defs>
        <linearGradient id="studio-case" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={casing.trim} />
          <stop offset="35%" stopColor={casing.body} />
          <stop offset="55%" stopColor={casing.body} />
          <stop offset="100%" stopColor={casing.trim} />
        </linearGradient>
        <linearGradient id="studio-shade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={shade} stopOpacity="0.75" />
          <stop offset="60%" stopColor={shade} />
          <stop offset="100%" stopColor={shade} stopOpacity="0.85" />
        </linearGradient>
        <filter id="studio-shadow" x="-40%" y="-20%" width="180%" height="160%">
          <feDropShadow dx="0" dy="18" stdDeviation="18" floodOpacity="0.28" />
        </filter>
      </defs>

      <ellipse cx="200" cy="424" rx="112" ry="16" fill="#000" opacity=".14" />

      {shape === "barrel" ? (
        <g filter="url(#studio-shadow)">
          {/* bullet */}
          <path
            d="M158 92c0-10 8-18 18-18h48c10 0 18 8 18 18v74h-84z"
            fill="url(#studio-shade)"
          />
          <path
            d="M158 92c0-10 8-18 18-18h14l-10 92h-22z"
            fill="#fff"
            opacity={sheen}
          />
          <path d="M158 148h84v20h-84z" fill={shade} opacity=".65" />
          {/* collar */}
          <rect x="150" y="166" width="100" height="22" rx="5" fill={casing.trim} />
          {/* body */}
          <rect x="154" y="188" width="92" height="196" rx="14" fill="url(#studio-case)" />
          <rect x="166" y="198" width="12" height="172" rx="6" fill="#fff" opacity=".16" />
          <rect x="154" y="356" width="92" height="28" rx="14" fill={casing.trim} />
          {/* engraving plate */}
          <rect
            x="164"
            y="236"
            width="72"
            height="106"
            rx="8"
            fill="#000"
            opacity=".12"
          />
          {engraving ? (
            <text
              x="200"
              y="290"
              textAnchor="middle"
              fill={casing.text}
              fontSize={engraving.length > 8 ? 15 : 19}
              fontWeight="700"
              letterSpacing={face.spacing}
              fontFamily={face.family}
              transform="rotate(90 200 290)"
            >
              {engraving.toUpperCase()}
            </text>
          ) : (
            <text
              x="200"
              y="292"
              textAnchor="middle"
              fill={casing.text}
              fontSize="13"
              opacity=".45"
              letterSpacing="4"
              fontFamily="var(--font-outfit), sans-serif"
              transform="rotate(90 200 292)"
            >
              MACARON
            </text>
          )}
        </g>
      ) : (
        <g filter="url(#studio-shadow)">
          {/* open compact */}
          <circle cx="200" cy="230" r="128" fill="url(#studio-case)" />
          <circle cx="200" cy="230" r="112" fill={casing.trim} opacity=".5" />
          <circle cx="200" cy="230" r="98" fill="url(#studio-shade)" />
          <circle cx="200" cy="230" r="98" fill="#fff" opacity={sheen * 0.4} />
          <path
            d="M142 194a72 72 0 0 1 116 0"
            stroke="#fff"
            strokeOpacity={sheen}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          <rect x="104" y="352" width="192" height="44" rx="22" fill="url(#studio-case)" />
          <text
            x="200"
            y="380"
            textAnchor="middle"
            fill={casing.text}
            fontSize={engraving.length > 8 ? 16 : 20}
            fontWeight="700"
            letterSpacing={face.spacing}
            fontFamily={face.family}
            opacity={engraving ? 1 : 0.45}
          >
            {(engraving || "MACARON").toUpperCase()}
          </text>
        </g>
      )}
    </svg>
  );
}
