import Link from "next/link";
import React from "react";

const KidsCollection = () => {
  return (
    <section className="relative py-12 bg-[url('/bg_bebe.png')] bg-cover bg-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-900/40  z-0"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
        {/* Images */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:w-1/2">
          <img
            src="/bebe1.png"
            alt="bebe1"
            className="w-48 md:w-64 object-contain"
          />
          <img
            src="/bebe2.png"
            alt="bebe2"
            className="w-48 md:w-64 object-contain"
          />
        </div>

        {/* Text */}
        <div className="md:w-1/2 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Kid's Collection
          </h2>

          <div className="prose prose-sm md:prose-lg text-white mb-8 max-w-none">
            <p>
              Layne Evans is a large charity, dedicated to printing and presenting books since the 1500s.
              Mama has worked with this paper tradition, having published many such books throughout history.
            </p>
            <p>
              With a commitment to natural legal documentation and free exemplary language,
              these works follow the requests of their actual owners.
            </p>
            <p>
              Mama, a strong family member and provider, has been the cornerstone of this collection.
              The kids' works are attached to their creation dates as part of their art,
              helping young readers understand their historical significance.
            </p>
          </div>
      <Link  href={"/products?category=kids"} className="cursor-pointer">
          <button className="bg-primary  text-white font-semibold py-3 px-8 rounded-lg transition duration-300">
            Discover More
          </button>
      </Link>
      
        </div>
      </div>
    </section>
  );
};

export default KidsCollection;
