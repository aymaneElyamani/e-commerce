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
    <footer className="relative w-full bg-[#285a43] py-4 text-white">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Heading */}
        <h2 className="text-center font-['Lato',Helvetica] font-black text-2xl md:text-2xl mb-6">
          Feel free to contact us
        </h2>

        {/* Social media icons */}
        <div className="flex justify-center gap-6 mb-6">
          {socialIcons.map((social, index) => (
            <a
              key={index}
              href="#"
              className="w-[45px] h-[45px] rounded-full border border-white flex items-center justify-center hover:bg-white hover:text-[#285a43] transition duration-300"
              aria-label={social.alt}
            >
              <social.icon className="w-6 h-6" />
            </a>
          ))}
        </div>

        {/* Navigation links */}
        <div className="flex justify-center flex-wrap gap-6 mb-4">
          {navLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="opacity-80 font-['Raleway',Helvetica] text-xs hover:opacity-100 transition duration-300"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Decorative line */}
        <div className="w-full h-[1px] bg-white opacity-20 mb-6"></div>

        {/* Footer bottom text */}
        <p className="text-center text-xs opacity-70">
          © {new Date().getFullYear()} Hexashop. All rights reserved.
        </p>
      </div>
    </footer>
  );
};