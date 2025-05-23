import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import { Providers } from "./providers";
import { Toaster } from "sonner";
import Navbar from "@/common/Navbar";
import Footer from "@/common/FooterSection";
import { CallToActionSection } from "./_components/CallToActionSection";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gojira | Premium E-Commerce for Unique Products",
  description:
    "Gojira is your go-to destination for high-quality, stylish, and innovative products. Discover unique items tailored to your lifestyle — shop now with confidence.",
  keywords: [
    "Gojira",
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
    title: "Gojira | Premium E-Commerce for Unique Products",
    description:
      "Shop top-tier, curated collections from Gojira — your trusted e-commerce brand for premium lifestyle products.",
    url: "https://www.gojira.com", // change to your actual domain
    siteName: "Gojira",
    images: [
      {
        url: "https://www.gojira.com/og-image.jpg", // replace with your actual OG image
        width: 1200,
        height: 630,
        alt: "Gojira Online Store",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gojira | Premium E-Commerce for Unique Products",
    description:
      "Discover the best in style, tech, and more at Gojira — your premium online shopping destination.",
    images: ["https://www.gojira.com/og-image.jpg"], // same image as OG
  },
  metadataBase: new URL("https://www.gojira.com"), // use your actual production URL
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
        {/* </Providers> */}
    <CallToActionSection/>

        <Footer/>

      </body>
    </html>
  );
}
