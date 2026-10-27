import { PaymentMethod, PaymentStatus, OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export interface PaymentSessionResponse {
  redirectUrl: string;
  sessionId?: string;
  isMock?: boolean;
}

export class PaymentService {
  private static stripeClient: Stripe | null = null;

  private static getStripe() {
    if (!this.stripeClient && process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes("placeholder")) {
      this.stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2025-01-27.acacia" as unknown as Stripe.LatestApiVersion,
      });
    }
    return this.stripeClient;
  }

  /**
   * Process payment flow for given order
   */
  static async processPayment(
    order: {
      id: string;
      orderNumber: string;
      trackingToken: string;
      totalAmount: number;
      customerEmail: string;
      customerName: string;
    },
    method: PaymentMethod,
    originUrl: string
  ): Promise<PaymentSessionResponse> {
    if (method === PaymentMethod.COD) {
      // Cash on Delivery - no online redirect required
      return {
        redirectUrl: `${originUrl}/order-success?orderNumber=${order.orderNumber}&token=${order.trackingToken}`,
      };
    }

    if (method === PaymentMethod.STRIPE) {
      const stripe = this.getStripe();

      if (stripe) {
        // Real Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          customer_email: order.customerEmail,
          line_items: [
            {
              price_data: {
                currency: "bdt",
                product_data: {
                  name: `KinaKati Order ${order.orderNumber}`,
                  description: `Luxury items order placed by ${order.customerName}`,
                },
                unit_amount: order.totalAmount, // amount in poisha
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${originUrl}/order-success?orderNumber=${order.orderNumber}&token=${order.trackingToken}&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${originUrl}/checkout?canceled=true&orderNumber=${order.orderNumber}`,
          metadata: {
            orderId: order.id,
            orderNumber: order.orderNumber,
          },
        });

        // Record initial payment record
        await prisma.payment.create({
          data: {
            orderId: order.id,
            provider: PaymentMethod.STRIPE,
            transactionId: session.id,
            amount: order.totalAmount,
            currency: "BDT",
            status: PaymentStatus.PENDING,
            providerPayload: JSON.stringify({ sessionId: session.id }),
          },
        });

        return {
          redirectUrl: session.url || `${originUrl}/order-success?orderNumber=${order.orderNumber}&token=${order.trackingToken}`,
          sessionId: session.id,
        };
      } else {
        // Fallback demo/mock mode when Stripe key is placeholder
        await prisma.payment.create({
          data: {
            orderId: order.id,
            provider: PaymentMethod.STRIPE,
            transactionId: `mock_stripe_${Date.now()}`,
            amount: order.totalAmount,
            currency: "BDT",
            status: PaymentStatus.PAID,
            providerPayload: JSON.stringify({ demoMode: true }),
          },
        });

        // Automatically mark paid in demo mode
        await prisma.order.update({
          where: { id: order.id },
          data: { paymentStatus: PaymentStatus.PAID },
        });

        return {
          redirectUrl: `${originUrl}/order-success?orderNumber=${order.orderNumber}&token=${order.trackingToken}&demoPayment=true`,
          isMock: true,
        };
      }
    }

    // Default fallback
    return {
      redirectUrl: `${originUrl}/order-success?orderNumber=${order.orderNumber}&token=${order.trackingToken}`,
    };
  }

  /**
   * Handle Stripe webhook callback
   */
  static async handleStripeWebhook(event: Stripe.Event) {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        await prisma.$transaction(async (tx) => {
          await tx.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: PaymentStatus.PAID,
              status: OrderStatus.CONFIRMED,
            },
          });

          await tx.payment.upsert({
            where: { transactionId: session.id },
            update: {
              status: PaymentStatus.PAID,
              providerPayload: JSON.stringify(session),
            },
            create: {
              orderId,
              provider: PaymentMethod.STRIPE,
              transactionId: session.id,
              amount: session.amount_total || 0,
              currency: "BDT",
              status: PaymentStatus.PAID,
              providerPayload: JSON.stringify(session),
            },
          });

          await tx.orderStatusHistory.create({
            data: {
              orderId,
              fromStatus: OrderStatus.PENDING,
              toStatus: OrderStatus.CONFIRMED,
              notes: `Payment completed via Stripe (Session: ${session.id})`,
            },
          });
        });
      }
    }
  }
}
