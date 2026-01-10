"use client";

import { CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { HeartIcon } from "lucide-react";
import { IoEyeSharp } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import useCartStore from "@/store/useCartStore";
import useWishlistStore from "@/store/useWishList";
import { toast } from "sonner";
import useAuthStore from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { SIZES } from "@/constants";

function CardProduct({ product }: { product: Product }) {
  const { addProduct } = useCartStore();
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlistStore();

  const {isAuthenticated} = useAuthStore()

  const isFavorite = wishlist.find((e) => e.id === product.id);
  
  const router  = useRouter();

  const handleAdd = () => {


    if(!isAuthenticated){
      toast.info("You should log in first")
      router.push("/login");
      return;
    }

    const request: AddToCardType = {
      idCart : null,
      color: product.colors.length==0 ? "black"  : product.colors[0]      ,
      idProduct: product.id,
      image_cover: product.image_cover,
      name: product.name,
      price: product.price,
      size: SIZES[2],
      quantity: 1,
    };

    addProduct(request);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.015 }}
      className="relative group rounded-xl shadow-md bg-card border border-border overflow-hidden transition-all duration-300 "
    >
      {/* Product Image */}
      <div className="relative h-[250px] w-full overflow-hidden">
          <Image
            src={product.image_cover ?? "/images/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover w-full h-full"
            priority={false}
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
            className="bg-background/90 hover:bg-background rounded-full p-1 shadow"
            onClick={() => {
              if(!isAuthenticated){
      toast.info("You should log in first")
      router.push("/login");
      return;
    }
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
              <FaHeart className="text-destructive w-5 h-5" />
            ) : (
              <HeartIcon className="w-5 h-5 " />
            )}
          </Button>

          <Link href={`/products/${product.id}`}>
            <Button
              variant="ghost"
              size="icon"
              className="bg-background/90 hover:bg-background rounded-full p-1 shadow"
            >
              <IoEyeSharp className="w-5 h-5 text-foreground cursor-pointer" />
            </Button>
          </Link>
        </motion.div>
      </div>

      <CardContent className="p-4">
        {/* Product Title */}
        <h3 className="text-base font-bold text-primary line-clamp-1">
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
            <span className="font-bold text-primary">
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
            className="bg-primary text-primary-foreground px-4 py-1 text-xs font-semibold"
          >
            Add to Cart
          </Button>
        </div>

        {/* Discount badge */}
        {product.discount_percentage && (
          <div className="absolute top-3 left-3 bg-destructive text-primary-foreground text-[10px] px-2 py-1 rounded-full font-bold shadow-md">
            -{product.discount_percentage}%
          </div>
        )}
      </CardContent>
    </motion.div>
  );
}

export default CardProduct;
