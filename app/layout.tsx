import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import AnnouncementBar from "@/components/announcement-bar";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import CartDrawer from "@/components/cart-drawer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Macaron — Colour cosmetics, baked in small batches",
    template: "%s | Macaron",
  },
  description:
    "Refillable lipsticks, talc-free palettes and skin-first base. Shop the Macaron line, personalise your own bullet, and match your shade in 60 seconds.",
  openGraph: {
    title: "Macaron — Colour cosmetics, baked in small batches",
    description:
      "Refillable lipsticks, talc-free palettes and skin-first base. Personalise your own bullet in the Shade Studio.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body className="min-h-screen">
        <CartProvider>
          <AnnouncementBar />
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
