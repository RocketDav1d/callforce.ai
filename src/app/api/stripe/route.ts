// /api/stripe

import prisma from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { getServerSession } from 'next-auth'; // Ensure this is the right path to getServerSession
import authOptions from '@/lib/auth'
import { NextResponse } from "next/server";

const return_url = process.env.NEXT_BASE_URL_PROD + "/settings";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: 'User not authenticated' }, {status: 401});
    }
    const userEmail = session.user.email;
    if (!userEmail) {
    return NextResponse.json({ error: 'User not authenticated' }, {status: 409});
    }
    const user = await prisma.user.findUnique({
        where: { email: userEmail },
    });
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, {status: 404});
    }
    const userId = user.id;
    if (!userId) {
      return new NextResponse("unauthorized", { status: 401 });
    }

    const userSubscription = await prisma.userSubscription.findUnique({
        where: { userId: userId }
    });
    
    if (userSubscription && userSubscription.stripeCustomerId) {
        // Proceeding to cancel at the billing portal
        const stripeSession = await stripe.billingPortal.sessions.create({
            customer: userSubscription.stripeCustomerId,
            return_url,
        });
        return NextResponse.json({ url: stripeSession.url });
    }

    // user's first time trying to subscribe
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: return_url,
      cancel_url: return_url,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: userEmail,
      line_items: [
        {
          price_data: {
            currency: "USD",
            product_data: {
              name: "ChatPDF Pro",
              description: "Unlimited PDF sessions!",
            },
            unit_amount: 2000,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
    });
    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.log("stripe error", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
