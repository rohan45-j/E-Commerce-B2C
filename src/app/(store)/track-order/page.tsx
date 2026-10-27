import { prisma } from "@/lib/prisma";
import { formatBDT } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Package,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  AlertCircle,
} from "lucide-react";
import { OrderStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

interface TrackOrderPageProps {
  searchParams: Promise<{
    orderNumber?: string;
    token?: string;
  }>;
}

const STEPPER_STAGES = [
  { status: OrderStatus.PENDING, label: "Order Placed", desc: "We have received your order" },
  { status: OrderStatus.CONFIRMED, label: "Confirmed", desc: "Verified and approved by merchant" },
  { status: OrderStatus.PROCESSING, label: "Packed & Ready", desc: "Packed at Gulshan fulfillment hub" },
  { status: OrderStatus.SHIPPED, label: "Shipped", desc: "Handed over to courier service" },
  { status: OrderStatus.OUT_FOR_DELIVERY, label: "Out for Delivery", desc: "Courier rider is on the way" },
  { status: OrderStatus.DELIVERED, label: "Delivered", desc: "Successfully delivered to your doorstep" },
];

export default async function TrackOrderPage({ searchParams }: TrackOrderPageProps) {
  const params = await searchParams;
  const orderNumber = params.orderNumber || "";
  const token = params.token || "";

  let order = null;
  const lookupId = orderNumber || token;

  if (lookupId) {
    try {
      // Find order either by unique orderNumber or trackingToken
      order = await prisma.order.findFirst({
        where: {
          OR: [
            { orderNumber: lookupId.trim().toUpperCase() },
            { trackingToken: lookupId.trim() },
          ],
        },
        include: {
          items: true,
          statusHistory: { orderBy: { createdAt: "desc" } },
          shipments: { orderBy: { createdAt: "desc" }, take: 1 },
        },
      });
    } catch {
      // If DB is offline during build
      order = null;
    }
  }

  // Parse delivery address
  let addressObj: Record<string, string> = {};
  if (order?.shippingAddress) {
    try {
      addressObj = JSON.parse(order.shippingAddress);
    } catch {
      addressObj = { addressLine: order.shippingAddress };
    }
  }

  // Compute current stage index
  const currentStageIndex = order
    ? STEPPER_STAGES.findIndex((s) => s.status === order.status)
    : -1;

  return (
    <div className="container py-8 md:py-16 max-w-4xl space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
          <Truck className="h-7 w-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
          Track Your Delivery
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
          Enter your Order Number (e.g. ORD-2026-XXXXXX) or tracking token to view real-time parcel dispatch status.
        </p>
      </div>

      {/* Lookup Form */}
      <form
        action="/track-order"
        method="GET"
        className="p-4 sm:p-6 rounded-3xl border bg-card shadow-sm flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            name="orderNumber"
            required
            defaultValue={orderNumber}
            placeholder="Order # (e.g. ORD-2026-104928)"
            className="pl-10 text-xs h-11 uppercase font-semibold"
          />
        </div>
        <Button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-11 px-6"
        >
          Track Order
        </Button>
      </form>

      {/* Result Section */}
      {lookupId && (
        <div className="space-y-8">
          {!order ? (
            <div className="p-12 text-center rounded-3xl border bg-card space-y-4">
              <AlertCircle className="h-12 w-12 text-amber-500 mx-auto" />
              <h3 className="text-lg font-bold">Order Not Found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                We could not locate an order matching &ldquo;{lookupId}&rdquo;. Please verify the order number from your confirmation SMS or email.
              </p>
              <div className="pt-2 text-xs text-muted-foreground">
                Need urgent help? Call our KinaKati Concierge: <strong>+880 9612-000000</strong>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border bg-card shadow-sm overflow-hidden divide-y">
              {/* Summary Header */}
              <div className="p-6 sm:p-8 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-black text-foreground">{order.orderNumber}</h2>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Placed on {new Date(order.createdAt).toLocaleDateString("en-US", { dateStyle: "long" })}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-muted-foreground block">Total Payable</span>
                  <span className="text-xl font-black text-emerald-600">
                    {formatBDT(order.totalAmount)}
                  </span>
                  <span className="text-[10px] block text-muted-foreground uppercase font-semibold mt-0.5">
                    {order.paymentMethod} • {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Stepper Timeline */}
              <div className="p-6 sm:p-8 space-y-6">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-600" />
                  Delivery Progress Stepper
                </h3>

                <div className="relative">
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    {STEPPER_STAGES.map((stage, idx) => {
                      const isComplete = currentStageIndex >= idx;
                      const isCurrent = currentStageIndex === idx;

                      return (
                        <div
                          key={stage.status}
                          className={`p-3 rounded-2xl border transition-all ${
                            isCurrent
                              ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-600/20"
                              : isComplete
                              ? "border-emerald-500/40 bg-muted/20"
                              : "border-border/60 opacity-50"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <div
                              className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                isComplete
                                  ? "bg-emerald-600 text-white"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {isComplete ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                            </div>
                            <span className="text-xs font-bold">{stage.label}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground leading-tight">
                            {stage.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Courier & Shipment Details */}
              {order.shipments.length > 0 && (
                <div className="p-6 sm:p-8 bg-emerald-50/30 dark:bg-emerald-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-foreground">
                        Courier: {order.shipments[0].courierName}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Consignment # <strong className="text-foreground">{order.shipments[0].trackingNumber}</strong>
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    In Transit
                  </span>
                </div>
              )}

              {/* Destination & Ordered Items */}
              <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Destination */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                    Shipping Destination
                  </h4>
                  <div className="p-4 rounded-2xl bg-muted/30 border text-xs space-y-1">
                    <p className="font-bold text-foreground">{addressObj.recipientName || order.customerName}</p>
                    <p className="text-muted-foreground">{addressObj.addressLine}</p>
                    <p className="text-muted-foreground">{addressObj.upazila}, {addressObj.district}, {addressObj.division}</p>
                    <p className="text-muted-foreground pt-1">Phone: {order.customerPhone}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Package className="h-3.5 w-3.5 text-emerald-600" />
                    Items in Parcel ({order.items.length})
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {order.items.map((item) => (
                      <div key={item.id} className="p-3 rounded-xl border bg-muted/20 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-semibold text-foreground">{item.productName}</p>
                          {item.variantName && (
                            <p className="text-[10px] text-muted-foreground">Variant: {item.variantName}</p>
                          )}
                          <p className="text-[10px] text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-bold text-foreground">
                          {formatBDT(item.totalPrice)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
