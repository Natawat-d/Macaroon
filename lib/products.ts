export type ProductType =
  | "lipstick"
  | "gloss"
  | "palette"
  | "blush"
  | "cushion"
  | "serum"
  | "mascara"
  | "liner"
  | "balm"
  | "set";

export type Category = "Lips" | "Eyes" | "Face" | "Skin" | "Sets";
export type Finish = "Matte" | "Satin" | "Glossy" | "Shimmer" | "Dewy";
export type Collection =
  | "Signature"
  | "Co-Lab"
  | "Limited Drop"
  | "Everyday"
  | "Patisserie";

export type Shade = {
  name: string;
  hex: string;
  /** Broad family used by the shade filter on the collection page. */
  family: "Pink" | "Red" | "Nude" | "Berry" | "Coral" | "Brown" | "Cool";
};

export type Product = {
  slug: string;
  name: string;
  subtitle: string;
  category: Category;
  type: ProductType;
  collection: Collection;
  finish: Finish;
  price: number;
  compareAt?: number;
  badge?: "New" | "Best Seller" | "Limited" | "Refill" | "Almost Gone";
  rating: number;
  reviews: number;
  sold: number;
  isNew?: boolean;
  personalizable?: boolean;
  shades: Shade[];
  /** Two-tone backdrop used by the card + PDP artwork. */
  backdrop: [string, string];
  description: string;
  details: string[];
  ingredients: string;
};

export const CATEGORIES: { name: Category; blurb: string; accent: string }[] = [
  { name: "Lips", blurb: "Balms, bullets & glazes", accent: "var(--color-raspberry)" },
  { name: "Eyes", blurb: "Palettes, liners & lashes", accent: "var(--color-blackcurrant)" },
  { name: "Face", blurb: "Blush, glow & cushions", accent: "var(--color-rose)" },
  { name: "Skin", blurb: "Prep, serum & set", accent: "var(--color-pistachio)" },
  { name: "Sets", blurb: "Boxed & giftable", accent: "var(--color-caramel)" },
];

export const FINISHES: Finish[] = ["Matte", "Satin", "Glossy", "Shimmer", "Dewy"];

export const COLLECTIONS: Collection[] = [
  "Signature",
  "Patisserie",
  "Co-Lab",
  "Limited Drop",
  "Everyday",
];

export const SHADE_FAMILIES: { name: Shade["family"]; hex: string }[] = [
  { name: "Pink", hex: "#f18cae" },
  { name: "Red", hex: "#d33b43" },
  { name: "Nude", hex: "#d3a184" },
  { name: "Berry", hex: "#8e3d69" },
  { name: "Coral", hex: "#f4795c" },
  { name: "Brown", hex: "#8b5a44" },
  { name: "Cool", hex: "#9aa6d4" },
];

export const PRODUCTS: Product[] = [
  {
    slug: "creme-de-macaron-lipstick",
    name: "Crème de Macaron",
    subtitle: "Weightless matte lipstick",
    category: "Lips",
    type: "lipstick",
    collection: "Signature",
    finish: "Matte",
    price: 28,
    badge: "Best Seller",
    rating: 4.8,
    reviews: 2841,
    sold: 190000,
    personalizable: true,
    shades: [
      { name: "Raspberry Shell", hex: "#e0446f", family: "Pink" },
      { name: "Blackcurrant", hex: "#7c3f63", family: "Berry" },
      { name: "Salted Caramel", hex: "#b56b4a", family: "Brown" },
      { name: "Rose Lychee", hex: "#e78ba0", family: "Pink" },
      { name: "Cherry Ganache", hex: "#c02b3a", family: "Red" },
      { name: "Vanilla Bean", hex: "#c9917a", family: "Nude" },
    ],
    backdrop: ["#ffe3ec", "#ffc2d6"],
    description:
      "Eight hours of pigment that never announces itself. A whipped matte that sits like powder and moves like balm — no flaking, no tight feeling, no touch-ups between the meeting and the dinner after it.",
    details: [
      "8-hour transfer-resistant wear",
      "Whipped mousse-to-powder finish",
      "Cushioned with shea + squalane",
      "Refillable brass-weighted case",
    ],
    ingredients:
      "Squalane, Shea Butter, Vitamin E, Jojoba Esters, Candelilla Wax, Raspberry Seed Oil.",
  },
  {
    slug: "glaze-royale-lip-gloss",
    name: "Glaze Royale",
    subtitle: "Non-sticky mirror gloss",
    category: "Lips",
    type: "gloss",
    collection: "Signature",
    finish: "Glossy",
    price: 24,
    badge: "Best Seller",
    rating: 4.9,
    reviews: 3960,
    sold: 240000,
    shades: [
      { name: "Peach Melba", hex: "#f79f7b", family: "Coral" },
      { name: "Strawberry Cream", hex: "#f08fa8", family: "Pink" },
      { name: "Clear Syrup", hex: "#f6e6dd", family: "Nude" },
      { name: "Plum Compote", hex: "#8c4a6b", family: "Berry" },
      { name: "Guava", hex: "#ec6a7a", family: "Coral" },
    ],
    backdrop: ["#fff0e2", "#ffd3b0"],
    description:
      "The shine of a lacquer without the tack. A cushioned doe-foot lays down a glass layer that pools light instead of hair, and the peptide base leaves lips fuller-looking by week three.",
    details: [
      "Mirror shine, zero stickiness",
      "Peptide-infused plumping base",
      "Sculpted flat doe-foot applicator",
      "Vanilla-almond scent",
    ],
    ingredients:
      "Polyglyceryl-2 Triisostearate, Peptide Complex, Hyaluronic Acid, Almond Oil, Vitamin E.",
  },
  {
    slug: "patisserie-eyeshadow-palette",
    name: "Patisserie No. 1",
    subtitle: "12-pan eyeshadow palette",
    category: "Eyes",
    type: "palette",
    collection: "Patisserie",
    finish: "Shimmer",
    price: 62,
    compareAt: 74,
    badge: "Best Seller",
    rating: 4.9,
    reviews: 1720,
    sold: 88000,
    shades: [
      { name: "Pistachio", hex: "#9ed49b", family: "Cool" },
      { name: "Rose Water", hex: "#eaa9b8", family: "Pink" },
      { name: "Earl Grey", hex: "#8e8aa4", family: "Cool" },
      { name: "Hazelnut", hex: "#a97a56", family: "Brown" },
      { name: "Passionfruit", hex: "#f0a03c", family: "Coral" },
      { name: "Blackcurrant", hex: "#6c4a94", family: "Berry" },
    ],
    backdrop: ["#efe6ff", "#d5c4f7"],
    description:
      "Twelve pans arranged like a pastry case — six buttery mattes, four pressed foils, two duo-chromes that shift from mint to lilac at the crease. Milled fine enough to blend with a finger.",
    details: [
      "12 pans · 6 matte / 4 foil / 2 duo-chrome",
      "Triple-milled, low-fallout formula",
      "Magnetic pans, fully refillable",
      "Full-size mirror in lid",
    ],
    ingredients:
      "Mica, Boron Nitride, Silica, Jojoba Oil, Kaolin, Tocopherol. Talc-free.",
  },
  {
    slug: "petal-press-blush",
    name: "Petal Press",
    subtitle: "Cream-to-powder blush",
    category: "Face",
    type: "blush",
    collection: "Signature",
    finish: "Dewy",
    price: 32,
    badge: "New",
    isNew: true,
    rating: 4.7,
    reviews: 940,
    sold: 42000,
    shades: [
      { name: "Lychee", hex: "#f2919f", family: "Pink" },
      { name: "Apricot Jam", hex: "#f0895f", family: "Coral" },
      { name: "Mulberry", hex: "#a8496f", family: "Berry" },
      { name: "Praline", hex: "#c38a6c", family: "Brown" },
    ],
    backdrop: ["#ffe8ee", "#ffbfd0"],
    description:
      "Presses in as a cream, sets like a veil. Bounces back under your fingertip and never breaks up over foundation — the flush reads lit-from-under rather than painted on.",
    details: [
      "Cream-to-powder bounce texture",
      "Buildable from sheer wash to full flush",
      "Blends with fingers, brush or sponge",
      "Compact doubles as a lip tint",
    ],
    ingredients:
      "Dimethicone, Squalane, Silica Microspheres, Rice Powder, Chamomile Extract.",
  },
  {
    slug: "soft-serve-cushion",
    name: "Soft Serve",
    subtitle: "Skin-tint cushion compact",
    category: "Face",
    type: "cushion",
    collection: "Everyday",
    finish: "Dewy",
    price: 46,
    badge: "Refill",
    rating: 4.6,
    reviews: 2210,
    sold: 130000,
    shades: [
      { name: "Vanilla 01", hex: "#f2d6c0", family: "Nude" },
      { name: "Almond 04", hex: "#e0b492", family: "Nude" },
      { name: "Caramel 08", hex: "#c08f68", family: "Brown" },
      { name: "Cocoa 12", hex: "#8b5a44", family: "Brown" },
      { name: "Espresso 16", hex: "#5f3a2c", family: "Brown" },
    ],
    backdrop: ["#fdeee0", "#f3d2b3"],
    description:
      "A second-skin tint in a cushion, so coverage stays exactly where you tap it. SPF 40 sits invisible — no cast, no chalk, no flashback in a camera roll.",
    details: [
      "SPF 40 PA+++, no white cast",
      "Sheer-to-medium buildable coverage",
      "16 shades, refillable pod",
      "Air-cushion applicator included",
    ],
    ingredients:
      "Zinc Oxide, Niacinamide, Glycerin, Panthenol, Centella Asiatica Extract.",
  },
  {
    slug: "double-shot-mascara",
    name: "Double Shot",
    subtitle: "Volumising tubing mascara",
    category: "Eyes",
    type: "mascara",
    collection: "Signature",
    finish: "Matte",
    price: 26,
    badge: "Best Seller",
    rating: 4.8,
    reviews: 5120,
    sold: 310000,
    shades: [
      { name: "Espresso Black", hex: "#171310", family: "Brown" },
      { name: "Cocoa Brown", hex: "#4a2f22", family: "Brown" },
      { name: "Blackcurrant Ink", hex: "#3a2547", family: "Berry" },
    ],
    backdrop: ["#e9e3f7", "#c8bce8"],
    description:
      "Tubes wrap each lash rather than coating it, so the lift holds through a workout and slides off with warm water alone. No raccoon eyes, no cotton pad tug.",
    details: [
      "Tubing formula, warm-water removal",
      "Smudge-proof for 16 hours",
      "Hourglass brush lifts inner corners",
      "Ophthalmologist tested",
    ],
    ingredients:
      "Acrylate Copolymer, Carnauba Wax, Panthenol, Biotin, Arginine.",
  },
  {
    slug: "sugar-glass-serum",
    name: "Sugar Glass",
    subtitle: "Glow-priming serum",
    category: "Skin",
    type: "serum",
    collection: "Everyday",
    finish: "Dewy",
    price: 54,
    rating: 4.7,
    reviews: 1490,
    sold: 76000,
    shades: [{ name: "Universal", hex: "#f4e2cf", family: "Nude" }],
    backdrop: ["#e6f7f1", "#c0ead9"],
    description:
      "A five-percent niacinamide serum that doubles as a grip primer. Skin drinks it in under sixty seconds, then holds whatever you put on top for the rest of the day.",
    details: [
      "5% niacinamide + 2% panthenol",
      "Doubles as a grip primer",
      "Absorbs in under 60 seconds",
      "Fragrance-free, all skin types",
    ],
    ingredients:
      "Niacinamide 5%, Panthenol 2%, Hyaluronic Acid, Ceramide NP, Squalane.",
  },
  {
    slug: "fine-line-liquid-liner",
    name: "Fine Line",
    subtitle: "0.1mm liquid eyeliner",
    category: "Eyes",
    type: "liner",
    collection: "Signature",
    finish: "Matte",
    price: 22,
    rating: 4.8,
    reviews: 3310,
    sold: 205000,
    shades: [
      { name: "Ink Black", hex: "#12100f", family: "Brown" },
      { name: "Cocoa", hex: "#553728", family: "Brown" },
      { name: "Plum Noir", hex: "#4a2b4a", family: "Berry" },
      { name: "Pistachio Pop", hex: "#6fae72", family: "Cool" },
    ],
    backdrop: ["#e4eef0", "#c2dae0"],
    description:
      "A 0.1mm felt tip with enough spring to draw a hairline flick and enough pigment to fill it in one pass. Waterproof, but it lifts cleanly with oil cleanser.",
    details: [
      "0.1mm precision felt tip",
      "One-stroke opacity",
      "Waterproof + sweat-proof",
      "Flexible tip holds its point",
    ],
    ingredients: "Water, Acrylates Copolymer, Iron Oxides, Butylene Glycol.",
  },
  {
    slug: "pillow-balm",
    name: "Pillow Balm",
    subtitle: "Overnight lip mask",
    category: "Lips",
    type: "balm",
    collection: "Everyday",
    finish: "Glossy",
    price: 20,
    badge: "New",
    isNew: true,
    rating: 4.9,
    reviews: 1180,
    sold: 64000,
    shades: [
      { name: "Vanilla", hex: "#f0dcc8", family: "Nude" },
      { name: "Rose", hex: "#eda9b6", family: "Pink" },
      { name: "Matcha", hex: "#b6d6a8", family: "Cool" },
      { name: "Cassis", hex: "#9c5e84", family: "Berry" },
    ],
    backdrop: ["#f3ecff", "#dcd0f7"],
    description:
      "Thick enough to stay put through a night of sleep, light enough to wear under gloss at noon. Wake up and the flakes are simply gone.",
    details: [
      "Overnight occlusive mask",
      "Wearable under lipstick by day",
      "Ceramide + murumuru butter",
      "Spatula included, hygienic jar",
    ],
    ingredients:
      "Murumuru Butter, Ceramide NP, Squalane, Shea, Bakuchiol, Vitamin E.",
  },
  {
    slug: "macaron-box-signature-set",
    name: "The Macaron Box",
    subtitle: "6-piece signature set",
    category: "Sets",
    type: "set",
    collection: "Patisserie",
    finish: "Satin",
    price: 148,
    compareAt: 192,
    badge: "Limited",
    rating: 4.9,
    reviews: 860,
    sold: 31000,
    personalizable: true,
    shades: [
      { name: "Pistachio", hex: "#9ed49b", family: "Cool" },
      { name: "Raspberry", hex: "#e0446f", family: "Pink" },
      { name: "Lavender", hex: "#bda6ec", family: "Cool" },
      { name: "Caramel", hex: "#dda15e", family: "Brown" },
      { name: "Rose", hex: "#f7b9c8", family: "Pink" },
      { name: "Cassis", hex: "#6c4a94", family: "Berry" },
    ],
    backdrop: ["#fdeadf", "#f5c9a8"],
    description:
      "Six best-sellers in a keepsake pastry box, sleeved and ribboned like the real thing. Save $44 against buying the line piece by piece — and add a foil-pressed name to the lid.",
    details: [
      "6 full-size pieces, $44 saving",
      "Foil-pressed personalisation on lid",
      "Ribbon-tied keepsake pastry box",
      "Gift note printed at checkout",
    ],
    ingredients: "See individual product pages for full INCI lists.",
  },
  {
    slug: "co-lab-atelier-rouge",
    name: "Atelier Rouge",
    subtitle: "Co-Lab velvet lip cream",
    category: "Lips",
    type: "lipstick",
    collection: "Co-Lab",
    finish: "Matte",
    price: 38,
    badge: "Almost Gone",
    rating: 4.7,
    reviews: 610,
    sold: 24000,
    shades: [
      { name: "Rouge 01", hex: "#b81f36", family: "Red" },
      { name: "Rouge 02", hex: "#8e1c3f", family: "Berry" },
      { name: "Rouge 03", hex: "#d94f4f", family: "Red" },
    ],
    backdrop: ["#ffdfe0", "#ffb3b3"],
    description:
      "Three reds, drawn from a Parisian atelier's pigment archive and pressed into a velvet cream. Limited to one run — the case is hand-numbered on the base.",
    details: [
      "Hand-numbered limited run",
      "Archive pigment reds",
      "Velvet air-whipped cream",
      "Magnetic hexagonal case",
    ],
    ingredients:
      "Isododecane, Carnauba Wax, Vitamin E, Rosehip Oil, Iron Oxides.",
  },
  {
    slug: "cloud-set-powder",
    name: "Cloud Set",
    subtitle: "Blurring loose powder",
    category: "Face",
    type: "blush",
    collection: "Everyday",
    finish: "Matte",
    price: 34,
    rating: 4.6,
    reviews: 1330,
    sold: 71000,
    shades: [
      { name: "Translucent", hex: "#f4e8dd", family: "Nude" },
      { name: "Honey", hex: "#dcb283", family: "Nude" },
      { name: "Deep", hex: "#8a6047", family: "Brown" },
    ],
    backdrop: ["#f4f0e8", "#e2d8c6"],
    description:
      "Micro-fine and weightless, it blurs texture without eating your glow. Sifts through a built-in mesh so you never load the puff with more than you need.",
    details: [
      "Soft-focus blurring optics",
      "No flashback in photos",
      "Built-in sifter + velour puff",
      "Won't settle into fine lines",
    ],
    ingredients: "Rice Starch, Silica, Boron Nitride, Allantoin. Talc-free.",
  },
  {
    slug: "sorbet-tint-stick",
    name: "Sorbet Stick",
    subtitle: "Lip & cheek tint stick",
    category: "Face",
    type: "lipstick",
    collection: "Everyday",
    finish: "Satin",
    price: 25,
    badge: "New",
    isNew: true,
    rating: 4.7,
    reviews: 520,
    sold: 28000,
    shades: [
      { name: "Watermelon", hex: "#ee5f77", family: "Pink" },
      { name: "Mango", hex: "#f2924a", family: "Coral" },
      { name: "Blueberry", hex: "#8d6fb5", family: "Cool" },
      { name: "Fig", hex: "#a35f6d", family: "Berry" },
    ],
    backdrop: ["#ffeede", "#ffcfa8"],
    description:
      "One stick, two places. Swipe onto cheeks and lips and blend with whatever you have — it stays creamy for ninety seconds, then locks.",
    details: [
      "Lip + cheek in one stick",
      "90-second blend window",
      "Sheer, layerable colour",
      "Slim enough for a back pocket",
    ],
    ingredients:
      "Jojoba Oil, Candelilla Wax, Vitamin E, Sunflower Seed Wax, Mica.",
  },
  {
    slug: "brow-croissant-pencil",
    name: "Croissant Brow",
    subtitle: "Ultra-fine brow pencil",
    category: "Eyes",
    type: "liner",
    collection: "Everyday",
    finish: "Matte",
    price: 21,
    rating: 4.6,
    reviews: 1870,
    sold: 96000,
    shades: [
      { name: "Blonde", hex: "#b98d63", family: "Nude" },
      { name: "Taupe", hex: "#8b7159", family: "Brown" },
      { name: "Chestnut", hex: "#6b452f", family: "Brown" },
      { name: "Soft Black", hex: "#332720", family: "Brown" },
    ],
    backdrop: ["#f6eee3", "#e6d3ba"],
    description:
      "A 1.5mm lead drawn to mimic a single hair, with a spoolie that grooms rather than flattens. Builds a brow that looks grown, not drawn.",
    details: [
      "1.5mm hair-stroke lead",
      "Waterproof, 12-hour hold",
      "Dual-ended with tapered spoolie",
      "No sharpener needed",
    ],
    ingredients: "Synthetic Wax, Iron Oxides, Ceramide, Panthenol.",
  },
  {
    slug: "meringue-highlighter",
    name: "Meringue",
    subtitle: "Liquid highlight drops",
    category: "Face",
    type: "serum",
    collection: "Signature",
    finish: "Shimmer",
    price: 30,
    rating: 4.8,
    reviews: 1610,
    sold: 84000,
    shades: [
      { name: "Vanilla Gold", hex: "#f0d29a", family: "Nude" },
      { name: "Rose Pearl", hex: "#f2c3c9", family: "Pink" },
      { name: "Bronze Sugar", hex: "#c88f5f", family: "Brown" },
      { name: "Lilac Frost", hex: "#cbb8e8", family: "Cool" },
    ],
    backdrop: ["#fff5e0", "#ffe0ad"],
    description:
      "Two drops mixed into moisturiser or tapped on the high points. The pearl is milled so fine it reads as wet skin instead of glitter.",
    details: [
      "Mix into base or wear alone",
      "Ultra-fine pearl, no glitter",
      "Dropper controls the dose",
      "Layerable to a full beam",
    ],
    ingredients: "Squalane, Synthetic Fluorphlogopite, Mica, Vitamin E.",
  },
  {
    slug: "co-lab-tokyo-neon-palette",
    name: "Tokyo Neon",
    subtitle: "Co-Lab 9-pan palette",
    category: "Eyes",
    type: "palette",
    collection: "Co-Lab",
    finish: "Shimmer",
    price: 58,
    badge: "Limited",
    rating: 4.8,
    reviews: 430,
    sold: 19000,
    shades: [
      { name: "Neon Melon", hex: "#a6e05a", family: "Cool" },
      { name: "Hot Sakura", hex: "#ff5c9e", family: "Pink" },
      { name: "Electric Ume", hex: "#7c4bd0", family: "Berry" },
      { name: "Yuzu", hex: "#f5c542", family: "Coral" },
      { name: "Aqua Soda", hex: "#3fc6d8", family: "Cool" },
    ],
    backdrop: ["#e2fbe5", "#b4f0c0"],
    description:
      "Nine high-voltage pressed pigments built with a Tokyo street-art studio. Wet the brush and they go from pastel wash to full neon block.",
    details: [
      "9 pressed pigments, wet-or-dry",
      "Limited collaboration run",
      "Holographic sleeve + sticker sheet",
      "Vegan, cruelty-free",
    ],
    ingredients: "Mica, Silica, Synthetic Fluorphlogopite, Jojoba, Kaolin.",
  },
  {
    slug: "velvet-fog-lip-liner",
    name: "Velvet Fog",
    subtitle: "Blurring lip liner",
    category: "Lips",
    type: "liner",
    collection: "Signature",
    finish: "Matte",
    price: 19,
    rating: 4.7,
    reviews: 2240,
    sold: 118000,
    shades: [
      { name: "Bare Shell", hex: "#c98f7c", family: "Nude" },
      { name: "Rosewood", hex: "#a85f5f", family: "Nude" },
      { name: "Berry Fog", hex: "#8c4560", family: "Berry" },
      { name: "Cocoa Dust", hex: "#7b4b3a", family: "Brown" },
      { name: "Cherry", hex: "#b1293c", family: "Red" },
    ],
    backdrop: ["#f7e5e0", "#e8c3bb"],
    description:
      "Soft enough to smudge into a blur, firm enough to hold an edge. Wear it as a full base and lipstick lasts twice as long.",
    details: [
      "Blur or define with one tip",
      "Doubles as a full-lip base",
      "Retractable, no sharpener",
      "Non-drying wax-free glide",
    ],
    ingredients: "Squalane, Silica, Iron Oxides, Vitamin E, Rice Bran Wax.",
  },
  {
    slug: "petit-four-mini-set",
    name: "Petit Four",
    subtitle: "4-piece mini set",
    category: "Sets",
    type: "set",
    collection: "Patisserie",
    finish: "Satin",
    price: 58,
    compareAt: 72,
    badge: "New",
    isNew: true,
    rating: 4.8,
    reviews: 390,
    sold: 22000,
    shades: [
      { name: "Pistachio", hex: "#9ed49b", family: "Cool" },
      { name: "Raspberry", hex: "#e0446f", family: "Pink" },
      { name: "Lemon", hex: "#f8d970", family: "Coral" },
      { name: "Rose", hex: "#f7b9c8", family: "Pink" },
    ],
    backdrop: ["#eafaf0", "#c6ecd6"],
    description:
      "Four minis sized for a carry-on and a weekend: a bullet, a gloss, a tint stick and a balm. The whole face, in a box that fits in a palm.",
    details: [
      "4 travel minis, $14 saving",
      "Cabin-bag friendly sizes",
      "Reusable tin box",
      "Great first taste of the line",
    ],
    ingredients: "See individual product pages for full INCI lists.",
  },
  {
    slug: "milk-bath-cleanser",
    name: "Milk Bath",
    subtitle: "Melting cleansing balm",
    category: "Skin",
    type: "balm",
    collection: "Everyday",
    finish: "Dewy",
    price: 36,
    rating: 4.8,
    reviews: 2050,
    sold: 108000,
    shades: [{ name: "Universal", hex: "#f6ece0", family: "Nude" }],
    backdrop: ["#eef6ff", "#cfe4f7"],
    description:
      "Melts a full face — tubing mascara included — in one pass, then rinses without a film. The kind of first cleanse that makes the second one optional.",
    details: [
      "Removes waterproof makeup in one pass",
      "Rinses clean, no greasy film",
      "Rice bran + oat lipids",
      "Fragrance-free",
    ],
    ingredients:
      "Rice Bran Oil, Oat Kernel Extract, Squalane, Glycerin, Vitamin E.",
  },
  {
    slug: "eclair-lash-curler",
    name: "Éclair Lift",
    subtitle: "Heated lash curler",
    category: "Eyes",
    type: "mascara",
    collection: "Signature",
    finish: "Matte",
    price: 42,
    rating: 4.5,
    reviews: 780,
    sold: 33000,
    shades: [
      { name: "Cream", hex: "#f4e6d8", family: "Nude" },
      { name: "Blackcurrant", hex: "#6c4a94", family: "Berry" },
    ],
    backdrop: ["#f0e9ff", "#d8c9f5"],
    description:
      "Warms to 60°C in eight seconds and sets a curl that survives humidity. USB-C, travel-locked, and small enough to live in a pouch.",
    details: [
      "Heats in 8 seconds, 3 heat levels",
      "Holds curl 12+ hours",
      "USB-C rechargeable, travel lock",
      "Auto shut-off",
    ],
    ingredients: "Device — no INCI. Ceramic-coated heating comb.",
  },
  {
    slug: "rose-mist-setting-spray",
    name: "Rose Mist",
    subtitle: "Locking setting spray",
    category: "Skin",
    type: "serum",
    collection: "Signature",
    finish: "Dewy",
    price: 29,
    badge: "Best Seller",
    rating: 4.7,
    reviews: 2670,
    sold: 152000,
    shades: [{ name: "Universal", hex: "#f7dfe4", family: "Pink" }],
    backdrop: ["#ffe9f0", "#f9c8d8"],
    description:
      "A micro-fine mist that melts powder edges into skin and holds for sixteen hours. Not a wet cloud — a dry veil that never streaks foundation.",
    details: [
      "16-hour lock, humidity-proof",
      "Micro-fine dry mist nozzle",
      "Melts powder into skin",
      "Rosewater + glycerin base",
    ],
    ingredients: "Rosa Damascena Water, Glycerin, Panthenol, Sodium PCA.",
  },
  {
    slug: "opera-cake-contour-duo",
    name: "Opéra Duo",
    subtitle: "Cream contour & sculpt",
    category: "Face",
    type: "palette",
    collection: "Signature",
    finish: "Satin",
    price: 38,
    rating: 4.6,
    reviews: 1120,
    sold: 58000,
    shades: [
      { name: "Light / Cool", hex: "#c99f80", family: "Nude" },
      { name: "Medium / Neutral", hex: "#a9765a", family: "Brown" },
      { name: "Deep / Warm", hex: "#7a4a34", family: "Brown" },
    ],
    backdrop: ["#f6ece0", "#e0c6a8"],
    description:
      "A grey-leaning sculpt and a warm bronze in one compact, so shadow reads like bone structure instead of stripes. Creamy enough to blend with a fingertip.",
    details: [
      "Cool sculpt + warm bronze duo",
      "Blends with finger or brush",
      "Non-muddy, buildable",
      "Compact fits a clutch",
    ],
    ingredients: "Dimethicone, Squalane, Iron Oxides, Kaolin, Vitamin E.",
  },
  {
    slug: "limited-lavender-drop",
    name: "Lavande Drop",
    subtitle: "Limited lip & eye duo",
    category: "Sets",
    type: "set",
    collection: "Limited Drop",
    finish: "Shimmer",
    price: 54,
    badge: "Almost Gone",
    rating: 4.8,
    reviews: 260,
    sold: 12000,
    shades: [
      { name: "Lavender Honey", hex: "#bda6ec", family: "Cool" },
      { name: "Violet Cream", hex: "#8a6cc4", family: "Berry" },
    ],
    backdrop: ["#f0eaff", "#d6c6f7"],
    description:
      "A shimmering lilac shadow and its matching sheer lip, released together for one season only. When the run ends, it does not come back.",
    details: [
      "Seasonal run, not restocked",
      "Matching lip + eye pairing",
      "Numbered outer sleeve",
      "Ships in a lilac keepsake pouch",
    ],
    ingredients: "Mica, Squalane, Jojoba Esters, Vitamin E, Iron Oxides.",
  },
  {
    slug: "matcha-clay-mask",
    name: "Matcha Hour",
    subtitle: "Cooling clay mask",
    category: "Skin",
    type: "balm",
    collection: "Patisserie",
    finish: "Matte",
    price: 33,
    rating: 4.6,
    reviews: 890,
    sold: 46000,
    shades: [{ name: "Universal", hex: "#c3ddb0", family: "Cool" }],
    backdrop: ["#ecf7e4", "#c9e8bb"],
    description:
      "Ten minutes of green clay and matcha that pulls congestion without stripping. Rinses to a soft, matte-but-not-tight finish.",
    details: [
      "10-minute cooling treatment",
      "Kaolin + ceremonial matcha",
      "Won't over-strip or tighten",
      "1–2× weekly",
    ],
    ingredients:
      "Kaolin, Camellia Sinensis Leaf Powder, Glycerin, Allantoin, Bisabolol.",
  },
];

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function relatedProducts(product: Product, count = 4) {
  return PRODUCTS.filter(
    (p) => p.slug !== product.slug && p.category === product.category,
  )
    .concat(PRODUCTS.filter((p) => p.slug !== product.slug))
    .filter((p, i, arr) => arr.findIndex((x) => x.slug === p.slug) === i)
    .slice(0, count);
}

export const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });
