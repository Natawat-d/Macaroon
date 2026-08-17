import type { Metadata } from "next";
import Studio from "@/components/studio";

export const metadata: Metadata = {
  title: "Shade Studio — personalise your own",
  description:
    "Pick a base, a flavour and a finish, then press up to twelve characters into the case. Made to order, shipped in five days.",
};

export default function StudioPage() {
  return <Studio />;
}
