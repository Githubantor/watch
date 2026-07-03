import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { MemberProvider } from "@/context/MemberContext";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Horologe — Timeless Luxury Watches",
  description:
    "Discover our exquisite collection of luxury timepieces. Crafted since 1924, each watch embodies unparalleled craftsmanship and timeless elegance.",
  keywords: ["luxury watches", "timeless", "horology", "swiss watches", "craftsmanship"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable}`}
    >
      <body className="min-h-screen antialiased">
        <MemberProvider>
          <CartProvider>{children}</CartProvider>
        </MemberProvider>
      </body>
    </html>
  );
}
