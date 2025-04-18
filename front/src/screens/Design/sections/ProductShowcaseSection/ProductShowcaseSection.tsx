import { HeartIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

export const ProductShowcaseSection = (): JSX.Element => {
  // Product data to map over
  const products = [
    {
      id: 1,
      name: "Cactus Plant",
      originalPrice: "$10",
      price: "$8",
      image: "/image-4.png",
      isLiked: false,
      isFeatured: true,
    },
    {
      id: 2,
      name: "Cactus Plant",
      originalPrice: "$10",
      price: "$8",
      image: "/image-7-1.png",
      isLiked: false,
      isFeatured: false,
    },
    {
      id: 3,
      name: "Cactus Plant",
      originalPrice: "$10",
      price: "$8",
      image: "/image-8.png",
      isLiked: false,
      isFeatured: false,
    },
    {
      id: 4,
      name: "Cactus Plant",
      originalPrice: "$10",
      price: "$8",
      image: "/image-10.png",
      isLiked: false,
      isFeatured: false,
    },
    {
      id: 5,
      name: "Cactus Plant",
      originalPrice: "$10",
      price: "$8",
      image: "/image-5.png",
      isLiked: false,
      isFeatured: false,
    },
    {
      id: 6,
      name: "Cactus Plant",
      originalPrice: "$10",
      price: "$8",
      image: "/image-6.png",
      isLiked: false,
      isFeatured: false,
    },
    {
      id: 7,
      name: "Cactus Plant",
      originalPrice: "$10",
      price: "$8",
      image: "/image-9.png",
      isLiked: false,
      isFeatured: false,
    },
    {
      id: 8,
      name: "Cactus Plant",
      originalPrice: "$10",
      price: "$8",
      image: "/image-7.png",
      isLiked: false,
      isFeatured: false,
    },
  ];

  return (
    <section className="w-full max-w-[1201px] mx-auto py-16">
      <h2 className="text-center text-2xl text-[#285a43] font-normal tracking-[1.44px] leading-[50.4px] mb-10 font-['Lato',Helvetica] [-webkit-text-stroke:1.1px_#285a43]">
        What We Offer To You
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card
            key={product.id}
            className="w-full rounded-[10px] border border-solid border-[#00000008] shadow-[10px_10px_20px_#00000005] overflow-hidden"
          >
            <div className="relative w-full h-[250px]">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${product.image})` }}
              />
              <Button
                variant="outline"
                size="icon"
                className="absolute top-[15px] right-[15px] w-8 h-8 rounded-2xl bg-white p-0 border-none"
              >
                <HeartIcon className="w-5 h-5" />
              </Button>
            </div>

            <CardContent className="p-0">
              <div className="pt-2 px-6 pb-4">
                <h3 className="font-black text-[#337a5b] text-base tracking-[0] leading-[22.4px] font-['Lato',Helvetica]">
                  {product.name}
                </h3>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    <span className="opacity-50 font-normal text-[#121212] text-xs tracking-[0] leading-[16.8px] line-through font-['Lato',Helvetica]">
                      ({product.originalPrice})
                    </span>
                    <span className="font-bold text-[#337a5b] text-xs tracking-[0] leading-[16.8px] font-['Lato',Helvetica]">
                      {product.price}
                    </span>
                  </div>

                  <Button
                    variant={product.isFeatured ? "default" : "outline"}
                    className={`px-6 py-2 rounded-[3px] text-xs font-black leading-[16.8px] h-auto ${
                      product.isFeatured
                        ? "bg-[#337a5b] text-white"
                        : "border-[#337a5b99] text-[#337a5b]"
                    } font-['Lato',Helvetica]`}
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
