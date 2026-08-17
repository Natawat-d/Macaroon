/**
 * Brand marks. The macaron replaces the "o" in the wordmark, so the glyph is
 * sized in `em` and nudged onto the baseline rather than given a fixed size —
 * that way one component works at 14px in the nav and 56px in a hero.
 */

// Fixed ids rather than a render-time counter: every glyph is identical, so
// repeated instances resolving to the same gradients is correct — and a
// counter would drift between the server and client renders.
const id = "macaron-glyph";

export function MacaronGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-top`} x1="0.15" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#fbc3d5" />
          <stop offset="45%" stopColor="#f094b3" />
          <stop offset="100%" stopColor="#e26d94" />
        </linearGradient>
        <linearGradient id={`${id}-bottom`} x1="0.2" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="#ea7fa2" />
          <stop offset="60%" stopColor="#dd5f87" />
          <stop offset="100%" stopColor="#c9426e" />
        </linearGradient>
        <linearGradient id={`${id}-cream`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#fdf1f4" />
          <stop offset="100%" stopColor="#f6dde4" />
        </linearGradient>
        <radialGradient id={`${id}-gloss`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* contact shadow stays level while the biscuit itself is tilted */}
      <ellipse cx="62" cy="103" rx="37" ry="6.5" fill="#c9426e" opacity="0.22" />

      <g transform="rotate(-21 60 60)">
        {/* lower shell */}
        <path d="M14 62 A46 30 0 0 0 106 62 Z" fill={`url(#${id}-bottom)`} />
        {/* ganache */}
        <rect x="11" y="46" width="98" height="16" rx="8" fill={`url(#${id}-cream)`} />
        {/* upper shell */}
        <path d="M14 50 A46 33 0 0 1 106 50 Z" fill={`url(#${id}-top)`} />
        {/* ruffled foot, just a soft lip under the ganache */}
        <path
          d="M16 63 A46 30 0 0 0 104 63"
          fill="none"
          stroke="#fff"
          strokeOpacity="0.28"
          strokeWidth="2"
        />
        {/* gloss */}
        <ellipse
          cx="47"
          cy="31"
          rx="20"
          ry="10"
          fill={`url(#${id}-gloss)`}
          transform="rotate(-16 47 31)"
        />
      </g>
    </svg>
  );
}

export function Wordmark({
  className = "",
  title = "Macaron",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <span
      className={`logo-type inline-flex items-baseline leading-none whitespace-nowrap ${className}`}
      aria-label={title}
      role="img"
    >
      <span aria-hidden="true">macar</span>
      <MacaronGlyph className="mx-[0.02em] h-[0.98em] w-[0.98em] shrink-0 translate-y-[0.14em]" />
      <span aria-hidden="true">n</span>
    </span>
  );
}
