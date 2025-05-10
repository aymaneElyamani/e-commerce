"use client"
import CardProduct from "@/components/cardProduct";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HeartIcon } from "lucide-react";
import { JSX, useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "../loading";

export const ProductShowcaseSection = (): JSX.Element => {
  // Product data to map over

  const [loading, setLoading] = useState<boolean>(true); // 👈 loading state

  const [products, setProducts] = useState<Product[]>([]);
  

  const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/products?elements=8`;

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
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        toast.error('Failed to load products.');
      })
      .finally(() => {
        setLoading(false); // 👈 Done loading
      });
  }, []);

  
  // const products = [
  //   {
  //     id: 1,
  //     name: "Cactus Plant",
  //     originalPrice: "$10",
  //     price: "$8",
  //     image: "/image-4.png",
  //     isLiked: false,
  //     isFeatured: true,
  //   },
  //   {
  //     id: 2,
  //     name: "Cactus Plant",
  //     originalPrice: "$10",
  //     price: "$8",
  //     image: "/image-7-1.png",
  //     isLiked: false,
  //     isFeatured: false,
  //   },
  //   {
  //     id: 3,
  //     name: "Cactus Plant",
  //     originalPrice: "$10",
  //     price: "$8",
  //     image: "/image-8.png",
  //     isLiked: false,
  //     isFeatured: false,
  //   },
  //   {
  //     id: 4,
  //     name: "Cactus Plant",
  //     originalPrice: "$10",
  //     price: "$8",
  //     image: "/image-10.png",
  //     isLiked: false,
  //     isFeatured: false,
  //   },
  //   {
  //     id: 5,
  //     name: "Cactus Plant",
  //     originalPrice: "$10",
  //     price: "$8",
  //     image: "/image-5.png",
  //     isLiked: false,
  //     isFeatured: false,
  //   },
  //   {
  //     id: 6,
  //     name: "Cactus Plant",
  //     originalPrice: "$10",
  //     price: "$8",
  //     image: "/image-6.png",
  //     isLiked: false,
  //     isFeatured: false,
  //   },
  //   {
  //     id: 7,
  //     name: "Cactus Plant",
  //     originalPrice: "$10",
  //     price: "$8",
  //     image: "/image-9.png",
  //     isLiked: false,
  //     isFeatured: false,
  //   },
  //   {
  //     id: 8,
  //     name: "Cactus Plant",
  //     originalPrice: "$10",
  //     price: "$8",
  //     image: "/image-7.png",
  //     isLiked: false,
  //     isFeatured: false,
  //   },
  // ];


  if(loading){
    return <Loading />
  }
  return ( 

    
    <section className="w-full max-w-[1201px] mx-auto py-16">
      <h2 className="text-center text-2xl text-[#285a43] font-normal tracking-[1.44px] leading-[50.4px] mb-10 font-['Lato',Helvetica] [-webkit-text-stroke:1.1px_#285a43]">
        What We Offer To You
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product  , index) => (

          <CardProduct product={ product} key={index}/>


        ))}
      </div>
    </section>
  );
};
