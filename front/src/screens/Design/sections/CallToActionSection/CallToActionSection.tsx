import React from "react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";

export const CallToActionSection = (): JSX.Element => {
  return (
    <section className="relative w-full h-[400px] bg-[url(/emailp.png)] bg-cover bg-center">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between max-w-[1240px] mx-auto px-6 h-full">
        <div className="max-w-[570px] mt-[127px] md:mt-0 [font-family:'Lato',Helvetica] font-bold text-white text-[32px] tracking-[0] leading-[48px]">
          Enter Your Email Address For Our Mailing Promo Or Other Interesting
          Things
        </div>

        <div className="flex mt-6 md:mt-0">
          <Input
            className="w-[475px] h-12 bg-[#d9d9d908] rounded-[5px] border border-solid border-white backdrop-blur-[2.5px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(2.5px)_brightness(100%)] opacity-80 [font-family:'Raleway',Helvetica] font-medium text-white text-base tracking-[0] leading-6 placeholder:text-white placeholder:opacity-80 focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Enter your email"
          />
          <Button className="ml-6 px-[45px] py-3 bg-[#285a43] rounded-[5px] backdrop-blur-[2.5px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(2.5px)_brightness(100%)] opacity-80 [font-family:'Raleway',Helvetica] font-bold text-white text-base tracking-[0] leading-6 whitespace-nowrap hover:bg-[#1e4332]">
            Submit
          </Button>
        </div>
      </div>
    </section>
  );
};
