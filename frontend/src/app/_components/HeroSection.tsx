import Navbar from "@/common/Navbar";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";
import { JSX } from "react";

export const HeroSection = (): JSX.Element => {
  // Navigation items data
  const navItems = [
    { text: "Home", isActive: true },
    { text: "About Us", isActive: false },
    { text: "Planters", isActive: false },
    { text: "Contact", isActive: false },
  ];

  // Pagination data
  const paginationItems = [
    { number: "01", isActive: true },
    { number: "02", isActive: false },
    { number: "03", isActive: false },
  ];

  return (
    <section className="relative w-full h-[700px] overflow-hidden">
      <div className="relative w-full h-full bg-[url(/home-plants-succulents-and-cacti-transplant-plan-2022-10-06-21-3.png)] bg-cover bg-center">
        <img
          className="w-full h-full object-cover absolute top-0 left-0"
          alt="Hero background"
          src="/image.png"
        />

        {/* Navigation */}
      <div>
        {/* <Navbar  /> */}
      </div>

        {/* Hero content */}
        <div className="absolute top-[190px] left-0 w-full flex flex-col items-center">
          <h1 className="font-['Lato',Helvetica] font-bold text-white text-[64px] max-w-[1000px] text-center">
            Nature's Beauty Delivered to You
          </h1>

          <p className="w-[787px] mt-[50px] font-['Poppins',Helvetica] font-medium text-[#f8f8f8] text-lg text-center leading-[25.2px]">
            Nature&#39;s beauty is just a click away with our online flower and
            plant shop. We offer a wide variety of flowers that will bring a
            touch of nature to your home!
          </p>

          <div className="flex gap-[35px] mt-[38px]">
            <Button className="px-[50px] py-3 bg-primary rounded-[3px] font-['Lato',Helvetica] font-bold text-white text-sm tracking-[0.28px] leading-[16.8px]">
              Book Now
            </Button>

            <Button
              variant="outline"
              className="px-[35px] py-2 rounded-[3px] border border-solid border-white bg-transparent flex items-center gap-2.5 font-['Lato',Helvetica] font-semibold text-white text-sm tracking-[0.28px] leading-[16.8px]"
            >
              <PlayIcon className="w-6 h-6" />
              Watch Video
            </Button>
          </div>
        </div>

        {/* Pagination */}
        <div className="absolute top-[333px] right-[137px] flex flex-col gap-[35px]">
          {paginationItems.map((item, index) => (
            <div
              key={index}
              className={`font-['Lato',Helvetica] text-base ${
                item.isActive
                  ? "font-black text-primary underline"
                  : "opacity-70 font-medium text-white"
              }`}
            >
              {item.number}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
