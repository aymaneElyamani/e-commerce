import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { JSX } from "react";

export const CallToActionSection = (): JSX.Element => {
  return (
    <section className="relative w-full h-[400px] bg-[url(/emailp.png)] bg-cover bg-center">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between max-w-[1240px] mx-auto px-6 h-full">
        <div className="max-w-full md:max-w-[570px] mt-[100px] md:mt-0 font-bold text-white text-2xl sm:text-3xl md:text-[32px] tracking-normal leading-snug md:leading-[48px] font-[Lato]">
          Enter Your Email Address For Our Mailing Promo Or Other Interesting Things
        </div>

        <div className="flex flex-col sm:flex-row mt-6 md:mt-0 w-full md:w-auto gap-4 sm:gap-6">
          <Input
            className="w-full sm:w-[475px] h-12 bg-[#d9d9d908] rounded-[5px] border border-white backdrop-blur-[2.5px] backdrop-brightness-[100%] opacity-80 font-[Raleway] font-medium text-white text-base placeholder:text-white placeholder:opacity-80 focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Enter your email"
          />
          <Button className="px-10 py-3 bg-primary rounded-[5px] backdrop-blur-[2.5px] backdrop-brightness-[100%] opacity-80 font-[Raleway] font-bold text-white text-base whitespace-nowrap hover:bg-[#1e4332]">
            Submit
          </Button>
        </div>
      </div>
    </section>
  );
};
