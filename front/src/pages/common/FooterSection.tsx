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
    <footer className="relative w-full bg-[#285a43] py-16 text-white">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Heading */}
        <h2 className="text-center font-['Lato',Helvetica] font-black text-3xl md:text-4xl mb-8">
          Feel free to contact us
        </h2>

        {/* Social media icons */}
        <div className="flex justify-center gap-8 mb-10">
          {socialIcons.map((social, index) => (
            <a
              key={index}
              href="#"
              className="w-[57px] h-[57px] rounded-full border border-white flex items-center justify-center hover:bg-white hover:text-[#285a43] transition duration-300"
              aria-label={social.alt}
            >
              <social.icon className="w-6 h-6" />
            </a>
          ))}
        </div>

        {/* Navigation links */}
        <div className="flex justify-center flex-wrap gap-6 mb-10">
          {navLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="opacity-80 font-['Raleway',Helvetica] font-bold text-base hover:opacity-100 transition duration-300"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Decorative line */}
        <div className="w-full h-[1px] bg-white opacity-20 mb-8"></div>

        {/* Footer bottom text */}
        <p className="text-center text-sm opacity-70">
          © {new Date().getFullYear()} Hexashop. All rights reserved.
        </p>
      </div>
    </footer>
  );
};