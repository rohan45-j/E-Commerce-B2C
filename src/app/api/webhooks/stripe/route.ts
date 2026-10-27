import { NextRequest, NextResponse } from "next/server";
import { PaymentService } from "@/server/services/payment.service";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature");

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret || webhookSecret.includes("placeholder")) {
      // Secret not configured; acknowledge to avoid webhook retries
      return NextResponse.json({ received: true, note: "Webhook secret not configured" });
    }

    if (!signature) {
      return NextResponse.json({ error: "Missing stripe signature" }, { status: 400 });
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY || "";
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2025-01-27.acacia" as unknown as Stripe.LatestApiVersion,
    });

    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

    await PaymentService.handleStripeWebhook(event);

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Webhook handler failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
