// import { Button } from "../../components/ui/button";
// import { AboutUsSection } from "./sections/AboutUsSection";
// import { BenefitsSection } from "./sections/BenefitsSection";
// import { BlogSection } from "./sections/BlogSection";
// import { CallToActionSection } from "./sections/CallToActionSection";
// import { FeaturedProductsSection } from "./sections/FeaturedProductsSection";
// import { FooterSection } from "../common/FooterSection";
// import { HeroSection } from "./sections/HeroSection";
// import { ProductShowcaseSection } from "./sections/ProductShowcaseSection";
// import { TestimonialsSection } from "./sections/TestimonialsSection";



//  const Home = (): JSX.Element => {
//   // Data for featured products buttons
//   const discoverButtons = [
//     { top: "234px", left: "932px" },
//     { top: "234px", left: "1297px" },
//     { top: "574px", left: "932px" },
//   ];

//   return (
//     <div className="flex flex-col w-full bg-white">
//       {/* Main sections in order according to the layout */}
//       <HeroSection />
//       <AboutUsSection />
//       <ProductShowcaseSection />
//       <BenefitsSection />
//       <FeaturedProductsSection />
//       <TestimonialsSection />
//       <CallToActionSection />
//       <BlogSection />
//       <FooterSection />
//     </div>
//   );
// };




// export default Home;

"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProfile, logoutUser } from "@/services/auth";
import { ProductShowcaseSection } from "./_components/ProductShowcaseSection";
import { FeaturedProductsSection } from "./_components/FeaturedProductsSection";
import { TestimonialsSection } from "./_components/TestimonialsSection";
// import { FooterSection } from "@/common/FooterSection";
import useAuthStore from "@/store/useAuthStore";
import { CategoriesCloches } from "./_components/categoriesClothes";
import Hero from "./_components/Hero";
import { BenefitsSection } from "./_components/BenefitsSection";


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
               <Hero />
       <CategoriesCloches />
       <ProductShowcaseSection />
       <BenefitsSection />
       {/* <FeaturedProductsSection /> */}
       <TestimonialsSection />
    
    </div>
  );
};

export default Home;
