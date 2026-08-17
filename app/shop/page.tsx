import type { Metadata } from "next";
import ShopClient from "@/components/shop-client";
import {
  CATEGORIES,
  COLLECTIONS,
  type Category,
  type Collection,
} from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop all makeup",
  description:
    "Refillable lipsticks, talc-free palettes, cushions and skin prep. Filter by category, finish, shade family and price.",
};

type Search = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const params = await searchParams;

  const category = CATEGORIES.map((c) => c.name).find(
    (c) => c === first(params.category),
  ) as Category | undefined;

  const collection = COLLECTIONS.find(
    (c) => c === first(params.collection),
  ) as Collection | undefined;

  const sort = first(params.sort);

  return (
    <ShopClient
      key={`${category ?? ""}-${collection ?? ""}`}
      initialCategory={category}
      initialCollection={collection}
      initialSort={
        sort === "best" || sort === "new" || sort === "rating"
          ? sort
          : undefined
      }
    />
  );
}
