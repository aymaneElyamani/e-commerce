
"use client"
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

export default function Home() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
   const res = await fetch('/api/checkout_sessions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Produit A'
          },
          unit_amount: 2000
        },
        quantity: 1
      },
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Produit B'
          },
          unit_amount: 3000
        },
        quantity: 2
      }
    ]
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
    <div style={{ padding: '2rem' }}>
      <h1>Buy Test Product</h1>
      <button onClick={handleCheckout} disabled={loading}>
        {loading ? 'Redirecting...' : 'Pay $20'}
      </button>
    </div>
  );
}
