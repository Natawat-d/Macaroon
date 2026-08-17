import Link from "next/link";
import { Wordmark } from "./logo";

const GROUPS = [
  {
    title: "Shop",
    links: [
      { label: "All products", href: "/shop" },
      { label: "Lips", href: "/shop?category=Lips" },
      { label: "Eyes", href: "/shop?category=Eyes" },
      { label: "Face", href: "/shop?category=Face" },
      { label: "Skin", href: "/shop?category=Skin" },
      { label: "Gift sets", href: "/shop?category=Sets" },
    ],
  },
  {
    title: "Collections",
    links: [
      { label: "Patisserie", href: "/shop?collection=Patisserie" },
      { label: "Co-Lab", href: "/shop?collection=Co-Lab" },
      { label: "Limited Drop", href: "/shop?collection=Limited+Drop" },
      { label: "Everyday", href: "/shop?collection=Everyday" },
      { label: "Shade Studio", href: "/studio" },
      { label: "Best sellers", href: "/shop?sort=best" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Shade match guarantee", href: "/shop" },
      { label: "Shipping & delivery", href: "/shop" },
      { label: "Returns & exchanges", href: "/shop" },
      { label: "Track your order", href: "/shop" },
      { label: "Refill programme", href: "/shop" },
      { label: "Contact us", href: "/shop" },
    ],
  },
  {
    title: "House of Macaron",
    links: [
      { label: "Our story", href: "/" },
      { label: "Ingredients index", href: "/" },
      { label: "Sustainability", href: "/" },
      { label: "Careers", href: "/" },
      { label: "Press", href: "/" },
      { label: "Affiliates", href: "/" },
    ],
  },
];

const SOCIALS = ["Instagram", "TikTok", "YouTube", "Pinterest"];

export default function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink text-cream">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="mx-auto grid max-w-[1400px] gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="display text-4xl sm:text-5xl">
              Get the drop
              <br />
              before it sells out.
            </h2>
            <p className="mt-3 max-w-md text-sm text-cream/70">
              Early access to limited flavours, restock alerts and 10% off your
              first box. No more than one email a week — we promise.
            </p>
          </div>
          {/* No action: submits to the current URL, which keeps it correct
              under the /macaroon basePath without a client component. */}
          <form className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              name="email"
              required
              placeholder="your@email.com"
              aria-label="Email address"
              className="w-full rounded-full border border-white/20 bg-white/5 px-6 py-4 text-sm text-cream outline-none transition placeholder:text-cream/40 focus:border-raspberry"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-raspberry px-8 py-4 text-sm font-bold text-white transition hover:bg-cream hover:text-ink"
            >
              Sign me up
            </button>
          </form>
        </div>
      </div>

      {/* Link groups */}
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_repeat(4,1fr)]">
        <div>
          <div className="flex items-center gap-2">
            <Wordmark className="text-3xl" />
          </div>
          <p className="mt-4 max-w-xs text-sm text-cream/60">
            Colour cosmetics baked in small batches. Refillable cases, talc-free
            formulas, never tested on animals.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s}
                href="#"
                className="rounded-full border border-white/20 px-3.5 py-1.5 text-[11px] font-semibold transition hover:border-raspberry hover:text-raspberry"
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        {GROUPS.map((g) => (
          <div key={g.title}>
            <h3 className="eyebrow text-[10px] text-cream/50">{g.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {g.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-cream/75 transition hover:text-raspberry"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-6 text-[11px] text-cream/50 sm:flex-row sm:items-center sm:px-6">
          <p>© {new Date().getFullYear()} Macaron Beauty Co. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 sm:ml-auto">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Cookie settings</span>
            <span>Accessibility</span>
            <span className="rounded border border-white/20 px-2 py-0.5">
              🌏 Thailand / THB
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
