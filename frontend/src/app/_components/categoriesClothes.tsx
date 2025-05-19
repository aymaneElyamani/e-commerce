"use client";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { JSX } from "react";
import { motion } from "framer-motion";

export const CategoriesCloches = (): JSX.Element => {
  const categories = [
    {
      id: 1,
      name: "WOMEN",
      backgroundImage: "/img/categories/image1.png",
      textColor: "primary",
      href: "/products?category=women",
    },
    {
      id: 2,
      name: "KIDS",
      backgroundImage: "/img/categories/image2.png",
      textColor: "white",
      href: "/products?category=kids",
    },
    {
      id: 3,
      name: "MEN",
      backgroundImage: "/img/categories/image3.png",
      textColor: "primary",
      href: "/products?category=man",
    },
  ];

  return (
    <section className="w-full py-14 px-6 bg-[#f9f9f9]" id = "categories">
      <div className="max-w-screen-xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between mb-12"
        >
          <h2 className="text-primary text-3xl md:text-4xl font-semibold leading-tight md:max-w-md font-['Lato']">
            We Help Choose The Most Suitable Clothes For You
          </h2>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <Link href={category.href}>
                <Card className="group w-full h-[320px] sm:h-[400px] border-none rounded-3xl overflow-hidden  duration-300">
                  <CardContent className="p-0 h-full w-full relative">
                    {/* Full-cover image */}
                    <div className="absolute inset-0 z-0">
                      <div
                        className="w-full h-full bg-center bg-cover transition-transform duration-700 group-hover:scale-105"
                        style={{
                          backgroundImage: `url(${category.backgroundImage})`,
                        }}
                      ></div>
                    </div>

                    {/* Gradient Overlay */}
                    {/* <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div> */}

                    {/* Category Name */}
                    <div
                      className={`absolute inset-0 z-20 flex items-center justify-center text-3xl sm:text-4xl md:text-5xl font-extrabold text-center px-4 transition-transform duration-500 group-hover:scale-105 text-${category.textColor}`}
                      style={{
                        textShadow: "2px 2px 10px rgba(0,0,0,0.5)",
                      }}
                    >
                      {category.name}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
