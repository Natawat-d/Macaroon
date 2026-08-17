import type { Product } from "@/lib/products";

type Props = {
  product: Product;
  /** Index into product.shades — drives the colour of the rendered piece. */
  shadeIndex?: number;
  /** "alt" is the hover/second angle: swatch smear behind a tilted product. */
  variant?: "front" | "alt";
  className?: string;
};

/** Darken a hex colour by mixing toward black. */
function shade(hex: string, amount: number) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.round(((n >> 16) & 255) * (1 - amount));
  const g = Math.round(((n >> 8) & 255) * (1 - amount));
  const b = Math.round((n & 255) * (1 - amount));
  return `rgb(${r} ${g} ${b})`;
}

/** Lighten a hex colour by mixing toward white. */
function tint(hex: string, amount: number) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.round(((n >> 16) & 255) + (255 - ((n >> 16) & 255)) * amount);
  const g = Math.round(((n >> 8) & 255) + (255 - ((n >> 8) & 255)) * amount);
  const b = Math.round((n & 255) + (255 - (n & 255)) * amount);
  return `rgb(${r} ${g} ${b})`;
}

export default function ProductArt({
  product,
  shadeIndex = 0,
  variant = "front",
  className,
}: Props) {
  const s = product.shades[shadeIndex] ?? product.shades[0];
  const c = s.hex;
  const [bg1, bg2] = product.backdrop;
  const id = `${product.slug}-${shadeIndex}-${variant}`;
  const alt = variant === "alt";

  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      role="img"
      aria-label={`${product.name} in ${s.name}`}
    >
      <defs>
        <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={alt ? bg2 : bg1} />
          <stop offset="100%" stopColor={alt ? bg1 : bg2} />
        </linearGradient>
        <linearGradient id={`metal-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2a2320" />
          <stop offset="28%" stopColor="#6f625b" />
          <stop offset="46%" stopColor="#efe6de" />
          <stop offset="62%" stopColor="#7a6d65" />
          <stop offset="100%" stopColor="#2a2320" />
        </linearGradient>
        <linearGradient id={`glass-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity=".65" />
          <stop offset="35%" stopColor="#ffffff" stopOpacity=".12" />
          <stop offset="100%" stopColor="#000000" stopOpacity=".12" />
        </linearGradient>
        <linearGradient id={`color-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={tint(c, 0.28)} />
          <stop offset="55%" stopColor={c} />
          <stop offset="100%" stopColor={shade(c, 0.28)} />
        </linearGradient>
        <radialGradient id={`glow-${id}`} cx="50%" cy="42%" r="52%">
          <stop offset="0%" stopColor="#fff" stopOpacity=".85" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <filter id={`drop-${id}`} x="-30%" y="-20%" width="160%" height="150%">
          <feDropShadow
            dx="0"
            dy="10"
            stdDeviation="12"
            floodColor={shade(c, 0.55)}
            floodOpacity="0.28"
          />
        </filter>
      </defs>

      <rect width="400" height="400" fill={`url(#bg-${id})`} />
      <ellipse cx="200" cy="170" rx="150" ry="150" fill={`url(#glow-${id})`} />

      {/* Hover angle: a painted swatch smear the product sits on top of */}
      {alt && (
        <g opacity="0.92">
          <path
            d="M52 246c34-30 78-42 124-38 44 4 82 22 126 12 18-4 32-12 44-22v70c-20 14-44 22-70 24-52 4-96-16-142-18-30-2-58 4-82 20z"
            fill={c}
            opacity="0.9"
          />
          <path
            d="M60 238c40-26 84-32 130-26 40 5 76 20 116 12"
            stroke={tint(c, 0.5)}
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />
        </g>
      )}

      <g
        filter={`url(#drop-${id})`}
        transform={alt ? "rotate(-13 200 200) translate(0 -6)" : undefined}
      >
        <Piece type={product.type} c={c} id={id} product={product} />
      </g>

      {/* Embossed wordmark, the way a compact lid is stamped */}
      <text
        x="200"
        y="374"
        textAnchor="middle"
        fontSize="15"
        letterSpacing="7"
        fontWeight="700"
        fill={shade(c, 0.45)}
        opacity="0.32"
        fontFamily="var(--font-display), sans-serif"
      >
        MACARON
      </text>
    </svg>
  );
}

function Piece({
  type,
  c,
  id,
  product,
}: {
  type: Product["type"];
  c: string;
  id: string;
  product: Product;
}) {
  const metal = `url(#metal-${id})`;
  const color = `url(#color-${id})`;
  const glass = `url(#glass-${id})`;

  switch (type) {
    case "lipstick":
      return (
        <g>
          {/* bullet */}
          <path
            d="M170 108c0-8 6-14 14-14h32c8 0 14 6 14 14v58h-60z"
            fill={color}
          />
          <path
            d="M170 108c0-8 6-14 14-14h10l-8 72h-16z"
            fill="#fff"
            opacity=".22"
          />
          <path d="M170 150h60v18h-60z" fill={shade(c, 0.22)} />
          {/* collar + barrel */}
          <rect x="163" y="166" width="74" height="20" rx="4" fill={metal} />
          <rect x="167" y="186" width="66" height="112" rx="10" fill="#1b1613" />
          <rect x="177" y="192" width="10" height="100" rx="5" fill="#fff" opacity=".14" />
          <rect x="167" y="272" width="66" height="26" rx="10" fill={metal} />
          <circle cx="200" cy="228" r="15" fill={c} opacity=".9" />
          <circle cx="200" cy="228" r="15" fill="none" stroke="#fff" strokeOpacity=".35" />
        </g>
      );

    case "gloss":
      return (
        <g>
          {/* wand cap */}
          <rect x="182" y="76" width="36" height="66" rx="8" fill="#1b1613" />
          <rect x="188" y="82" width="7" height="52" rx="3.5" fill="#fff" opacity=".16" />
          {/* vial */}
          <path
            d="M172 142h56c6 0 10 4 10 10v134c0 8-6 14-14 14h-48c-8 0-14-6-14-14V152c0-6 4-10 10-10z"
            fill={c}
            opacity=".92"
          />
          <path
            d="M172 142h56c6 0 10 4 10 10v134c0 8-6 14-14 14h-48c-8 0-14-6-14-14V152c0-6 4-10 10-10z"
            fill={glass}
          />
          <rect x="180" y="160" width="9" height="116" rx="4.5" fill="#fff" opacity=".38" />
          <rect x="168" y="196" width="64" height="30" rx="4" fill="#fff" opacity=".82" />
          <text
            x="200"
            y="216"
            textAnchor="middle"
            fontSize="13"
            fontWeight="800"
            fill={shade(c, 0.5)}
            letterSpacing="2"
            fontFamily="var(--font-display), sans-serif"
          >
            GLAZE
          </text>
        </g>
      );

    case "palette": {
      const pans = product.shades.slice(0, 6);
      return (
        <g>
          <rect x="66" y="112" width="268" height="176" rx="18" fill="#221b18" />
          <rect x="66" y="112" width="268" height="176" rx="18" fill={glass} opacity=".4" />
          {/* mirror half */}
          <rect x="78" y="124" width="118" height="152" rx="10" fill="#dfe7ea" />
          <path d="M78 214l118-72v30l-118 72z" fill="#fff" opacity=".55" />
          {/* pans */}
          {pans.map((p, i) => (
            <g key={p.name}>
              <rect
                x={210 + (i % 3) * 40}
                y={130 + Math.floor(i / 3) * 74}
                width="34"
                height="66"
                rx="6"
                fill={p.hex}
              />
              <rect
                x={210 + (i % 3) * 40}
                y={130 + Math.floor(i / 3) * 74}
                width="34"
                height="20"
                rx="6"
                fill="#fff"
                opacity=".2"
              />
            </g>
          ))}
          <rect x="66" y="196" width="268" height="6" fill="#000" opacity=".25" />
        </g>
      );
    }

    case "blush":
      return (
        <g>
          <circle cx="200" cy="200" r="98" fill="#241d19" />
          <circle cx="200" cy="200" r="98" fill={glass} opacity=".35" />
          <circle cx="200" cy="200" r="80" fill={shade(c, 0.5)} />
          <circle cx="200" cy="200" r="72" fill={color} />
          <circle cx="200" cy="200" r="72" fill={`url(#glow-${id})`} opacity=".5" />
          <path
            d="M158 178a52 52 0 0 1 84 0"
            stroke="#fff"
            strokeOpacity=".3"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="200" cy="200" r="30" fill="#fff" opacity=".08" />
        </g>
      );

    case "cushion":
      return (
        <g>
          <circle cx="200" cy="204" r="100" fill="#efe4d8" />
          <circle cx="200" cy="204" r="100" fill={glass} opacity=".3" />
          <circle cx="200" cy="204" r="82" fill={shade(c, 0.18)} />
          <circle cx="200" cy="204" r="76" fill={color} />
          {/* mesh */}
          {Array.from({ length: 9 }).map((_, i) => (
            <line
              key={i}
              x1={200 - 76 + i * 19}
              y1={128}
              x2={200 - 76 + i * 19}
              y2={280}
              stroke="#fff"
              strokeOpacity=".16"
              strokeWidth="2"
            />
          ))}
          {/* puff */}
          <ellipse cx="252" cy="272" rx="52" ry="34" fill="#fff" opacity=".95" />
          <ellipse cx="252" cy="266" rx="52" ry="30" fill="#faf3ec" />
          <rect x="236" y="256" width="32" height="12" rx="6" fill="#e6d8ca" />
        </g>
      );

    case "serum":
      return (
        <g>
          {/* dropper cap */}
          <rect x="176" y="70" width="48" height="42" rx="8" fill="#1b1613" />
          <rect x="186" y="76" width="8" height="30" rx="4" fill="#fff" opacity=".18" />
          <rect x="190" y="112" width="20" height="14" fill="#1b1613" opacity=".6" />
          {/* bottle */}
          <path
            d="M158 126h84c8 0 14 6 14 14v146c0 12-10 22-22 22h-68c-12 0-22-10-22-22V140c0-8 6-14 14-14z"
            fill={c}
            opacity=".55"
          />
          <path
            d="M158 126h84c8 0 14 6 14 14v146c0 12-10 22-22 22h-68c-12 0-22-10-22-22V140c0-8 6-14 14-14z"
            fill={glass}
          />
          {/* fill line */}
          <path
            d="M144 190h112v96c0 12-10 22-22 22h-68c-12 0-22-10-22-22z"
            fill={color}
            opacity=".92"
          />
          <rect x="152" y="146" width="10" height="150" rx="5" fill="#fff" opacity=".32" />
          <rect x="160" y="212" width="80" height="46" rx="6" fill="#fff" opacity=".9" />
          <text
            x="200"
            y="234"
            textAnchor="middle"
            fontSize="12"
            fontWeight="800"
            fill="#2b211c"
            letterSpacing="1.5"
            fontFamily="var(--font-display), sans-serif"
          >
            MACARON
          </text>
          <text
            x="200"
            y="250"
            textAnchor="middle"
            fontSize="9"
            fill="#7a6a60"
            letterSpacing="2"
          >
            30 ML
          </text>
        </g>
      );

    case "mascara":
      return (
        <g>
          <rect x="168" y="66" width="64" height="96" rx="12" fill="#1b1613" />
          {Array.from({ length: 6 }).map((_, i) => (
            <rect
              key={i}
              x="168"
              y={78 + i * 13}
              width="64"
              height="4"
              fill="#fff"
              opacity=".1"
            />
          ))}
          <rect x="164" y="158" width="72" height="14" rx="4" fill={shade(c, 0.3)} />
          <path
            d="M170 172h60c6 0 10 5 9 11l-12 108c-1 7-7 12-14 12h-26c-7 0-13-5-14-12l-12-108c-1-6 3-11 9-11z"
            fill={color}
          />
          <path
            d="M170 172h18l-8 131h-4c-7 0-13-5-14-12l-12-108c-1-6 3-11 9-11z"
            fill="#fff"
            opacity=".2"
          />
          <circle cx="200" cy="236" r="20" fill="#fff" opacity=".9" />
          <text
            x="200"
            y="241"
            textAnchor="middle"
            fontSize="13"
            fontWeight="800"
            fill={shade(c, 0.5)}
            fontFamily="var(--font-display), sans-serif"
          >
            M
          </text>
        </g>
      );

    case "liner":
      return (
        <g transform="rotate(18 200 200)">
          <path d="M186 60h28l-4 52h-20z" fill={color} />
          <path d="M190 108h20l-6 26h-8z" fill={shade(c, 0.35)} />
          <rect x="180" y="132" width="40" height="26" rx="6" fill={metal} />
          <rect x="178" y="156" width="44" height="150" rx="14" fill="#1b1613" />
          <rect x="186" y="164" width="8" height="134" rx="4" fill="#fff" opacity=".14" />
          <rect x="178" y="286" width="44" height="20" rx="10" fill={color} />
          <text
            x="200"
            y="232"
            textAnchor="middle"
            fontSize="11"
            fontWeight="800"
            fill="#fff"
            opacity=".8"
            letterSpacing="1"
            transform="rotate(90 200 232)"
            fontFamily="var(--font-display), sans-serif"
          >
            MACARON
          </text>
        </g>
      );

    case "balm":
      return (
        <g>
          {/* lid, ajar behind */}
          <ellipse cx="272" cy="140" rx="62" ry="20" fill={shade(c, 0.35)} opacity=".9" />
          <ellipse cx="272" cy="134" rx="62" ry="20" fill={color} />
          {/* jar */}
          <path
            d="M120 190h160v76c0 22-18 40-40 40h-80c-22 0-40-18-40-40z"
            fill="#f3e9df"
          />
          <path
            d="M120 190h160v76c0 22-18 40-40 40h-80c-22 0-40-18-40-40z"
            fill={glass}
            opacity=".5"
          />
          <ellipse cx="200" cy="190" rx="80" ry="26" fill="#e4d6c8" />
          <ellipse cx="200" cy="188" rx="66" ry="20" fill={color} />
          <ellipse cx="182" cy="182" rx="22" ry="8" fill="#fff" opacity=".35" />
          <rect x="150" y="244" width="100" height="30" rx="6" fill="#fff" opacity=".85" />
          <text
            x="200"
            y="264"
            textAnchor="middle"
            fontSize="13"
            fontWeight="800"
            fill={shade(c, 0.5)}
            letterSpacing="2"
            fontFamily="var(--font-display), sans-serif"
          >
            MACARON
          </text>
        </g>
      );

    case "set": {
      const cols = product.shades.slice(0, 4);
      return (
        <g>
          {/* pastry box */}
          <rect x="60" y="184" width="280" height="126" rx="16" fill="#f5e7da" />
          <rect x="60" y="184" width="280" height="126" rx="16" fill={glass} opacity=".35" />
          <rect x="60" y="230" width="280" height="14" fill={c} opacity=".85" />
          {/* macaron stack peeking out */}
          {cols.map((p, i) => (
            <g key={p.name} transform={`translate(${92 + i * 62} 0)`}>
              <path d="M0 152a34 20 0 0 1 68 0v3H0Z" fill={tint(p.hex, 0.25)} />
              <path d="M0 172a34 20 0 0 0 68 0v-3H0Z" fill={p.hex} />
              <rect x="-1" y="153" width="70" height="10" rx="5" fill="#fff8ef" />
            </g>
          ))}
          {/* ribbon */}
          <rect x="188" y="184" width="24" height="126" fill="#fff" opacity=".7" />
          <path
            d="M200 184c-16-14-38-10-38 4 0 10 18 14 38 0 20 14 38 10 38 0 0-14-22-18-38-4z"
            fill="#fff"
            opacity=".92"
          />
          <text
            x="200"
            y="288"
            textAnchor="middle"
            fontSize="13"
            fontWeight="800"
            fill={shade(c, 0.5)}
            letterSpacing="3"
            fontFamily="var(--font-display), sans-serif"
          >
            MACARON
          </text>
        </g>
      );
    }

    default:
      return <circle cx="200" cy="200" r="90" fill={color} />;
  }
}
