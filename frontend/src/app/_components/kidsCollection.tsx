import Link from "next/link";
import React from "react";

const KidsCollection = () => {
  return (
    <section className="relative py-12 bg-[url(/4.jpg)] bg-cover bg-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-foreground/40 z-0"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
        {/* Images */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:w-1/2">
          <img
            src="/2.jpg"
            alt="bebe1"
            className="w-48 md:w-64 object-contain"
          />
          <img
            src="/7.jpg"
            alt="bebe2"
            className="w-48 md:w-64 object-contain"
          />
        </div>

        {/* Text */}
        <div className="md:w-1/2 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-background mb-6">
            Accessories Collection
          </h2>

          <div className="prose prose-sm md:prose-lg text-background mb-8 max-w-none">
            <p>
              Complete your look with our curated accessories selection, designed to elevate every outfit.
            </p>
            <p>
              From everyday essentials to statement pieces, find the perfect details that match your style.
            </p>
            <p>
              Explore the latest arrivals and timeless favorites, all in one place.
            </p>
          </div>

          <Link href="/products?category=accessories" className="cursor-pointer">
            <button className="bg-primary text-primary-foreground font-semibold py-3 px-8 rounded-lg transition duration-300">
              Discover More
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default KidsCollection;
