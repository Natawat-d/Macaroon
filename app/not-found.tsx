import Link from "next/link";
import { MacaronGlyph } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="mx-auto grid max-w-xl place-items-center px-6 py-32 text-center">
      <MacaronGlyph className="h-16 w-16" />
      <h1 className="display mt-8 text-6xl">Out of the case</h1>
      <p className="mt-4 text-sm text-ink-soft">
        This flavour has either sold out or never existed. The rest of the
        counter is still open.
      </p>
      <Link
        href="/shop"
        className="mt-8 rounded-full bg-ink px-8 py-4 text-sm font-bold text-cream transition hover:bg-raspberry"
      >
        Back to the shop
      </Link>
    </div>
  );
}
