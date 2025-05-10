'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Trash2Icon } from 'lucide-react';
import useCartStore from '@/store/useCartStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';

export default function AddToCart() {
  const { products, removeProduct } = useCartStore();

  const total = products.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="text-black">
          🛒 Cart ({products.length})
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:w-[400px] p-5">
        <SheetTitle className="text-xl font-bold mb-4">Your Cart</SheetTitle>

        {products.length === 0 ? (
          <p className="text-sm text-gray-500">Your cart is empty.</p>
        ) : (
          <ScrollArea className="h-[calc(100vh-200px)]">
            <ul className="space-y-4">
              {products.map((item, index) => (
                <li key={index} className="flex items-center gap-4 border-b pb-3">
                  {item.image_cover && (
                    <img
                      src={item.image_cover}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="rounded"
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">
                      ${item.price} × {item.quantity || 1}
                    </div>
                  </div>
                  <div className="font-semibold">
                    ${(item.price * (item.quantity || 1)).toFixed(2)}
                  </div>

                  <Button
                    variant="ghost"
                    className="p-1"
                    onClick={() => removeProduct(item.idProduct)}
                  >
                    <Trash2Icon className="w-4 h-4 text-red-500" />
                  </Button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}

        <div className="mt-2 border-t pt-4 text-lg font-semibold flex justify-between">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>

        {products.length > 0 && (
          <Link href={"/checkout"}>
          
          <Button className="mt-2 w-full sticky bottom-0 left-0 z-10">
            Checkout
          </Button>
          </Link>
        )}
      </SheetContent>
    </Sheet>
  );
}
