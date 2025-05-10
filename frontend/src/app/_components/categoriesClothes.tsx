

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { JSX } from "react";

export const CategoriesCloches = (): JSX.Element => {
  const categories = [
    {
      id: 1,
      name: "Femmes",
      backgroundImage: "/img/categories/image1.png",
      textColor: "#285a43",
      href : "/products?category=women"
    },
    {
      id: 2,
      name: "Enfants",
      backgroundImage: "/img/categories/image2.png",
      textColor: "#ffffff",
      href : "/products?category=kids"

    },
    {
      id: 3,
      name: "Hommes",
      backgroundImage: "/img/categories/image3.png",
      textColor: "#285a43",
      href : "/products?category=man"

    },
  ];

  return (
    <section className="w-full py-12 px-6 bg-[#f9f9f9]">
      <div className="max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between mb-8 mt-10">
          <h2 className="text-[#285a43] text-3xl md:text-4xl font-normal tracking-wide leading-tight md:max-w-md">
            We Help Choose The Most Suitable Plants For You
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {categories.map((category) => (
            <Link href={category.href} 
            
              key={category.id}
            >
            <Card
              className="group w-full h-[350px] md:h-[400px] border-none rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <CardContent className="p-0 h-full relative">
                {/* Image with zoom effect */}
                <div
                  className="w-full h-full bg-center bg-cover transition-transform duration-500 group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${category.backgroundImage})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                ></div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-500"></div>

                {/* Text */}
                <div
                  className="absolute inset-0 flex items-center justify-center font-black text-[36px] md:text-[48px] text-center transition-transform duration-500 group-hover:scale-105"
                  style={{
                    color: category.textColor,
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  {category.name}
                </div>
              </CardContent>
            </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
