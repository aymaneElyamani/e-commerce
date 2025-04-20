import { Button } from "../../components/ui/button";
import { AboutUsSection } from "./sections/AboutUsSection";
import { BenefitsSection } from "./sections/BenefitsSection";
import { BlogSection } from "./sections/BlogSection";
import { CallToActionSection } from "./sections/CallToActionSection";
import { FeaturedProductsSection } from "./sections/FeaturedProductsSection";
import { FooterSection } from "../common/FooterSection";
import { HeroSection } from "./sections/HeroSection";
import { ProductShowcaseSection } from "./sections/ProductShowcaseSection";
import { TestimonialsSection } from "./sections/TestimonialsSection";


 const Home = (): JSX.Element => {
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

      {/* Featured Products Section with Gallery View title */}
      <div className="w-full flex flex-col items-center">
        <h2 className="text-4xl text-[#285a43] font-normal tracking-[1.44px] leading-[50.4px] font-['Lato',Helvetica] [-webkit-text-stroke:1.1px_#285a43] mb-12">
          Our Gallery View
        </h2>

        <div className="relative w-full">
          <FeaturedProductsSection />

          <div className="relative">
            {/* Women image with overlay */}
            <div className="relative">
              <img
                className="w-[343px] h-[317px] object-cover"
                alt="Women"
                src="/women.svg"
              />
              <div className="absolute inset-0 bg-[#00000080]" />

              {/* Women text overlay */}
              <div className="absolute top-[76px] left-[94px] flex flex-col items-center">
                <h3 className="text-[25px] text-white font-bold font-['Inter',Helvetica]">
                  Women
                </h3>
                <p className="text-lg text-white font-normal font-['Inter',Helvetica] mt-8">
                  Lorem Ipsum is simply dummy
                </p>
              </div>
            </div>

            {/* Purchase Now button */}
            <Button className="absolute top-[447px] left-[186px] w-[174px] h-[58px] bg-transparent border-[3px] border-[#f6f6f6] rounded-none text-white font-bold text-lg font-['Inter',Helvetica]">
              Purchase Now
            </Button>

            {/* Discover More buttons */}
            {discoverButtons.map((button, index) => (
              <Button
                key={index}
                className="absolute top-[button.top] left-[button.left] w-[174px] h-[58px] bg-transparent border-[3px] border-[#f6f6f6] rounded-none text-white font-bold text-lg font-['Inter',Helvetica]"
              >
                Discover More
              </Button>
            ))}

            {/* Last Discover More button with different width */}
            <Button className="absolute top-[571px] left-[1295px] w-[181px] h-16 bg-transparent border-[3px] border-[#f6f6f6] rounded-none text-white font-bold text-lg font-['Inter',Helvetica]">
              Discover More
            </Button>
          </div>
        </div>
      </div>

      <TestimonialsSection />
      <CallToActionSection />
      <BlogSection />
      <FooterSection />
    </div>
  );
};




export default Home;