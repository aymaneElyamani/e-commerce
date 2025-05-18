"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartOff, ShoppingCart } from "lucide-react";
import useWishlistStore from "@/store/useWishList";
import Image from "next/image";
import useAuthStore from "@/store/useAuthStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

function Page() {
  const { wishlist, removeFromWishlist } = useWishlistStore();
  const {  isAuthenticated } = useAuthStore(); // Get user data
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>

      {wishlist.length === 0 ? (
        <p className="text-muted-foreground text-center mt-20 text-lg">
          Your wishlist is empty ❤️
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlist.map((product) => (
            <Card
              key={product.id}
              className="rounded-2xl shadow-sm hover:shadow-md transition"
            >
              <CardContent className="p-4">
                <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={product.image_cover || "/placeholder.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  ${product.price}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between p-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeFromWishlist(product.id)}
                >
                  <HeartOff className="w-4 h-4 mr-2" />
                  Remove
                </Button>
                <Button size="sm">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default Page;
