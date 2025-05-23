"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import CardProduct from "@/components/cardProduct";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton from Shadcn
import KidsCollection from "../_components/kidsCollection";

const Section = ({
  title,
  products,
}: {
  title: string;
  products: Product[];
}) => (
  <motion.section
    className="mb-8"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <CardProduct key={index} product={product} />
      ))}
    </div>
  </motion.section>
);

function formatPath(path: string): string {
  return path
    .split("/")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" / ") || "Home";
}

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const category = searchParams.get("category");

  const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/products${
    category ? `?category=${category}` : ""
  }`;

  useEffect(() => {
    setLoading(true);
    fetch(API_BASE_URL)
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data: Product[]) => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch(() => toast.error("Failed to load products."))
      .finally(() => setLoading(false));
  }, [API_BASE_URL]);

  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.price >= minPrice &&
        product.price <= maxPrice &&
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [minPrice, maxPrice, searchQuery, products]);

  return (
    <main className="p-4 sm:p-6 max-w-7xl mx-auto">
      <motion.h1
        className="text-lg text-muted-foreground mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Link href={"/"}>Home</Link>/{" "}
        <span className="text-black font-medium">{formatPath(pathname)}</span>
      </motion.h1>

      {loading ? (
        <div className="text-center py-20">
          {/* Skeleton for the heading */}
          <Skeleton className="mx-auto mb-4 w-40 h-6" />
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Skeleton for products */}
            {[...Array(8)].map((_, index) => (
              <Skeleton key={index} className="rounded-md h-80 w-full" />
            ))}
          </div>
        </div>
      ) : (
        <>
          <motion.div
            className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div>
              <label htmlFor="minPrice" className="block text-sm font-medium mb-1">
                Min Price
              </label>
              <input
                id="minPrice"
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="p-2 border rounded w-full"
              />
            </div>

            <div>
              <label htmlFor="maxPrice" className="block text-sm font-medium mb-1">
                Max Price
              </label>
              <input
                id="maxPrice"
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="p-2 border rounded w-full"
              />
            </div>

            <div className="col-span-2 md:col-span-1">
              <label htmlFor="search" className="block text-sm font-medium mb-1">
                Search by Name
              </label>
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-2 border rounded w-full"
              />
            </div>
          </motion.div>

          <Section title="Products" products={filteredProducts} />
        {
          category != "kids" && 
          <div>
            <br /><br />
      <KidsCollection />


      <br />
          </div>

        }
        
        
        </>
      )}
    </main>
  );
}
