"use client";

import { createOrder } from "@/services/order";
import useAuthStore from "@/store/useAuthStore";
import useCartStore from "@/store/useCartStore";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const Success = () => {
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { products, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const handleOrder = useCallback(async () => {
    if (!user?.id) {
      toast.error("User not authenticated.");
      return;
    }

    const orderItems: OrderItem[] = products.map((p: AddToCardType) => ({
      product_id: p.idProduct,
      color: p.color,
      quantity: p.quantity,
      size: p.size,
    }));

    try {
      setLoading(true);
      const orderResponse = await createOrder(user.id, orderItems);

      if (orderResponse && orderResponse.order_id) {
        clearCart();
        // toast.success("Order placed successfully.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while processing your order.");
    } finally {
      setLoading(false);
    }
  }, [user?.id, products, clearCart]);

  useEffect(() => {
    const session_id = searchParams.get("session_id");
    if (session_id) {
      setSessionId(session_id);
    }
  }, [searchParams]);

  useEffect(() => {
    if (sessionId) {
      const verifyPaymentStatus = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/verify_payment?session_id=${sessionId}`);
          const data = await response.json();

          if (data.success) {
            await handleOrder();
          } else {
            toast.error("Payment was not successful.");
          }
        } catch {
          toast.error("An error occurred while verifying payment status.");
        } finally {
          setLoading(false);
        }
      };

      verifyPaymentStatus();
    }
  }, [sessionId, handleOrder]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 text-center">
      {loading ? (
        <p className="text-xl text-gray-700">Processing your order, please wait...</p>
      ) : (
        <>
          <CheckCircle className="text-green-500 w-20 h-20 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Received!</h1>
          <p className="text-gray-600 mb-4">
            Thank you for your purchase. A confirmation email with your invoice has been sent.
          </p>
          <Link href="/" className="text-blue-600 hover:underline">
            Back to Home
          </Link>
        </>
      )}
    </div>
  );
};

export default Success;
