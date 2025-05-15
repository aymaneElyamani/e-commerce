"use client";

import { Button } from "@/components/ui/button";
import { createOrder } from "@/services/order";
import useAuthStore from "@/store/useAuthStore";
import useCartStore from "@/store/useCartStore";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

import { loadStripe } from '@stripe/stripe-js';
import Stripe from "stripe";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const CheckoutPage = () => {
  const { products, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { push } = useRouter();
    const [loading, setLoading] = useState(false); // 👈 loading state

  const totalPrice = products.reduce((total, product) => total + product.price * product.quantity, 0);

  // const handleCheckout = async () => {
  //   setLoading(true); // 👈 start loading
  //   const orderItems: OrderItem[] = products.map((p: AddToCardType) => ({
  //     product_id: p.idProduct,
  //     color: p.color,
  //     quantity: p.quantity,
  //     size: p.size,
  //   }));

  //   try {
  //     const orderResponse = await createOrder(user?.id!, orderItems);

  //     if (orderResponse && orderResponse.order_id) {
  //       toast.success("Order placed successfully!");
  //       clearCart();
  //       // push("/success");
  //     } else {
  //       toast.error("Something went wrong. Please try again.");
  //     }
  //   } catch (error) {
  //     toast.error("An error occurred while processing your order.");
  //   } finally {
  //     setLoading(false); // 👈 stop loading
  //   }
  // };

  type line = Stripe.Checkout.SessionCreateParams.LineItem;

  const handleCheckout = async () => {

    setLoading(true);
    const orderItems: OrderItem[] = products.map((p: AddToCardType) => ({
      product_id: p.idProduct,
      color: p.color,
      quantity: p.quantity,
      size: p.size,
    }));

    const items : line[] = products.map(e=>{ return {
       price_data: {
          currency: 'usd',

          product_data: {
            name: e.name
          },
          unit_amount: +e.price * e.quantity * 100,
        },
        quantity: e.quantity
    }})

   const res = await fetch('/api/checkout_sessions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    line_items: items
  })
});


    const data = await res.json();

    const stripe = await stripePromise;
    const result = await stripe?.redirectToCheckout({
      sessionId: data.sessionId,
    });
    
    console.log("user session")
    if (result?.error) {
      alert(result.error.message);
    }
    setLoading(false);
  };

  return (
    <main className="max-w-6xl mx-auto p-6">
      <motion.h1
        className="text-muted-foreground text-lg mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <span className="text-black font-semibold"><Link href={"/"}>Home</Link> / Checkout</span>
      </motion.h1>

      {products.length === 0 ? (
        <motion.div
          className="text-center text-gray-500 mt-32"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Your cart is empty.
        </motion.div>
      ) : (
        <motion.section
          className="space-y-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.1 },
            },
          }}
        >
          {products.map((product, index) => (
            <motion.div key={index} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
              <Card className="shadow-sm overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-4 items-center p-4">
                  {/* Product Image */}
                  {product.image_cover && (
                    <div className="relative w-[100px] h-[100px]">
                      <Image
                        src={product.image_cover}
                        alt={product.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                  )}

                  <div>
                    <CardHeader className="p-0 pb-2">
                      <CardTitle className="flex justify-between items-center text-base">
                        <span className="font-bold">{product.name}</span>
                        <span className="text-muted-foreground font-bold">${product.price}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 text-sm text-gray-700 space-y-1">
                      <div><span className="font-semibold">Quantity:</span> {product.quantity}</div>
                      <div><span className="font-semibold">Color:</span> {product.color}</div>
                      <div><span className="font-semibold">Size:</span> {product.size}</div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}

          <Separator />

          <motion.div
            className="text-right text-lg font-bold"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Total: ${totalPrice.toFixed(2)}
          </motion.div>

          <motion.div
            className="text-right"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button disabled = {loading} className="px-6 py-2 text-white bg-black hover:bg-gray-800" onClick={handleCheckout}>
              Checkout Now
            </Button>
          </motion.div>
        </motion.section>
      )}
    </main>
  );
};

export default CheckoutPage;
