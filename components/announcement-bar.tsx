import { MacaronMark } from "./product-art";

const MESSAGES = [
  "Free shipping on orders over $75",
  "Buy 2 lip products, get the 3rd 50% off",
  "New drop: Patisserie No. 1 palette",
  "Personalise any case with your name",
  "30-day shade match guarantee",
  "1,000,000+ shades matched",
];

export default function AnnouncementBar() {
  // Duplicated track + a -50% keyframe gives a seamless loop.
  const track = [...MESSAGES, ...MESSAGES];

  return (
    <div className="overflow-hidden bg-ink py-2.5 text-cream">
      <div className="flex w-max animate-marquee">
        {track.map((m, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center gap-3 px-6 text-[11px] font-semibold tracking-[0.16em] uppercase"
          >
            <MacaronMark className="h-3.5 w-auto" />
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}
