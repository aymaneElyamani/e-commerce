"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, ShoppingCart, LogOut, UserPlus, LogIn } from "lucide-react";
import Link from "next/link";
import useAuthStore from "@/store/useAuthStore";
import AddToCart from "@/app/_components/cart_purchuse";
import { logoutUser } from "@/services/auth";
import { FaHeart } from "react-icons/fa";
import { useRouter } from "next/navigation";

const navItems = [
  { text: "Home", href: "/" },
  // { text: "Shop", href: "/products" },
  { text: "Blogs", href: "/blogs" },
  { text: "Contact", href: "/contact" },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  
  const route = useRouter()
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  
    const handleMouseEnter = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }
    setProfileMenuVisible(true);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setProfileMenuVisible(false);
    }, 300); // Delay in ms (adjust as needed)
  };
  return (
    <header className="bg-white text-white fixed top-0 left-0 w-full z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link href= "/" className="text-xl font-bold text-primary cursor-pointer">eComm</Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.text}
              href={item.href}
              className="text-base hover:underline text-black"
            >
              {item.text}
            </Link>
          ))}

          {isAuthenticated && <AddToCart />}

          {isAuthenticated ? (
            <div
              className="relative group ml-4"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src="/avatar.png"
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-white cursor-pointer"
              />
              <div
                className={`absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg transition-opacity duration-300 ease-in-out ${
                  profileMenuVisible ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
              >
                <div className="px-4 py-2 border-b text-sm font-medium">
                  {user?.email}
                </div>
                <Link
                  href="/profile"
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
                >
                  <User size={16} />
                  Profile
                </Link>
                <Link
                  href="/orders"
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
                >
                  <ShoppingCart size={16} />
                  My Orders
                </Link>
                 <Link
                  href="/wishlist"
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
                >
                  <FaHeart size={16} />
                  My wishList
                </Link>
                <Link
                  href="/email"
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
                >
                  <User size={16} />
                  Email
                </Link>
                <button
                  onClick={async () => {
                    logoutUser();
                    window. localStorage.clear();
                    logout();
                    route.push("/");
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <>
           
  <Link href="/signup">
    <Button
      variant="outline"
      className="border-white text-primary bg-transparent hover:bg-white/20 focus:outline-none transition duration-300 ease-in-out w-full rounded-lg py-3 flex items-center justify-center gap-2"
    >
      <UserPlus className="text-primary" />
      <span>Sign Up</span>
    </Button>
  </Link>
  <Link href="/login">
    <Button
      variant="outline"
      className="border-white text-primary bg-transparent hover:bg-white/20 focus:outline-none transition duration-300 ease-in-out w-full rounded-lg py-3 flex items-center justify-center gap-2"
    >
      <LogIn className="text-primary" />
      <span>Log In</span>
    </Button>
  </Link>
            </>
          )}
        </nav>

        {/* Mobile Nav Toggle */}
        <div className="md:hidden flex items-center gap-2">
          {isAuthenticated && <AddToCart />}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSheetOpen(true)}
              >
                <Menu className="text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-green-800 text-white">
              <div className="flex flex-col gap-4 mt-10">
                {navItems.map((item) => (
                  <Link key={item.text} href={item.href} className="text-lg">
                    {item.text}
                  </Link>
                ))}

                {isAuthenticated ? (
                  <div className="mt-4">
                    <div className="mb-2">{user?.email}</div>
                    <Link href="/profile">
                      <Button
                        variant="outline"
                        className="border-white text-black w-full"
                      >
                        Profile
                      </Button>
                    </Link>
                    <Link href="/my-orders">
                      <Button
                        variant="outline"
                        className="border-white text-black w-full"
                      >
                        My Orders
                      </Button>
                    </Link>
                    <Link href="/email">
                      <Button
                        variant="outline"
                        className="border-white text-black w-full"
                      >
                        Email
                      </Button>
                    </Link>
                    <button
                      onClick={async () => {
                        logoutUser();
                        logout();
                        setIsSheetOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-white/20 text-sm"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                 
<div className="flex flex-col gap-4 mt-6">
  <Link href="/signup">
    <Button
      variant="outline"
      className="border-white text-white bg-transparent hover:bg-white/20 focus:outline-none transition duration-300 ease-in-out w-full rounded-lg py-3 flex items-center justify-center gap-2"
    >
      <UserPlus className="text-white" />
      <span>Sign Up</span>
    </Button>
  </Link>
  <Link href="/login">
    <Button
      variant="outline"
      className="border-white text-white bg-transparent hover:bg-white/20 focus:outline-none transition duration-300 ease-in-out w-full rounded-lg py-3 flex items-center justify-center gap-2"
    >
      <LogIn className="text-white" />
      <span>Log In</span>
    </Button>
  </Link>
</div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
