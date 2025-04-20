import { FacebookIcon, InstagramIcon, TwitterIcon } from "lucide-react";

// Navigation links data
const navLinks = [
  { name: "Home", href: "#" },
  { name: "About Us", href: "#" },
  { name: "Plants", href: "#" },
  { name: "Delivery", href: "#" },
  { name: "Blog", href: "#" },
  { name: "Contact Us", href: "#" },
];

// Social media icons data
const socialIcons = [
  { icon: InstagramIcon, alt: "Instagram" },
  { icon: FacebookIcon, alt: "Facebook" },
  { icon: TwitterIcon, alt: "Twitter" },
];

export const FooterSection = (): JSX.Element => {
  return (
    <footer className="relative w-full bg-[#285a43] py-16">
      <div className="relative w-full mx-auto">
        {/* Decorative plant images with opacity */}
        <div className="absolute w-[441px] h-[313px] top-0 left-0 overflow-hidden opacity-20">
          <img
            className="absolute w-[313px] h-[406px] top-12 left-[34px]"
            alt="Monstera"
            src="/monstera.png"
          />
        </div>

        <div className="absolute w-[395px] h-[246px] top-[67px] right-0 overflow-hidden opacity-20">
          <img
            className="absolute w-[310px] h-[348px] top-[82px] left-[55px]"
            alt="Fern"
            src="/fern.png"
          />
        </div>

        {/* Main content */}
        <div className="flex flex-col items-center justify-center relative z-10">
          {/* Heading */}
          <h2 className="font-['Lato',Helvetica] font-black text-white text-[32px] tracking-[0] leading-[44.8px] mb-10">
            Feel free to contact us
          </h2>

          {/* Social media icons */}
          <div className="flex justify-center gap-16 mb-8">
            {socialIcons.map((social, index) => (
              <div
                key={index}
                className="w-[57px] h-[57px] rounded-[28.5px] border border-solid border-white flex items-center justify-center"
              >
                <social.icon className="w-8 h-8 text-white" />
              </div>
            ))}
          </div>

          {/* Navigation links */}
          <div className="flex justify-center gap-6 mb-8">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="opacity-80 font-['Raleway',Helvetica] font-bold text-white text-base tracking-[0] leading-6 whitespace-nowrap"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>

        {/* Copyright bar */}
        <div className="absolute w-full h-[39px] bottom-0 left-0 bg-[#121212] flex items-center justify-center">
          <div className="opacity-80 font-['Raleway',Helvetica] font-bold text-white text-base tracking-[0] leading-6 whitespace-nowrap">
            Copyright © 2024 Lush. All rights reserved. Dennis Nzioki DNX
          </div>
        </div>
      </div>
    </footer>
  );
};
