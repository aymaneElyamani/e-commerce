"use client";

import { usePathname } from "next/navigation";
import Footer from "@/common/FooterSection";
import { CallToActionSection } from "@/app/_components/CallToActionSection";

export default function FooterSwitcher() {
  const pathname = usePathname();
  // Hide footer and CTA on the chat route
  if (pathname?.startsWith("/chat")) {
    return null;
  }
  return (
    <>
      <CallToActionSection />
      <Footer />
    </>
  );
}
