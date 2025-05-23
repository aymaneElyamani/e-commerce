"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useCartStore from "@/store/useCartStore";
import { loadStripe } from "@stripe/stripe-js";
import Stripe from "stripe";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);
type line = Stripe.Checkout.SessionCreateParams.LineItem;

const CheckoutPage = () => {
  const { products, updateProduct, removeProduct } = useCartStore();
  // const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const totalPrice = products.reduce((t, p) => t + p.price * p.quantity, 0);

  /* checkout handler here … (unchanged) */

  const handleCheckout = async () => {
    setLoading(true);
    // const orderItems: OrderItem[] = products.map((p: AddToCardType) => ({
    //   product_id: p.idProduct,
    //   color: p.color,
    //   quantity: p.quantity,
    //   size: p.size,
    // }));

    const items: line[] = products.map((e) => {
      return {
        price_data: {
          currency: "usd",

          product_data: {
            name: e.name,
          },
          // unit_amount: +e.price * e.quantity * 100,
          unit_amount: Math.round(e.price * 100),

        },
        quantity: e.quantity,
      };
    });

    const res = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        line_items: items,
      }),
    });

    const data = await res.json();

    const stripe = await stripePromise;
    const result = await stripe?.redirectToCheckout({
      sessionId: data.sessionId,
    });

    console.log("user session");
    if (result?.error) {
      alert(result.error.message);
    }
    setLoading(false);
  };

  /* helper to build an array 1..10 for qty select */
  const qtyOpts = Array.from({ length: 100 }, (_, i) => i + 1);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      {/* breadcrumb */}
      <motion.p
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-muted-foreground mb-8"
      >
        <Link href="/" className="text-black font-semibold">
          Home
        </Link>{" "}
        / checkout
      </motion.p>

      {products.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 mt-32"
        >
          Your cart is empty.
        </motion.p>
      ) : (
        <motion.section
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.06 },
            },
          }}
          className="space-y-8"
        >
          {/* ---------- CART TABLE ---------- */}
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm border-separate [border-spacing:0]">
              <thead>
                <tr className="bg-muted text-left text-gray-600 text-xs uppercase tracking-wider">
                  <th className="py-3 pl-6 w-1/2">Product</th>
                  <th className="py-3">Price</th>
                  <th className="py-3">Quantity</th>
      

                 
                  <th className="py-3 pr-6 text-right">Subtotal</th>
                  <th className="py-3 pr-6 text-right">Action</th>
          
                </tr>
              </thead>
              <tbody>
                {products.map((p,index) => (
                  <tr key={index} className="border-b last:border-none">
                    {/* product + thumb */}
                    <td className="py-4 pl-6">
                      <div className="flex items-center gap-4">
                        {p.image_cover && (
                          <div className="relative w-14 h-14 shrink-0">
                            <Image
                              src={p.image_cover}
                              alt={p.name}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                        )}

                        <div>
                          <p className="font-medium">{p.name}</p>
                          <p className="text-xs text-muted-foreground space-x-2">
                            <span>{p.color}</span>
                            <span>{p.size}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* unit price */}
                    <td className="py-4">${p.price}</td>

                    {/* qty select */}
                    <td className="py-4">
                      <div className="relative inline-block">
                        <select
                          value={p.quantity}
                          onChange={(e) =>
                          updateProduct(p.idCart!, { ...p, quantity: +e.target.value })
                          }
                          className="border rounded px-3 py-1 pr-6 text-center appearance-none"
                        >
                          {qtyOpts.map((q) => (
                            <option key={q}>{q.toString()}</option>
                          ))}
                        </select>
                        {/* chevron */}
                        <svg
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            d="M7 7l3 3 3-3"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </td>

                    {/* subtotal */}
                    <td className="py-4 pr-6 text-right font-medium">
                      ${(p.price * p.quantity).toFixed(2)}
                    </td>

                    <td className="py-4 pr-6 text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeProduct(p.idCart!)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ---------- ACTIONS + SUMMARY ---------- */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* left column: actions */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/" className="border px-6 py-2 rounded">
                  Return to shop
                </Link>
                {/* <Button
                  variant="outline"
                  onClick={() => {}}
                  className="px-6"
                >
                  Update cart
                </Button> */}
              </div>

              {/* coupon form */}
              <div className="flex flex-wrap gap-4">
                <input
                  placeholder="Coupon code"
                  className="border rounded px-4 py-2 w-52"
                />
                <Button className="bg-emerald-800 hover:bg-emerald-900">
                  Apply coupon
                </Button>
              </div>
            </div>

            {/* right column: total */}
            <div className="border p-6 space-y-4">
              <h3 className="font-semibold text-lg">Cart total</h3>
              <Separator />
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping:</span>
                <span className="font-medium">Free</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <Button
                disabled={loading}
                onClick={handleCheckout}
                className="w-full bg-emerald-800 hover:bg-emerald-900 mt-2"
              >
                Proceed to checkout
              </Button>
            </div>
          </div>
        </motion.section>
      )}
    </main>
  );
};

export default CheckoutPage;
