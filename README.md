# Macaron

A drop-culture makeup storefront — the Casetify commerce pattern (marquee announcement bar, mega-menu, faceted collection grid with hover-swap cards, quick-add, personalisation studio, slide-out bag) rebuilt around a small-batch cosmetics brand.

**Live:** http://147.50.254.104:3400

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind CSS v4 · TypeScript. No database and no external image hosts — the catalogue is a typed module and every product shot is vector art generated from the shade's hex value, so the grid renders identically offline.

## Routes

| Route | What it is |
| --- | --- |
| `/` | Hero, category rail, feature drop, best sellers, Studio banner, Co-Lab, reviews |
| `/shop` | Faceted collection page — category / collection / finish / shade-family / price, six sort modes, load-more paging, in-grid promo tile, FAQ |
| `/product/[slug]` | Gallery with shade-driven art, buy box, accordions, ratings breakdown, related grid (24 pages prerendered) |
| `/studio` | Personalisation builder — base, flavour, finish, case, foil-stamped engraving with live SVG preview |

`/shop` reads `?category=`, `?collection=` and `?sort=` so nav links and footer links deep-link into a pre-filtered view.

## Key files

- `lib/products.ts` — the catalogue: 24 products, shades with colour families, finishes, collections, badges
- `lib/cart.tsx` — cart context, localStorage-backed; line identity is slug + shade + engraving
- `components/product-art.tsx` — vector product renderer, one branch per product type, plus the macaron logo mark
- `components/shop-client.tsx` — filtering, sorting and paging for the collection page
- `components/studio.tsx` — the personalisation builder and its live preview

## Local development

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build (output: standalone)
```

## Deploy

The image builds on the host — the source is rsynced up rather than pushing a cross-architecture image from a Mac.

```bash
rsync -az --delete \
  --exclude node_modules --exclude .next --exclude .git \
  -e "ssh -i ~/.ssh/akkra_deploy" \
  ./ root@147.50.254.104:/opt/macaron/

ssh -i ~/.ssh/akkra_deploy root@147.50.254.104 \
  'cd /opt/macaron && docker compose up -d --build'
```

The container publishes `3400:3000` and carries a healthcheck. That host also runs Caddy in front of several other apps — putting Macaron on a domain means adding a reverse-proxy block to the shared Caddyfile, which is deliberately left untouched here.
