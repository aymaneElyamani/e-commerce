import React from "react";
import { Button } from "../../components/ui/button";
import { AboutUsSection } from "./sections/AboutUsSection";
import { BenefitsSection } from "./sections/BenefitsSection";
import { BlogSection } from "./sections/BlogSection";
import { CallToActionSection } from "./sections/CallToActionSection/CallToActionSection";
import { FeaturedProductsSection } from "./sections/FeaturedProductsSection";
import { FooterSection } from "./sections/FooterSection/FooterSection";
import { HeroSection } from "./sections/HeroSection/HeroSection";
import { ProductShowcaseSection } from "./sections/ProductShowcaseSection";
import { TestimonialsSection } from "./sections/TestimonialsSection/TestimonialsSection";

export const Design = (): JSX.Element => {
  // Data for featured products buttons
  const discoverButtons = [
    { top: "234px", left: "932px" },
    { top: "234px", left: "1297px" },
    { top: "574px", left: "932px" },
  ];

  return (
    <div className="flex flex-col w-full bg-white">
      {/* Main sections in order according to the layout */}
      <HeroSection />
      <AboutUsSection />
      <ProductShowcaseSection />
      <BenefitsSection />
      <FeaturedProductsSection />
      <TestimonialsSection />
      <CallToActionSection />
      <BlogSection />
      <FooterSection />
    </div>
  );
};
