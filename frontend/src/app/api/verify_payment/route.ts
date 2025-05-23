// This Map should be moved to a better scoped storage (e.g. Redis or DB in production)
const usedSessions = new Set<string>();

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function GET(request: NextRequest) {
  try {
    const session_id = request.nextUrl.searchParams.get('session_id');

    if (!session_id) {
      return NextResponse.json({ error: 'Session ID is missing' }, { status: 400 });
    }

    // Check if session_id has already been used
    if (usedSessions.has(session_id)) {
      return NextResponse.json({ error: 'Session ID already used' }, { status: 403 });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === 'paid') {
      // Mark session_id as used
      usedSessions.add(session_id);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false });
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
  }
}
