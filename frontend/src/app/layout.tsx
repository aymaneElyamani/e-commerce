import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
// import { Providers } from "./providers";
import { Toaster } from "sonner";
import Navbar from "@/common/Navbar";
import FooterSwitcher from "@/common/FooterSwitcher";
import Link from "next/link";

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sorelle | Premium E-Commerce for Unique Products",
  description:
    "Sorelle is your go-to destination for high-quality, stylish, and innovative products. Discover unique items tailored to your lifestyle — shop now with confidence.",
  keywords: [
    "Sorelle",
    "e-commerce",
    "online store",
    "fashion",
    "electronics",
    "home decor",
    "shopping",
    "next js ecommerce",
    "buy online",
    "premium products",
  ],
  openGraph: {
    title: "Sorelle | Premium E-Commerce for Unique Products",
    description:
      "Shop top-tier, curated collections from Sorelle — your trusted e-commerce brand for premium lifestyle products.",
    url: "https://www.Sorelle.com", // change to your actual domain
    siteName: "Sorelle",
    images: [
      {
        url: "https://www.Sorelle.com/og-image.jpg", // replace with your actual OG image
        width: 1200,
        height: 630,
        alt: "Sorelle Online Store",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sorelle | Premium E-Commerce for Unique Products",
    description:
      "Discover the best in style, tech, and more at Sorelle — your premium online shopping destination.",
    images: ["https://www.Sorelle.com/og-image.jpg"], // same image as OG
  },
  metadataBase: new URL("https://www.Sorelle.com"), // use your actual production URL
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased pt-20`}
      >
        {/* <Providers> */}
        <Toaster />
      <Navbar />

        {children}
        {/* Floating Chat Button (bottom-left) */}
        <Link
          href="/chat"
          aria-label="Open chat assistant"
          className="fixed left-4 bottom-4 z-50 rounded-full bg-primary text-primary-foreground shadow-lg px-4 py-3 hover:bg-primary/90 transition-colors"
        >
          💬 Chat
        </Link>
        {/* </Providers> */}
        <FooterSwitcher/>

      </body>
    </html>
  );
}
