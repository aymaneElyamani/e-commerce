"use client";

import CardProduct from "@/components/cardProduct";
import { JSX, useEffect, useState } from "react";
import { toast } from "sonner";

export const ProductShowcaseSection = (): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);

  const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/products?elements=8`;

  useEffect(() => {
    setLoading(true);
    fetch(API_BASE_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        toast.error("Failed to load products.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section className="w-full px-4 sm:px-6 lg:px-0 max-w-[1200px] mx-auto py-12 md:py-16">
      <h2 className="text-center text-xl sm:text-2xl text-[#285a43] font-normal tracking-wide leading-snug mb-10 font-['Lato',Helvetica] [-webkit-text-stroke:1.1px_#285a43]">
        What We Offer To You
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="w-full h-[320px] rounded-lg bg-gray-200 animate-pulse"
              />
            ))
          : products.length > 0
          ? products.map((product, index) => (
              <CardProduct product={product} key={index} />
            ))
          : (
              <p className="col-span-full text-center text-gray-500">No products found.</p>
            )}
      </div>
    </section>
  );
};
