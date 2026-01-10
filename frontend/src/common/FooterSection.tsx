import React from "react";
import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-foreground text-background py-10 px-4 relative overflow-hidden mt-16">
      {/* Background decorative shapes */}
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-no-repeat bg-left bg-contain opacity-20"
           style={{ backgroundImage: "url('/path-to-your-left-leaf-image.svg')" }} />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-no-repeat bg-right bg-contain opacity-20"
           style={{ backgroundImage: "url('/path-to-your-right-leaf-image.svg')" }} />

      {/* Main content */}
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold">Feel free to contact us</h2>
      </div>

      {/* Social media icons */}
      <div className="flex justify-center gap-6 mb-8">
        <a href="#" aria-label="Instagram" className="hover:text-secondary">
          <FaInstagram size={24} />
        </a>
        <a href="#" aria-label="Facebook" className="hover:text-secondary">
          <FaFacebookF size={24} />
        </a>
        <a href="#" aria-label="Twitter" className="hover:text-secondary">
          <FaTwitter size={24} />
        </a>
      </div>

      {/* Navigation links */}
      <div className="flex flex-wrap justify-center gap-6 text-sm">
        <a href="#" className="hover:underline">Home</a>
        <a href="#" className="hover:underline">About Us</a>
        <a href="#" className="hover:underline">Blog</a>
        <a href="#" className="hover:underline">Contact Us</a>
      </div>
      <div className="text-center text-xs text-background/70 mt-4 ">
        © {new Date().getFullYear()} Sorelle. Tous droits réservés.
      </div>
    </footer>
  );
};

export default Footer;
