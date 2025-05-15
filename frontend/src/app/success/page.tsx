"use client";

import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";


const Success = () => {
  const searchParams = useSearchParams(); // Get the search params from the URL
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Extract session_id from URL query string using useSearchParams
    const session_id = searchParams.get('session_id');

    console.log("helloooo", session_id);

    if (session_id) {
      setSessionId(session_id);
    }
  }, [searchParams]);

  useEffect(() => {
    if (sessionId) {
      const verifyPaymentStatus = async () => {
        try {
          const response = await fetch(`/api/verify_payment?session_id=${sessionId}`);
          const data = await response.json();
          
          if (data.success) {
            
            toast.success('Payment was successful!');
            // You can create the order here or trigger any other action
          } else {
            toast.error('Payment was not successful.');
          }
        } catch (error) {
          toast.error('An error occurred while verifying payment status.');
        }
      };

      verifyPaymentStatus();
    }
  }, [sessionId]);



  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 text-center">
      <CheckCircle className="text-green-500 w-20 h-20 mb-4" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Received!</h1>
      <p className="text-gray-600 mb-4">
        Thank you for your purchase. A confirmation email with your invoice has been sent.
      </p>
      <Link href="/" className="text-blue-600 hover:underline">
        Back to Home
      </Link>
    </div>
  );
}


export default Success