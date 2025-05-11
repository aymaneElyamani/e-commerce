"use client";

import { CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { HeartIcon } from "lucide-react";
import { IoEyeSharp } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";
import useCartStore from "@/store/useCartStore";
import useWishlistStore from "@/store/useWishList";
import { toast } from "sonner";

function CardProduct({ product }: { product: Product }) {
  const { addProduct } = useCartStore();
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlistStore();

  const isFavorite = wishlist.find((e) => e.id === product.id);

  const handleAdd = () => {
    const request: AddToCardType = {
      color: product.colors[0],
      idProduct: product.id,
      image_cover: product.image_cover,
      name: product.name,
      price: product.price,
      size: "M",
      quantity: 1,
    };

    addProduct(request);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.015 }}
      className="relative group rounded-xl shadow-md bg-white border border-gray-100 overflow-hidden transition-all duration-300"
    >
      {/* Product Image */}
      <div className="relative h-[250px] w-full overflow-hidden">
        <img
          src={product.image_cover ?? ""}
          alt={product.name}
          className="object-cover w-full h-full"
        />

        {/* Hovered icons container */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/90 hover:bg-white rounded-full p-1 shadow"
            onClick={() => {
              if (isFavorite) {
                removeFromWishlist(product.id);
                toast.message(`${product.name} removed from wishlist`);
              } else {
                addToWishlist(product);
                toast.message(`${product.name} added to wishlist`);
              }
            }}
          >
            {isFavorite ? (
              <FaHeart className="text-red-500 w-5 h-5" />
            ) : (
              <HeartIcon className="w-5 h-5 " />
            )}
          </Button>

          <Link href={`/products/${product.id}`}>
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/90 hover:bg-white rounded-full p-1 shadow"
            >
              <IoEyeSharp className="w-5 h-5 text-gray-800 cursor-pointer" />
            </Button>
          </Link>
        </motion.div>
      </div>

      <CardContent className="p-4">
        {/* Product Title */}
        <h3 className="text-base font-bold text-[#337a5b] line-clamp-1">
          {product.name}
        </h3>

        {/* Price and Add button */}
        <div className="flex items-center justify-between mt-3">
          <div className="space-x-2 text-sm">
            {product.discount_percentage && (
              <span className="line-through text-muted-foreground">
                ${product.price}
              </span>
            )}
            <span className="font-bold text-[#337a5b]">
              $
              {product.discount_percentage
                ? (
                    product.price -
                    (product.price * product.discount_percentage) / 100
                  ).toFixed(2)
                : product.price}
            </span>
          </div>

          <Button
            onClick={handleAdd}
            size="sm"
            className="bg-[#337a5b] text-white px-4 py-1 text-xs font-semibold"
          >
            Add to Cart
          </Button>
        </div>

        {/* Discount badge */}
        {product.discount_percentage && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-md">
            -{product.discount_percentage}%
          </div>
        )}
      </CardContent>
    </motion.div>
  );
}

export default CardProduct;
