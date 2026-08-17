import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/product-detail";
import ProductCard from "@/components/product-card";
import { PRODUCTS, getProduct, relatedProducts } from "@/lib/products";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product not found" };

  return {
    title: `${product.name} — ${product.subtitle}`,
    description: product.description.slice(0, 155),
    openGraph: {
      title: `${product.name} | Macaron`,
      description: product.description.slice(0, 155),
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = relatedProducts(product);

  return (
    <>
      <ProductDetail product={product} />

      {/* Ratings breakdown */}
      <section className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="grid gap-10 rounded-[2rem] bg-shell p-8 sm:p-12 lg:grid-cols-[280px_1fr]">
          <div>
            <p className="display text-6xl">{product.rating}</p>
            <div className="mt-2 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  viewBox="0 0 24 24"
                  className={`size-5 ${i < Math.round(product.rating) ? "fill-lemon" : "fill-line"}`}
                >
                  <path d="m12 2 3 6.5 7 .9-5 4.9 1.2 7L12 18l-6.2 3.3L7 14.3l-5-4.9 7-.9z" />
                </svg>
              ))}
            </div>
            <p className="mt-2 text-sm text-ink-soft">
              {product.reviews.toLocaleString()} verified reviews
            </p>
            <button className="mt-5 rounded-full border border-ink px-6 py-3 text-xs font-bold transition hover:bg-ink hover:text-cream">
              Write a review
            </button>
          </div>
          <div className="space-y-3">
            {[
              { label: "Wear time", value: 94 },
              { label: "True to shade", value: 91 },
              { label: "Comfort", value: 88 },
              { label: "Packaging", value: 96 },
            ].map((bar) => (
              <div key={bar.label}>
                <div className="flex justify-between text-xs font-medium">
                  <span>{bar.label}</span>
                  <span className="text-ink-soft">{bar.value}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full bg-raspberry"
                    style={{ width: `${bar.value}%` }}
                  />
                </div>
              </div>
            ))}
            <p className="pt-3 text-sm leading-relaxed text-ink-soft">
              Reviews are collected from verified purchases only. We don&rsquo;t
              gate, filter or reorder them — the {product.rating} is the whole
              picture.
            </p>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="display text-4xl sm:text-5xl">Complete the look</h2>
          <Link
            href={`/shop?category=${product.category}`}
            className="shrink-0 text-sm font-bold underline underline-offset-4 hover:text-raspberry"
          >
            More {product.category.toLowerCase()} →
          </Link>
        </div>
        <div className="mt-9 grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
