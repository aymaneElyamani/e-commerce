"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProfile } from "@/services/auth";
import { WhatWeOffer } from "./_components/WhatWeOffer";
import { FeaturedProductsSection } from "./_components/FeaturedProductsSection";
import { TestimonialsSection } from "./_components/TestimonialsSection";
import useAuthStore from "@/store/useAuthStore";
import { CategoriesCloches } from "./_components/categoriesClothes";
import { BenefitsSection } from "./_components/BenefitsSection";
import { HeroSection } from "./_components/HeroSection";
import { CallToActionSection } from "./_components/CallToActionSection";

const Home = () => {
  const router = useRouter();
  const { setProfile } = useAuthStore();

  const customerUrl = process.env.NEXT_PUBLIC_CUSTOMER_URL;
 
  console.log("customerUrl", customerUrl);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getProfile({ token }).then((user) => setProfile(user));
    }
  }, []);

  return (
    <div className="relative">
      <HeroSection />
      <CategoriesCloches />
      <WhatWeOffer />
      <BenefitsSection />
      <TestimonialsSection />

      {customerUrl && (
        <button
          onClick={() => router.push(customerUrl)}
          className="fixed z-50 bottom-4 right-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-5 rounded-lg shadow-md z-50"
        >
          Create my Customer t-shirt
        </button>
      )}
    </div>
  );
};

export default Home;
