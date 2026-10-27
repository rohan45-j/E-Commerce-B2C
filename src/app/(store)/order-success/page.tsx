import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatBDT } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface OrderSuccessProps {
  searchParams: Promise<{
    orderNumber?: string;
    token?: string;
    session_id?: string;
    demoPayment?: string;
  }>;
}

export default async function OrderSuccessPage({ searchParams }: OrderSuccessProps) {
  const { orderNumber, token, demoPayment } = await searchParams;

  let order = null;

  if (orderNumber) {
    try {
      order = await prisma.order.findUnique({
        where: { orderNumber },
        include: {
          items: true,
        },
      });
    } catch {
      // DB offline, order will be null
    }
  }

  const displayOrderNumber = order?.orderNumber || orderNumber || "ORD-2026-XXXXXX";
  const displayTotal = order ? formatBDT(order.totalAmount) : "BDT --";
  const displayPaymentMethod = order?.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment (Stripe)";
  const displayPaymentStatus = order?.paymentStatus || (demoPayment ? "PAID" : "PENDING");

  return (
    <div className="container py-12 md:py-16 max-w-2xl">
      <div className="rounded-3xl border bg-card p-6 sm:p-10 shadow-sm text-center space-y-6">
        {/* Success Icon */}
        <div className="h-16 w-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center animate-bounce">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Order Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            Thank You for Your Order!
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
            Your luxury order has been received and is now being prepared for dispatch at our Gulshan fulfillment facility.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="p-4 sm:p-6 rounded-2xl bg-muted/40 border text-left space-y-4">
          <div className="grid grid-cols-2 gap-4 text-xs pb-4 border-b">
            <div>
              <span className="text-muted-foreground block">Order Number</span>
              <strong className="text-sm font-black text-foreground tracking-wide">
                {displayOrderNumber}
              </strong>
            </div>

            <div className="text-right">
              <span className="text-muted-foreground block">Total Amount</span>
              <strong className="text-sm font-black text-emerald-600">
                {displayTotal}
              </strong>
            </div>

            <div>
              <span className="text-muted-foreground block">Payment Method</span>
              <strong className="font-semibold text-foreground">
                {displayPaymentMethod}
              </strong>
            </div>

            <div className="text-right">
              <span className="text-muted-foreground block">Payment Status</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-600 text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded-full">
                {displayPaymentStatus}
              </span>
            </div>
          </div>

          {/* Items Preview */}
          {order && order.items.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Ordered Items ({order.items.length})
              </h4>
              <div className="divide-y text-xs">
                {order.items.map((item) => (
                  <div key={item.id} className="py-2 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-foreground">{item.productName}</p>
                      {item.variantName && (
                        <p className="text-[10px] text-muted-foreground">Variant: {item.variantName}</p>
                      )}
                      <p className="text-[11px] text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-foreground">
                      {formatBDT(item.totalPrice)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delivery Reassurance */}
          <div className="p-3 rounded-xl bg-background border flex items-center gap-3 text-xs text-muted-foreground">
            <Truck className="h-5 w-5 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-foreground">Estimated Delivery Time:</p>
              <p>Inside Dhaka: 24-48 Hours | Outside Dhaka: 48-72 Hours</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href={`/track-order?orderNumber=${encodeURIComponent(displayOrderNumber)}${token ? `&token=${encodeURIComponent(token)}` : ""}`}
            className="flex-1"
          >
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-11">
              <Package className="h-4 w-4 mr-1.5" />
              Track This Order
            </Button>
          </Link>

          <Link href="/shop" className="flex-1">
            <Button variant="outline" className="w-full font-bold text-xs h-11">
              Continue Shopping
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
