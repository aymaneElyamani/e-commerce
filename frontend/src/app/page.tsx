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
import { HeroSection } from "./_components/HeroSection";
import { ProductShowcaseSection } from "./_components/ProductShowcaseSection";
import { BenefitsSection } from "./_components/BenefitsSection";
import { FeaturedProductsSection } from "./_components/FeaturedProductsSection";
import { TestimonialsSection } from "./_components/TestimonialsSection";
import { CallToActionSection } from "./_components/CallToActionSection";
import { BlogSection } from "./_components/BlogSection";
import { FooterSection } from "@/common/FooterSection";
import useAuthStore from "@/store/useAuthStore";
import AddToCart from "./_components/cart_purchuse";
import { CategoriesCloches } from "./_components/categoriesClothes";
import Hero from "./_components/Hero";


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
        {/* <h1>Welcome {user?.email || 'User'}</h1>
        {isAuthenticated && <button onClick={() => {logout(); logoutUser()}}>Logout</button>} */}

        {/* <AddToCart/> */}
        <Hero />
        {/* <HeroSection /> */}
       <CategoriesCloches />
       <ProductShowcaseSection />
       {/* <BenefitsSection /> */}
       {/* <FeaturedProductsSection /> */}
       <TestimonialsSection />
       {/* <CallToActionSection /> */}
       {/* <BlogSection /> */}
       {/* <FooterSection /> */}
    
    </div>
  );
};

export default Home;
