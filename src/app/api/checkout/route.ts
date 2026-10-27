import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { OrderService } from "@/server/services/order.service";
import { PaymentService } from "@/server/services/payment.service";
import { PaymentMethod } from "@prisma/client";
import { z } from "zod";

export const dynamic = "force-dynamic";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerPhone: z.string().min(10, "Phone number must be valid"),
  customerEmail: z.string().email("Valid email required"),
  shippingAddress: z.object({
    recipientName: z.string().min(2),
    phone: z.string().min(10),
    email: z.string().email(),
    division: z.string().min(2),
    district: z.string().min(2),
    upazila: z.string().min(2),
    addressLine: z.string().min(5),
    deliveryInstructions: z.string().optional(),
    shippingZone: z.enum(["INSIDE_DHAKA", "OUTSIDE_DHAKA"]),
  }),
  items: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string().nullable().optional(),
      quantity: z.number().int().min(1),
    })
  ).min(1, "At least one item required"),
  couponCode: z.string().optional(),
  paymentMethod: z.nativeEnum(PaymentMethod),
  customerNotes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();

    const validated = checkoutSchema.parse(body);

    // Call server-authoritative order creation
    const order = await OrderService.createOrder({
      userId: session?.user?.id || null,
      customerName: validated.customerName,
      customerEmail: validated.customerEmail,
      customerPhone: validated.customerPhone,
      shippingAddress: validated.shippingAddress,
      items: validated.items,
      couponCode: validated.couponCode,
      paymentMethod: validated.paymentMethod,
      customerNotes: validated.customerNotes,
    });

    const origin = req.nextUrl.origin;

    // Process payment session
    const paymentResult = await PaymentService.processPayment(
      {
        id: order.id,
        orderNumber: order.orderNumber,
        trackingToken: order.trackingToken,
        totalAmount: order.totalAmount,
        customerEmail: order.customerEmail,
        customerName: order.customerName,
      },
      validated.paymentMethod,
      origin
    );

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      trackingToken: order.trackingToken,
      redirectUrl: paymentResult.redirectUrl,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to process checkout";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
