import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      console.error('Missing STRIPE_SECRET_KEY environment variable');
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey);
    const { bookId, title, price } = await request.json();

    // Always prefer the production site URL for Stripe redirects.
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
    const appUrl = siteUrl || process.env.NEXT_PUBLIC_APP_URL?.trim() || request.nextUrl.origin;
    const normalizedAppUrl = appUrl.replace(/\/$/, '');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      metadata: {
        bookId,
      },
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: title,
              description: `Premium eBook: ${title}`,
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${normalizedAppUrl}/success?session_id={CHECKOUT_SESSION_ID}&book=${encodeURIComponent(bookId)}`,
      cancel_url: `${normalizedAppUrl}/product/${bookId}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
