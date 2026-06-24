// Stripe webhook handler — processes checkout.session.completed events and creates Order records.
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  let event;

  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const stripe = getStripe();
    const sessionWithItems = await stripe.checkout.sessions.retrieve(
      session.id,
      { expand: ["line_items"] }
    );
    const items = sessionWithItems.line_items?.data.map((item) => ({
      name: item.description,
      price: item.amount_total,
      quantity: item.quantity,
    })) || [];

    await prisma.order.create({
      data: {
        customerEmail: session.customer_details?.email || "unknown",
        customerName: session.customer_details?.name || "Unknown",
        items,
        total: session.amount_total || 0,
        status: "paid",
        paymentIntent: session.payment_intent as string,
      },
    });
  }

  return NextResponse.json({ received: true });
}
