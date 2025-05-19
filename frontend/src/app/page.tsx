
"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProfile, logoutUser } from "@/services/auth";
import { WhatWeOffer } from "./_components/WhatWeOffer";
import { FeaturedProductsSection } from "./_components/FeaturedProductsSection";
import { TestimonialsSection } from "./_components/TestimonialsSection";
// import { FooterSection } from "@/common/FooterSection";
import useAuthStore from "@/store/useAuthStore";
import { CategoriesCloches } from "./_components/categoriesClothes";
import Hero from "./_components/Hero";
import { BenefitsSection } from "./_components/BenefitsSection";
import { HeroSection } from "./_components/HeroSection";
import { CallToActionSection } from "./_components/CallToActionSection";


const Home = () => {
  // const dispatch = useDispatch();
  const router = useRouter();
  const { user, isAuthenticated  , setProfile , logout} = useAuthStore();
  useEffect(() => {
     const token = localStorage.getItem('token');

    if (token) {
      getProfile({token : token ?? ""}).then(user => setProfile(user));
    }else{
      // router.push("/login")
    }
  }, [isAuthenticated   ]);

  return (
    <div>
      <HeroSection />
               {/* <Hero /> */}
       <CategoriesCloches />
       <WhatWeOffer />
       <BenefitsSection />
       {/* <FeaturedProductsSection /> */}

       <TestimonialsSection />

    
    </div>
  );
};

export default Home;
