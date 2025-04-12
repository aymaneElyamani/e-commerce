import React from 'react'
import { Button } from "../../../../components/ui/button";

const navItems = [
  { text: "Home", isActive: true },
  { text: "About", isActive: false },
  { text: "Services", isActive: false },
  { text: "Contact", isActive: false },
];

function Navbar() {
  return (
    <div className="absolute top-0 left-0 w-full flex justify-between items-center px-[100px] py-[50px]">
    {/* Logo */}
    {/* <img
      className="w-[105px] h-16"
      alt="Mask group"
      src="/mask-group.png"
    /> */}
    <div className="flex items-center gap-[10px]">
    <p>LUSH</p>
    </div>
    {/* Nav items */}
    <div className="flex items-center gap-[50px]">
      {navItems.map((item, index) => (
        <a
          key={index}
          href={`#${item.text.toLowerCase().replace(/\s+/g, "-")}`} // Generate href dynamically
          className={`font-['Lato',Helvetica] text-lg text-white ${
            item.isActive ? "font-bold underline" : "font-medium"
          }`}
        >
          {item.text}
        </a>
      ))}

      {/* Call Us button */}
      <Button
        variant="outline"
        className="ml-[50px] px-[50px] py-[11px] rounded-[3px] border border-solid border-white bg-transparent text-white font-['Lato',Helvetica] font-bold text-base"
      >
        Call Us
      </Button>
    </div>
  </div>

  )
}

export default Navbar