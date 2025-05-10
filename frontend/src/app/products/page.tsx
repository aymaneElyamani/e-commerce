"use client";
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import Navbar from '@/common/Navbar';
import { Button } from '@/components/ui/button';
import useCartStore from '@/store/useCartStore';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import CardProduct from '@/components/cardProduct';

const Section = ({ title, products }: { title: string, products: Product[] }) => {

  return <section className="mb-8">
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product , index) => (
        // <Link href={  `./products/${product.id}` } key={product.id}>
          <CardProduct product={product} key={index} />
        // </Link>
      
      ))}
    </div>
  </section>;
};

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // 👈 loading state

  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  // Filters state
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/products${category ? `?category=${category}` : ''}`;

  useEffect(() => {
    setLoading(true); // 👈 Start loading
    fetch(API_BASE_URL)
      .then((response) => {
        if (!response.ok) {
          toast.error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        toast.error('Failed to load products.');
      })
      .finally(() => {
        setLoading(false); // 👈 Done loading
      });
  }, []);

  const handleFilter = () => {
    setFilteredProducts(
      products.filter((product) =>
        product.price >= minPrice &&
        product.price <= maxPrice &&
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  return (
    <main className="p-6 max-w-7xl mx-auto">
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      ) : (
        <>
          <div className="mb-6 flex space-x-4">
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              placeholder="Min Price"
              className="p-2 border rounded"
            />
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              placeholder="Max Price"
              className="p-2 border rounded"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name"
              className="p-2 border rounded"
            />
            <Button onClick={handleFilter} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
              Apply Filters
            </Button>
          </div>

          <Section title="Products" products={filteredProducts} />

          <footer className="mt-12 bg-gray-100 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-2">Kid's Collection</h3>
            <p className="text-gray-600 mb-4">Explore adorable outfits for kids!</p>
            <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
              Browse Now
            </button>
          </footer>
        </>
      )}
    </main>
  );
}
