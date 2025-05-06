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
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { logout, setProfile } from "@/store/slices/authSlice";
import { RootState } from "@/store/store";
import { getProfile } from "@/services/auth";


const Home = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { email, isAuthenticated } = useSelector((state: RootState) => state.auth);
  useEffect(() => {
     const token = localStorage.getItem('token');

    if (token) {
      getProfile({token : token ?? ""}).then(user => dispatch(setProfile(user)));
    }else{
      router.push("/login")
    }
  }, [isAuthenticated   ]);

  return (
    <div>
      <h1>Welcome {email || 'User'}</h1>
      {isAuthenticated && <button onClick={() => dispatch(logout())}>Logout</button>}
    </div>
  );
};

export default Home;
